import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {DistrictFormStore} from '@features/district-management/model';
import {DistrictFormComponent} from '@features/district-management/ui';
import {BreadcrumbComponent, BreadcrumbItem} from '@shared/ui/breadcrumb/breadcrumb.component';
import {PageHeaderComponent} from '@shared/ui/page-header/page-header.component';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {SkeletonModule} from 'primeng/skeleton';
import {DistrictEntity} from '@entities/district/model';

@Component({
  selector: 'app-district-form-page',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PageHeaderComponent,
    DistrictFormComponent,
    ToastModule,
    SkeletonModule,
  ],
  providers: [DistrictFormStore, MessageService],
  template: `
    <div class="space-y-6">
      <p-toast position="top-right" />

      <!-- Breadcrumb -->
      <app-breadcrumb [items]="breadcrumbItems" [loading]="store.isLoading()" />

      <!-- Page Header -->
      <app-page-header
        [title]="'Crear Distrito'"
        [subtitle]="'Complete el formulario para registrar un nuevo distrito municipal'"
        [loading]="store.isLoading()"
        [showBackButton]="true"
        (back)="handleBack()"
      />

      <!-- Loading Skeleton -->
      @if (store.isLoading()) {
        <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <div class="space-y-2">
            <p-skeleton width="150px" height="1.5rem"></p-skeleton>
            <p-skeleton width="100%" height="2.5rem"></p-skeleton>
          </div>
          <div class="space-y-2">
            <p-skeleton width="150px" height="1.5rem"></p-skeleton>
            <p-skeleton width="100%" height="2.5rem"></p-skeleton>
          </div>
          <div class="space-y-2">
            <p-skeleton width="150px" height="1.5rem"></p-skeleton>
            <p-skeleton width="100%" height="2.5rem"></p-skeleton>
          </div>
          <div class="bg-gray-50 rounded-lg border border-gray-200 p-4 space-y-4">
            <p-skeleton width="200px" height="1.5rem"></p-skeleton>
            <div class="space-y-2">
              <p-skeleton width="150px" height="1.5rem"></p-skeleton>
              <p-skeleton width="100%" height="2.5rem"></p-skeleton>
            </div>
            <div class="space-y-2">
              <p-skeleton width="150px" height="1.5rem"></p-skeleton>
              <p-skeleton width="100%" height="2.5rem"></p-skeleton>
            </div>
          </div>
        </div>
      }

      <!-- District Form -->
      @if (!store.isLoading()) {
        <app-district-form
          [plans]="store.plans()"
          [loading]="store.isSaving()"
          (formSubmit)="handleSubmit($event)"
          (formCancel)="handleCancel()"
        />
      }
    </div>
  `,
})
export class DistrictFormPage implements OnInit {
  store = inject(DistrictFormStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Distritos', route: '/districts' },
    { label: 'Crear Distrito' },
  ];

  constructor() {
    effect(() => {
      const error = this.store.error();
      if (error) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error,
          life: 5000,
        });
        this.store.clearError();
      }
    });
  }

  ngOnInit(): void {
    this.store.loadPlans();
  }

  async handleSubmit(data: Partial<DistrictEntity>): Promise<void> {
    try {
      await this.store.createDistrict(data);

      this.messageService.add({
        severity: 'success',
        summary: 'Distrito creado',
        detail: 'El distrito ha sido creado correctamente',
        life: 4000,
      });

      setTimeout(() => {
        this.router.navigate(['/districts']);
      }, 1000);
    } catch (error) {
      // Error ya manejado por el effect
    }
  }

  handleCancel(): void {
    this.router.navigate(['/districts']).then();
  }

  handleBack(): void {
    this.router.navigate(['/districts']).then();
  }
}
