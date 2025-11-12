import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DistrictEntity, OperationalStatusMapper} from '@entities/district/model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TagModule,
    SkeletonModule,
    Tooltip,
  ],
  template: `
    <div class="space-y-4">
      <!-- Search Bar -->
      <div class="flex gap-3">
        <span class="p-input-icon-left flex-1">
          <i class="pi pi-search"></i>
          <input
            pInputText
            type="text"
            [value]="searchTerm()"
            (input)="onSearchChange($event)"
            placeholder="Buscar por nombre, código o plan..."
            class="w-full"
          />
        </span>
        @if (searchTerm()) {
          <button
            pButton
            class="p-button-text"
            (click)="onClearSearch()"
          >
            <span pButtonLabel>Limpiar</span>
            <i pButtonIcon class="pi pi-times"></i>
          </button>
        }
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="space-y-3">
          @for (item of [1, 2, 3, 4, 5]; track item) {
            <div class="bg-white rounded-lg border border-gray-200 p-4">
              <div class="flex items-center gap-4">
                <p-skeleton shape="circle" size="3rem"></p-skeleton>
                <div class="flex-1 space-y-2">
                  <p-skeleton width="200px" height="1.5rem"></p-skeleton>
                  <p-skeleton width="150px" height="1rem"></p-skeleton>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Desktop Table -->
      @if (!loading()) {
        <div class="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
          <p-table
            [value]="districts()"
            [tableStyle]="{ 'min-width': '50rem' }"
            class="p-datatable-sm"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="font-semibold">Distrito</th>
                <th class="font-semibold">Código</th>
                <th class="font-semibold">Plan</th>
                <th class="font-semibold">Estado</th>
                <th class="font-semibold">Vehículos</th>
                <th class="font-semibold">Conductores</th>
                <th class="font-semibold">Contenedores</th>
                <th class="font-semibold">Acciones</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-district>
              <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td>
                  <div class="font-medium text-gray-900">
                    {{ district.name }}
                  </div>
                </td>
                <td>
                  <span class="text-gray-600">{{ district.code }}</span>
                </td>
                <td>
                  <span class="text-gray-600">{{ district.planName }}</span>
                </td>
                <td>
                  <p-tag
                    [value]="getStatusLabel(district.operationalStatus)"
                    [severity]="getStatusSeverity(district.operationalStatus)"
                  ></p-tag>
                </td>
                <td>
                  <span class="text-gray-600">
                    {{ district.currentVehicleCount }}/{{ district.maxVehicles }}
                  </span>
                </td>
                <td>
                  <span class="text-gray-600">
                    {{ district.currentDriverCount }}/{{ district.maxDrivers }}
                  </span>
                </td>
                <td>
                  <span class="text-gray-600">
                    {{ district.currentContainerCount }}/{{ district.maxContainers }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-2">
                    <button
                      pButton
                      class="p-button-rounded p-button-text p-button-danger"
                      (click)="onDelete(district)"
                      [pTooltip]="'Eliminar'"
                      tooltipPosition="top"
                    >
                      <i class="pi pi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="8" class="text-center py-8">
                  <div class="flex flex-col items-center justify-center gap-3">
                    <i class="pi pi-inbox text-gray-400 text-5xl"></i>
                    @if (searchTerm()) {
                      <p class="text-gray-600">No se encontraron resultados para "{{ searchTerm() }}"</p>
                    } @else {
                      <p class="text-gray-600">No hay distritos registrados</p>
                    }
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-3">
          @if (districts().length === 0) {
            <div class="bg-white rounded-lg border border-gray-200 p-8">
              <div class="flex flex-col items-center justify-center gap-3">
                <i class="pi pi-inbox text-gray-400 text-5xl"></i>
                @if (searchTerm()) {
                  <p class="text-gray-600 text-center">No se encontraron resultados para "{{ searchTerm() }}"</p>
                } @else {
                  <p class="text-gray-600 text-center">No hay distritos registrados</p>
                }
              </div>
            </div>
          }
          @for (district of districts(); track district.id) {
            <div class="bg-white rounded-lg border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow duration-200">
              <!-- Header -->
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">{{ district.name }}</h3>
                  <p class="text-sm text-gray-600">{{ district.code }}</p>
                </div>
                <p-tag
                  [value]="getStatusLabel(district.operationalStatus)"
                  [severity]="getStatusSeverity(district.operationalStatus)"
                ></p-tag>
              </div>

              <!-- Plan -->
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-tag text-gray-400"></i>
                <span class="text-gray-600">Plan: {{ district.planName }}</span>
              </div>

              <!-- Stats -->
              <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                <div class="text-center">
                  <div class="text-xs text-gray-500">Vehículos</div>
                  <div class="font-medium text-gray-900">
                    {{ district.currentVehicleCount }}/{{ district.maxVehicles }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-500">Conductores</div>
                  <div class="font-medium text-gray-900">
                    {{ district.currentDriverCount }}/{{ district.maxDrivers }}
                  </div>
                </div>
                <div class="text-center">
                  <div class="text-xs text-gray-500">Contenedores</div>
                  <div class="font-medium text-gray-900">
                    {{ district.currentContainerCount }}/{{ district.maxContainers }}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex justify-end pt-2 border-t border-gray-100">
                <button
                  pButton
                  class="p-button-sm p-button-danger p-button-text"
                  (click)="onDelete(district)"
                >
                  <i pButtonIcon class="pi pi-trash"></i>
                  <span pButtonLabel>Eliminar</span>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DistrictListComponent {
  districts = input.required<DistrictEntity[]>();
  loading = input<boolean>(false);
  searchTerm = input<string>('');

  districtDelete = output<DistrictEntity>();
  searchTermChange = output<string>();

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTermChange.emit(value);
  }

  onClearSearch(): void {
    this.searchTermChange.emit('');
  }

  onDelete(district: DistrictEntity): void {
    this.districtDelete.emit(district);
  }

  getStatusLabel(status: string): string {
    return OperationalStatusMapper.toLabel(status as any);
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' {
    return OperationalStatusMapper.toSeverity(status as any);
  }
}
