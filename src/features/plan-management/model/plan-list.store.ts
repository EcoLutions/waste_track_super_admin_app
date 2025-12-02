import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { PlanCatalogEntity } from '@entities/plan-catalog/model';
import { PlanCatalogService } from '@entities/plan-catalog/api';
import { BillingPeriodEnum } from '@shared/model';
import { firstValueFrom } from 'rxjs';

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
  error: null,
};

export const PlanListStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    filteredPlans: computed(() => {
      const plans = store.plans();
      const term = store.searchTerm().toLowerCase().trim();

      if (!term) return plans;

      return plans.filter((plan) => plan.name.toLowerCase().includes(term));
    }),

    monthlyPlans: computed(() =>
      store.plans().filter((plan) => plan.billingPeriod === BillingPeriodEnum.MONTHLY)
    ),

    yearlyPlans: computed(() =>
      store.plans().filter((plan) => plan.billingPeriod === BillingPeriodEnum.ANNUAL)
    ),
  })),

  withComputed((store) => ({
    hasPlans: computed(() => store.plans().length > 0),
    hasFilteredPlans: computed(() => store.filteredPlans().length > 0),
    plansCount: computed(() => store.plans().length),
    filteredPlansCount: computed(() => store.filteredPlans().length),
    monthlyPlansCount: computed(() => store.monthlyPlans().length),
    yearlyPlansCount: computed(() => store.yearlyPlans().length),
    isSearching: computed(() => store.searchTerm().trim().length > 0),
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
            error: null,
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al cargar los planes',
            isLoading: false,
            plans: [],
          });
        }
      },

      async deletePlan(id: string): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          await firstValueFrom(planService.delete(id));
          const updatedPlans = store.plans().filter((p) => p.id !== id);

          patchState(store, {
            plans: updatedPlans,
            selectedPlan: store.selectedPlan()?.id === id ? null : store.selectedPlan(),
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al eliminar el plan',
            isLoading: false,
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

      clearSearch(): void {
        patchState(store, { searchTerm: '' });
      },

      reset(): void {
        patchState(store, initialState);
      },
    };
  })
);
