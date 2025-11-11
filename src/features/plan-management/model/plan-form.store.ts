import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { PlanCatalogEntity } from '@entities/plan-catalog/model';
import { PlanCatalogService } from '@entities/plan-catalog/api';
import { firstValueFrom } from 'rxjs';

interface PlanFormState {
  plan: PlanCatalogEntity | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: PlanFormState = {
  plan: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const PlanFormStore = signalStore(
  withState(initialState),

  withComputed((store) => ({
    isEditMode: computed(() => store.plan() !== null),
    canSave: computed(() => !store.isSaving() && !store.isLoading()),
  })),

  withMethods((store) => {
    const planService = inject(PlanCatalogService);

    return {
      async loadPlan(id: string): Promise<void> {
        patchState(store, { isLoading: true, error: null });

        try {
          const plan = await firstValueFrom(planService.getById(id));
          patchState(store, {
            plan,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al cargar el plan',
            isLoading: false,
            plan: null,
          });
        }
      },

      async createPlan(planData: Omit<PlanCatalogEntity, 'id'>): Promise<PlanCatalogEntity> {
        patchState(store, { isSaving: true, error: null });

        try {
          const newPlan = await firstValueFrom(planService.create(planData as PlanCatalogEntity));
          patchState(store, {
            plan: newPlan,
            isSaving: false,
            error: null,
          });
          return newPlan;
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al crear el plan',
            isSaving: false,
          });
          throw error;
        }
      },

      async updatePlan(id: string, planData: Partial<PlanCatalogEntity>): Promise<PlanCatalogEntity> {
        patchState(store, { isSaving: true, error: null });

        try {
          const updatedPlan = await firstValueFrom(planService.update({ ...planData, id }));
          patchState(store, {
            plan: updatedPlan,
            isSaving: false,
            error: null,
          });
          return updatedPlan;
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al actualizar el plan',
            isSaving: false,
          });
          throw error;
        }
      },

      clearError(): void {
        patchState(store, { error: null });
      },

      reset(): void {
        patchState(store, initialState);
      },
    };
  })
);
