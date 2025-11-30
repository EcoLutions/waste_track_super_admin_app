import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
} from '@ngrx/signals';

import { firstValueFrom } from 'rxjs';
import {DeviceEntity} from '@entities/device/model/entities/device.entity';
import {DeviceService} from '@entities/device/api/services/device.service';

interface DeviceListState {
  devices: DeviceEntity[];
  selectedDevice: DeviceEntity | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: DeviceListState = {
  devices: [],
  selectedDevice: null,
  searchTerm: '',
  isLoading: false,
  error: null,
};

export const DeviceListStore = signalStore(
  withState(initialState),

  withComputed(({ devices, searchTerm }) => ({
    filteredDevices: computed(() => {
      const term = searchTerm().toLowerCase().trim();
      if (!term) return devices();

      return devices().filter((dev) =>
        dev.deviceIdentifier.toLowerCase().includes(term)
      );
    }),

    hasDevices: computed(() => devices().length > 0),
    isSearching: computed(() => searchTerm().trim().length > 0),
  })),

  withMethods((store) => {
    const deviceService = inject(DeviceService);

    return {
      loadDevices: async () => {
        try {
          patchState(store, { isLoading: true, error: null });

          const devices = await firstValueFrom(deviceService.getAll());
          patchState(store, { devices, isLoading: false });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al cargar dispositivos',
            isLoading: false,
          });
        }
      },

      deleteDevice: async (id: string) => {
        try {
          patchState(store, { isLoading: true, error: null });

          // (Solo si creas DELETE en backend)
          // await firstValueFrom(deviceService.delete(id));

          patchState(store, {
            devices: store.devices().filter((d) => d.id !== id),
            isLoading: false,
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al eliminar dispositivo',
            isLoading: false,
          });
          throw error;
        }
      },

      setSearchTerm(term: string) {
        patchState(store, { searchTerm: term });
      },

      clearError() {
        patchState(store, { error: null });
      },
    };
  })
);
