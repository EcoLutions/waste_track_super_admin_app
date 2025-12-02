import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState,} from '@ngrx/signals';
import {firstValueFrom} from 'rxjs';
import {DeviceEntity} from '@entities/device/model/entities/device.entity';
import {DeviceService} from '@entities/device/api/services/device.service';

interface DeviceFormState {
  isSaving: boolean;
  error: string | null;
}

const initialState: DeviceFormState = {
  isSaving: false,
  error: null,
};

export const DeviceFormStore = signalStore(
  withState(initialState),

  withComputed(({ isSaving }) => ({
    canSave: computed(() => !isSaving()),
    isLoading: computed(() => isSaving()),
  })),

  withMethods((store) => {
    const deviceService = inject(DeviceService);

    return {
      createDevice: async (data: Partial<DeviceEntity>): Promise<DeviceEntity> => {
        try {
          patchState(store, { isSaving: true, error: null });

          const device = await firstValueFrom(
            deviceService.create(data as DeviceEntity)
          );

          patchState(store, { isSaving: false });
          return device;
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al crear dispositivo',
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
