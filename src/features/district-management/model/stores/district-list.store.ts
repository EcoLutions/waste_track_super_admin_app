import {computed, inject} from '@angular/core';
import {patchState, signalStore, withComputed, withMethods, withState,} from '@ngrx/signals';
import {DistrictEntity} from '@entities/district/model';
import {DistrictService} from '@entities/district/api';
import {firstValueFrom} from 'rxjs';

interface DistrictListState {
  districts: DistrictEntity[];
  selectedDistrict: DistrictEntity | null;
  searchTerm: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: DistrictListState = {
  districts: [],
  selectedDistrict: null,
  searchTerm: '',
  isLoading: false,
  error: null,
};

export const DistrictListStore = signalStore(
  withState(initialState),

  withComputed(({ districts, searchTerm }) => ({
    filteredDistricts: computed(() => {
      const term = searchTerm().toLowerCase().trim();
      if (!term) return districts();

      return districts().filter(
        (district) =>
          district.name.toLowerCase().includes(term) ||
          district.code.toLowerCase().includes(term) ||
          district.planName.toLowerCase().includes(term)
      );
    }),

    districtsCount: computed(() => districts().length),

    hasDistricts: computed(() => districts().length > 0),

    hasFilteredDistricts: computed(() => {
      const term = searchTerm().toLowerCase().trim();
      if (!term) return districts().length > 0;

      return districts().some(
        (district) =>
          district.name.toLowerCase().includes(term) ||
          district.code.toLowerCase().includes(term) ||
          district.planName.toLowerCase().includes(term)
      );
    }),

    isSearching: computed(() => searchTerm().trim().length > 0),
  })),

  withMethods((store) => {
    const districtService = inject(DistrictService);

    return {
      loadDistricts: async (): Promise<void> => {
        try {
          patchState(store, { isLoading: true, error: null });
          const districts = await firstValueFrom(districtService.getAll());
          patchState(store, { districts, isLoading: false });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al cargar distritos',
            isLoading: false,
          });
        }
      },

      deleteDistrict: async (id: string): Promise<void> => {
        try {
          patchState(store, { isLoading: true, error: null });
          await firstValueFrom(districtService.delete(id));

          const updatedDistricts = store.districts().filter((d) => d.id !== id);
          patchState(store, {
            districts: updatedDistricts,
            isLoading: false,
            selectedDistrict: null,
          });
        } catch (error: any) {
          patchState(store, {
            error: error.message || 'Error al eliminar distrito',
            isLoading: false,
          });
          throw error;
        }
      },

      setSearchTerm(term: string): void {
        patchState(store, { searchTerm: term });
      },

      selectDistrict(district: DistrictEntity | null): void {
        patchState(store, { selectedDistrict: district });
      },

      clearSearch(): void {
        patchState(store, { searchTerm: '' });
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
