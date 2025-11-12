import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState,} from '@ngrx/signals';
import {DistrictEntity} from '@entities/district/model';
import {DistrictService} from '@entities/district/api';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {PlanCatalogService} from '@entities/plan-catalog/api';
import {firstValueFrom} from 'rxjs';

interface DistrictFormState {
  plans: PlanCatalogEntity[];
  isLoadingPlans: boolean;
  isSaving: boolean;
  error: string | null;
}

const initialState: DistrictFormState = {
  plans: [],
  isLoadingPlans: false,
  isSaving: false,
  error: null,
};

export const DistrictFormStore = signalStore(
  withState(initialState),

  withComputed(({ isSaving, isLoadingPlans }) => ({
    canSave: computed(() => !isSaving() && !isLoadingPlans()),
    isLoading: computed(() => isLoadingPlans()),
  })),

  withMethods((store) => {
    const districtService = inject(DistrictService);
    const planCatalogService = inject(PlanCatalogService);

    return {
      loadPlans: async (): Promise<void> => {
        try {
          patchState(store, { isLoadingPlans: true, error: null });
          const plans = await firstValueFrom(planCatalogService.getAll());
          patchState(store, { plans, isLoadingPlans: false });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al cargar planes',
            isLoadingPlans: false,
          });
        }
      },

      createDistrict: async (
        data: Partial<DistrictEntity>
      ): Promise<DistrictEntity> => {
        try {
          patchState(store, { isSaving: true, error: null });
          const district = await firstValueFrom(
            districtService.create(data as DistrictEntity)
          );

          patchState(store, { isSaving: false });
          return district;
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al crear distrito',
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
