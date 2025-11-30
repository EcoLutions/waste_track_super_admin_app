import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {BreadcrumbComponent, BreadcrumbItem} from '@shared/ui/breadcrumb/breadcrumb.component';
import {PageHeaderComponent} from '@shared/ui/page-header/page-header.component';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {Divider} from 'primeng/divider';
import {DeviceFormComponent} from '@features/device-management/ui/device-form/device-form.component';
import {DeviceFormStore} from '@features/device-management/model/device-form.store';

@Component({
  selector: 'app-device-create-page',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PageHeaderComponent,
    DeviceFormComponent,
    ToastModule,
    Divider,
  ],
  providers: [DeviceFormStore, MessageService],
  template: `
    <div class="space-y-6">
      <p-toast position="top-right" />

      <app-breadcrumb [items]="breadcrumbItems" />

      <app-page-header
        title="Crear Dispositivo"
        subtitle="Registrar un nuevo dispositivo IoT"
        [showBackButton]="true"
        (back)="handleBack()"
      />

      <p-divider />

      <app-device-form
        [loading]="store.isSaving()"
        (formSubmit)="handleSubmit($event)"
        (formCancel)="handleBack()"
      />
    </div>
  `,
})
export class DeviceCreatePage implements OnInit {
  store = inject(DeviceFormStore);
  private messageService = inject(MessageService);
  private router = inject(Router);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Dispositivos IoT', route: '/iot-devices' },
    { label: 'Crear' },
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

  ngOnInit() {}

  async handleSubmit(data: { deviceIdentifier: string }) {
    try {
      const device = await this.store.createDevice({
        deviceIdentifier: data.deviceIdentifier,
      });

      this.messageService.add({
        severity: 'success',
        summary: 'Dispositivo creado',
        detail: `El dispositivo "${device.deviceIdentifier}" fue registrado correctamente.`,
      });

      await this.router.navigate(['/iot-devices']);
    } catch (_) {}
  }

  handleBack() {
    this.router.navigate(['/iot-devices']).then();
  }
}
