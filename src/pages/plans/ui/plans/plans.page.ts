import {Component, effect, inject} from '@angular/core';
import {Router} from '@angular/router';
import {BreadcrumbComponent, BreadcrumbItem} from '@shared/ui/breadcrumb/breadcrumb.component';
import {PageHeaderAction, PageHeaderComponent} from '@shared/ui/page-header/page-header.component';
import {PlanListComponent} from '@features/plan-management';
import {PlanListStore} from '@features/plan-management/model/stores';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';

@Component({
  selector: 'app-plans-page',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    PageHeaderComponent,
    PlanListComponent
  ],
  providers: [PlanListStore],
  templateUrl: './plans.page.html',
  styleUrl: './plans.page.css',
})
export default class PlansPage {
  private router = inject(Router);
  readonly store = inject(PlanListStore);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Planes' }
  ];

  primaryActions: PageHeaderAction[] = [
    {
      id: 'create',
      label: 'Crear Plan',
      icon: 'pi-plus',
      variant: 'primary',
      showInMobile: true,
      onClick: () => this.onCreatePlan()
    }
  ];

  constructor() {
    // Load plans on init
    this.store.loadPlans();

    // Effect to handle errors
    effect(() => {
      const error = this.store.error();
      if (error) {
        console.error('Error en planes:', error);
        // TODO: Implementar toast notification
      }
    });
  }

  onCreatePlan(): void {
    console.log('Crear nuevo plan');
    // TODO: Implementar modal/página de creación
  }

  onPlanSelected(plan: PlanCatalogEntity): void {
    console.log('Plan seleccionado:', plan);
    // TODO: Navegar a detalles o abrir modal
  }

  onPlanEdit(plan: PlanCatalogEntity): void {
    console.log('Editar plan:', plan);
    // TODO: Implementar modal/página de edición
  }

  onPlanDelete(plan: PlanCatalogEntity): void {
    console.log('Eliminar plan:', plan);
    // TODO: Implementar confirmación y eliminación
    if (confirm(`¿Estás seguro de eliminar el plan "${plan.name}"?`)) {
      this.store.deletePlan(plan.id);
    }
  }

  onSearchTermChange(searchTerm: string): void {
    this.store.setSearchTerm(searchTerm);
  }

  onRefresh(): void {
    this.store.loadPlans();
  }

  onBack(): void {
    this.router.navigate(['/dashboard']).then();
  }
}
