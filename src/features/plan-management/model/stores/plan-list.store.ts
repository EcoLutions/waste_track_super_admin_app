import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {PlanCatalogService} from '@entities/plan-catalog/api';
import {firstValueFrom} from 'rxjs';

interface PlanListState {
  plans: PlanCatalogEntity[];
  selectedPlan: PlanCatalogEntity | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlanListState = {
  plans: [],
  selectedPlan: null,
  searchTerm: '',
  isLoading: false,
  error: null
};

export const PlanListStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    filteredPlans: computed(() => {
      const plans = store.plans();
      const term = store.searchTerm().toLowerCase().trim();

      if (!term) return plans;

      return plans.filter(plan =>
        plan.name.toLowerCase().includes(term)
      );
    }),
  })),

  withComputed((store) => ({
    hasPlans: computed(() => store.plans().length > 0),
    hasFilteredPlans: computed(() => store.filteredPlans().length > 0),
    plansCount: computed(() => store.plans().length),
    filteredPlansCount: computed(() => store.filteredPlans().length),
  })),

  withMethods((store) => {
    const planService = inject(PlanCatalogService);

    return {
      async loadPlans(): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          const plans = await firstValueFrom(planService.getAll());
          patchState(store, {
            plans,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al cargar los planes',
            isLoading: false,
            plans: []
          });
        }
      },

      async createPlan(plan: PlanCatalogEntity): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          const newPlan = await firstValueFrom(planService.create(plan));
          patchState(store, {
            plans: [...store.plans(), newPlan],
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al crear el plan',
            isLoading: false
          });
          throw error;
        }
      },

      async updatePlan(plan: Partial<PlanCatalogEntity>): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          const updatedPlan = await firstValueFrom(planService.update(plan));
          const updatedPlans = store.plans().map(p =>
            p.id === updatedPlan.id ? updatedPlan : p
          );
          patchState(store, {
            plans: updatedPlans,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al actualizar el plan',
            isLoading: false
          });
          throw error;
        }
      },

      async deletePlan(id: string): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          await firstValueFrom(planService.delete(id));
          const updatedPlans = store.plans().filter(p => p.id !== id);
          patchState(store, {
            plans: updatedPlans,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al eliminar el plan',
            isLoading: false
          });
          throw error;
        }
      },

      setSearchTerm(searchTerm: string): void {
        patchState(store, { searchTerm });
      },

      selectPlan(plan: PlanCatalogEntity | null): void {
        patchState(store, { selectedPlan: plan });
      },

      clearError(): void {
        patchState(store, { error: null });
      },

      reset(): void {
        patchState(store, initialState);
      }
    };
  })
);
