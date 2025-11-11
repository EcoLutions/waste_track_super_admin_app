import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbComponent, BreadcrumbItem } from '@shared/ui/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '@shared/ui/page-header/page-header.component';
import { PlanFormStore } from '@features/plan-management/model/plan-form.store';
import { PlanCatalogEntity } from '@entities/plan-catalog/model';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {PlanFormComponent} from '@features/plan-management/ui';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-plan-form-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    PageHeaderComponent,
    PlanFormComponent,
    ToastModule,
    Divider,
  ],
  providers: [PlanFormStore, MessageService],
  templateUrl: './plan-form.page.html',
})
export default class PlanFormPage implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  readonly store = inject(PlanFormStore);

  planId: string | null = null;

  breadcrumbItems: BreadcrumbItem[] = [];

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
      }
    });
  }

  ngOnInit(): void {
    this.planId = this.route.snapshot.paramMap.get('id');

    if (this.planId) {
      // Edit mode
      this.store.loadPlan(this.planId);
      this.breadcrumbItems = [
        { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
        { label: 'Planes', route: '/plans' },
        { label: 'Editar Plan' },
      ];
    } else {
      // Create mode
      this.breadcrumbItems = [
        { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
        { label: 'Planes', route: '/plans' },
        { label: 'Crear Plan' },
      ];
    }
  }

  get pageTitle(): string {
    return this.planId ? 'Editar Plan' : 'Crear Nuevo Plan';
  }

  get pageSubtitle(): string {
    return this.planId
      ? 'Actualiza la información del plan de suscripción'
      : 'Configura un nuevo plan de suscripción para tus clientes';
  }

  async onFormSubmit(planData: Partial<PlanCatalogEntity>): Promise<void> {
    try {
      if (this.planId) {
        // Update
        await this.store.updatePlan(this.planId, planData);
        this.messageService.add({
          severity: 'success',
          summary: 'Plan Actualizado',
          detail: `El plan "${planData.name}" ha sido actualizado exitosamente.`,
          life: 4000,
        });
      } else {
        // Create
        await this.store.createPlan(planData as Omit<PlanCatalogEntity, 'id'>);
        this.messageService.add({
          severity: 'success',
          summary: 'Plan Creado',
          detail: `El plan "${planData.name}" ha sido creado exitosamente.`,
          life: 4000,
        });
      }

      // Navigate back to list
      setTimeout(() => {
        this.router.navigate(['/plans']);
      }, 1000);
    } catch (error) {
      // Error already handled by store effect
    }
  }

  onFormCancel(): void {
    this.router.navigate(['/plans']);
  }

  onBack(): void {
    this.router.navigate(['/plans']);
  }
}
