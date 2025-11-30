import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {BreadcrumbComponent, BreadcrumbItem} from '@shared/ui/breadcrumb/breadcrumb.component';
import {PageHeaderAction, PageHeaderComponent} from '@shared/ui/page-header/page-header.component';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Divider} from 'primeng/divider';
import {DeviceListComponent} from '@features/device-management/ui/device-list/device-list.component';
import {DeviceListStore} from '@features/device-management/model/device-list.store';
import {DeviceEntity} from '@entities/device/model/entities/device.entity';

@Component({
  selector: 'app-devices-page',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PageHeaderComponent,
    DeviceListComponent,
    ToastModule,
    ConfirmDialogModule,
    Divider,
  ],
  providers: [DeviceListStore, MessageService, ConfirmationService],
  template: `
    <div class="space-y-6">
      <p-toast />
      <p-confirmDialog />

      <app-breadcrumb [items]="breadcrumbItems" [loading]="store.isLoading()" />

      <app-page-header
        title="Dispositivos IoT"
        subtitle="Gestiona los dispositivos registrados en la plataforma"
        [loading]="store.isLoading()"
        [showBackButton]="true"
        [primaryActions]="headerActions"
        (refresh)="handleRefresh()"
        (back)="handleBack()"
      />

      <p-divider/>

      <app-device-list
        [devices]="store.filteredDevices()"
        [loading]="store.isLoading()"
        [searchTerm]="store.searchTerm()"
        (deviceDelete)="handleDelete($event)"
        (searchTermChange)="store.setSearchTerm($event)"
      />
    </div>
  `,
})
export class DevicesPage implements OnInit {
  store = inject(DeviceListStore);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Dispositivos IoT' },
  ];

  headerActions: PageHeaderAction[] = [
    {
      id: 'create',
      label: 'Crear Dispositivo',
      icon: 'pi pi-plus',
      variant: 'primary',
      onClick: () => this.handleCreate(),
    },
  ];

  constructor() {
    effect(() => {
      const error = this.store.error();
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
        });
        this.store.clearError();
      }
    });
  }

  ngOnInit() {
    this.store.loadDevices();
  }

  handleCreate(): void {
    this.router.navigate(['/iot-devices/create']).then();
  }

  handleDelete(device: DeviceEntity): void {
    this.confirmationService.confirm({
      header: 'Eliminar Dispositivo',
      message: `¿Desea eliminar el dispositivo "${device.deviceIdentifier}"?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        await this.store.deleteDevice(device.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: `Dispositivo "${device.deviceIdentifier}" eliminado correctamente.`,
        });
      },
    });
  }

  handleRefresh() {
    this.store.loadDevices();
  }

  handleBack() {
    this.router.navigate(['/dashboard']).then();
  }
}
