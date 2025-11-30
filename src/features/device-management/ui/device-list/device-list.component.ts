import {Component, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {SkeletonModule} from 'primeng/skeleton';
import {TagModule} from 'primeng/tag';
import {DeviceEntity} from '@entities/device/model/entities/device.entity';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    TagModule,
    SkeletonModule,
  ],
  template: `
    <div class="space-y-4">
      <!-- Search Bar -->
      <div class="flex gap-3">
        <div class="relative flex-1">
          <i
            class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          ></i>

          <input
            type="text"
            [value]="searchTerm()"
            (input)="onSearch($event)"
            placeholder="Buscar por identificador..."
            [class]="searchTerm()
              ? 'w-full pl-10 pr-4 py-2.5 border-2 border-green-500 bg-green-50 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-600 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500'
              : 'w-full pl-10 pr-4 py-2.5 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400 hover:border-gray-400'"
          />

          @if (searchTerm()) {
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <span
                class="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full"
              >Filtrando</span
              >
            </div>
          }
        </div>

        @if (searchTerm()) {
          <button
            type="button"
            (click)="onClearSearch()"
            class="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg
                   hover:bg-red-50 hover:text-red-700 hover:border-red-300
                   transition-all duration-200 font-medium shadow-sm hover:shadow"
          >
            <i class="pi pi-times text-sm"></i>
            <span class="hidden sm:inline">Limpiar</span>
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
        <div
          class="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden"
        >
          <p-table
            [value]="devices()"
            [tableStyle]="{ 'min-width': '40rem' }"
            class="p-datatable-sm"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="font-semibold">Identificador</th>
                <th class="font-semibold">Estado</th>
                <th class="font-semibold">Creado</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-device>
              <tr class="hover:bg-gray-50 transition-colors duration-200">
                <td class="font-medium text-gray-900">
                  {{ device.deviceIdentifier }}
                </td>

                <td>
                  <p-tag
                    [value]="device.isOnline ? 'Online' : 'Offline'"
                    [severity]="device.isOnline ? 'success' : 'danger'"
                  ></p-tag>
                </td>

                <td>
                  <span class="text-gray-600">
                    {{ device.createdAt | date: 'short' }}
                  </span>
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center py-8">
                  <div
                    class="flex flex-col items-center justify-center gap-3 text-gray-600"
                  >
                    <i class="pi pi-inbox text-gray-400 text-5xl"></i>
                    @if (searchTerm()) {
                      <p>No se encontraron resultados para "{{ searchTerm() }}"</p>
                    } @else {
                      <p>No hay dispositivos registrados</p>
                    }
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-3">
          @if (devices().length === 0) {
            <div class="bg-white rounded-lg border border-gray-200 p-8">
              <div class="flex flex-col items-center justify-center gap-3">
                <i class="pi pi-inbox text-gray-400 text-5xl"></i>
                @if (searchTerm()) {
                  <p class="text-gray-600 text-center">
                    No se encontraron resultados para "{{ searchTerm() }}"
                  </p>
                } @else {
                  <p class="text-gray-600 text-center">
                    No hay dispositivos registrados
                  </p>
                }
              </div>
            </div>
          }

          @for (device of devices(); track device.id) {
            <div
              class="bg-white rounded-lg border border-gray-200 p-4 space-y-3 hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900">
                    {{ device.deviceIdentifier }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ device.createdAt | date: 'short' }}
                  </p>
                </div>

                <p-tag
                  [value]="device.isOnline ? 'Online' : 'Offline'"
                  [severity]="device.isOnline ? 'success' : 'danger'"
                ></p-tag>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class DeviceListComponent {
  devices = input.required<DeviceEntity[]>();
  loading = input<boolean>(false);
  searchTerm = input<string>('');

  deviceDelete = output<DeviceEntity>();
  searchTermChange = output<string>();

  onSearch(event: Event) {
    this.searchTermChange.emit((event.target as HTMLInputElement).value);
  }

  onClearSearch() {
    this.searchTermChange.emit('');
  }
}
