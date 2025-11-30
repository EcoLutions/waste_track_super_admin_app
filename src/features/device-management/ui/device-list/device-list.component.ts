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
    TableModule,
    ButtonModule,
    SkeletonModule,
    TagModule,
  ],
  template: `
    <div class="space-y-4">
      <!-- Search -->
      <div class="relative">
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          type="text"
          [value]="searchTerm()"
          (input)="onSearch($event)"
          placeholder="Buscar por ID del dispositivo..."
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg
                 focus:ring-2 focus:ring-green-500 focus:border-green-500
                 bg-white text-gray-900 placeholder-gray-400"
        />
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-3">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-white border rounded-lg p-4">
              <div class="flex items-center gap-4">
                <p-skeleton shape="circle" size="3rem"></p-skeleton>
                <div class="flex-1 space-y-2">
                  <p-skeleton width="200px" height="1.5rem"></p-skeleton>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Desktop Table -->
      @if (!loading()) {
        <div class="hidden md:block bg-white border rounded-lg overflow-hidden">
          <p-table [value]="devices()" class="p-datatable-sm">
            <ng-template pTemplate="header">
              <tr>
                <th>Identificador</th>
                <th>Online</th>
                <th>Creado</th>
              </tr>
            </ng-template>

            <ng-template pTemplate="body" let-device>
              <tr class="hover:bg-gray-50">
                <td>{{ device.deviceIdentifier }}</td>
                <td>
                  <p-tag
                    [value]="device.isOnline ? 'Online' : 'Offline'"
                    [severity]="device.isOnline ? 'success' : 'danger'"
                  ></p-tag>
                </td>
                <td>{{ device.createdAt | date:'short' }}</td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="4" class="text-center py-8 text-gray-600">
                  No hay dispositivos registrados
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-3">
          @if (devices().length === 0) {
            <div class="bg-white border rounded-lg p-6 text-center text-gray-600">
              <i class="pi pi-inbox text-5xl text-gray-400 mb-3"></i>
              No hay dispositivos registrados
            </div>
          }

          @for (dev of devices(); track dev.id) {
            <div class="border rounded-lg bg-white p-4 space-y-2">
              <div class="flex justify-between items-start">
                <div>
                  <div class="font-semibold">{{ dev.deviceIdentifier }}</div>
                  <div class="text-xs text-gray-500">
                    {{ dev.createdAt | date:'short' }}
                  </div>
                </div>

                <p-tag
                  [value]="dev.isOnline ? 'Online' : 'Offline'"
                  [severity]="dev.isOnline ? 'success' : 'danger'"
                />
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

  onSearch(ev: Event) {
    this.searchTermChange.emit((ev.target as HTMLInputElement).value);
  }
}
