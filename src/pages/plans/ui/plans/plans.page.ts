import {Component, effect, inject} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbComponent, BreadcrumbItem} from '@shared/ui/breadcrumb/breadcrumb.component';
import {PageHeaderAction, PageHeaderComponent} from '@shared/ui/page-header/page-header.component';
import {PlanListStore} from '@features/plan-management/model/plan-list.store';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {ToastModule} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {PlanListComponent} from '@features/plan-management/ui';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    PageHeaderComponent,
    PlanListComponent,
    ToastModule,
    ConfirmDialogModule,
    PlanListComponent,
    Divider,
  ],
  providers: [PlanListStore, MessageService, ConfirmationService],
  templateUrl: './plans.page.html',
})
export default class PlansPage {
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  readonly store = inject(PlanListStore);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Planes' },
  ];

  primaryActions: PageHeaderAction[] = [
    {
      id: 'create',
      label: 'Crear Plan',
      icon: 'pi-plus',
      variant: 'primary',
      showInMobile: true,
      onClick: () => this.onCreatePlan(),
    },
  ];

  constructor() {
    this.store.loadPlans();

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

  onCreatePlan(): void {
    this.router.navigate(['/plans/create']).then();
  }

  onPlanSelected(plan: PlanCatalogEntity): void {
    this.router.navigate(['/plans/edit', plan.id]).then();
  }

  onPlanEdit(plan: PlanCatalogEntity): void {
    this.router.navigate(['/plans/edit', plan.id]).then();
  }

  onPlanDelete(plan: PlanCatalogEntity): void {
    this.confirmationService.confirm({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que deseas eliminar el plan "${plan.name}"? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          await this.store.deletePlan(plan.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Plan Eliminado',
            detail: `El plan "${plan.name}" ha sido eliminado exitosamente.`,
            life: 4000,
          });
        } catch (error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error al Eliminar',
            detail: 'No se pudo eliminar el plan. Inténtalo de nuevo.',
            life: 5000,
          });
        }
      },
    });
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.setSearchTerm(searchTerm);
  }

  onRefresh(): void {
    this.store.loadPlans();
    this.messageService.add({
      severity: 'info',
      summary: 'Actualizando',
      detail: 'Recargando lista de planes...',
      life: 2000,
    });
  }

  onBack(): void {
    this.router.navigate(['/dashboard']).then();
  }
}
