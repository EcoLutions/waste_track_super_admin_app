import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {DistrictListStore} from '@features/district-management/model';
import {DistrictListComponent} from '@features/district-management/ui';
import {BreadcrumbComponent, BreadcrumbItem} from '@shared/ui/breadcrumb/breadcrumb.component';
import {PageHeaderAction, PageHeaderComponent} from '@shared/ui/page-header/page-header.component';
import {ToastModule} from 'primeng/toast';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DistrictEntity} from '@entities/district/model';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-districts-page',
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    PageHeaderComponent,
    DistrictListComponent,
    ToastModule,
    ConfirmDialogModule,
    Divider,
  ],
  providers: [DistrictListStore, MessageService, ConfirmationService],
  template: `
    <div class="space-y-6">
      <p-toast position="top-right" />
      <p-confirmDialog />

      <!-- Breadcrumb -->
      <app-breadcrumb [items]="breadcrumbItems" [loading]="store.isLoading()" />

      <!-- Page Header -->
      <app-page-header
        [title]="'Distritos'"
        [subtitle]="'Gestiona los distritos municipales y sus suscripciones'"
        [loading]="store.isLoading()"
        [showBackButton]="true"
        [primaryActions]="headerActions"
        (refresh)="handleRefresh()"
        (back)="handleBack()"
      />

      <p-divider/>

      <!-- District List -->
      <app-district-list
        [districts]="store.filteredDistricts()"
        [loading]="store.isLoading()"
        [searchTerm]="store.searchTerm()"
        (districtDelete)="handleDelete($event)"
        (searchTermChange)="handleSearchChange($event)"
      />
    </div>
  `,
})
export class DistrictsPage implements OnInit {
  store = inject(DistrictListStore);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/dashboard', icon: 'pi pi-home' },
    { label: 'Distritos' },
  ];

  headerActions: PageHeaderAction[] = [
    {
      id: 'create',
      label: 'Crear Distrito',
      icon: 'pi pi-plus',
      variant: 'primary',
      showInMobile: true,
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
          life: 5000,
        });
        this.store.clearError();
      }
    });
  }

  ngOnInit(): void {
    this.store.loadDistricts();
  }

  handleCreate(): void {
    this.router.navigate(['/districts/create']).then();
  }

  handleDelete(district: DistrictEntity): void {
    this.confirmationService.confirm({
      header: 'Confirmar Eliminación',
      message: `¿Está seguro que desea eliminar el distrito "${district.name}"? Esta acción no se puede deshacer.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: async () => {
        try {
          await this.store.deleteDistrict(district.id);
          this.messageService.add({
            severity: 'success',
            summary: 'Distrito eliminado',
            detail: `El distrito "${district.name}" ha sido eliminado correctamente`,
            life: 4000,
          });
        } catch (error) {
          // Error ya manejado por el effect
        }
      },
    });
  }

  handleSearchChange(term: string): void {
    this.store.setSearchTerm(term);
  }

  handleBack(): void {
    this.router.navigate(['/dashboard']).then();
  }

  handleRefresh(): void {
    this.store.loadDistricts();
  }
}
