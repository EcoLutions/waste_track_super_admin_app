import {Component, computed, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';
import {BillingPeriodToStringMapper, CurrencyToSymbolMapper} from '@shared/model/mappers';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-list.component.html',
  styleUrl: './plan-list.component.css',
})
export class PlanListComponent {
  readonly plans = input.required<PlanCatalogEntity[]>();
  readonly loading = input<boolean>(false);
  readonly searchTerm = input<string>('');

  readonly planSelected = output<PlanCatalogEntity>();
  readonly planEdit = output<PlanCatalogEntity>();
  readonly planDelete = output<PlanCatalogEntity>();
  readonly searchTermChange = output<string>();

  readonly isEmpty = computed(() => this.plans().length === 0);

  getCurrencySymbol(currency: CurrencyEnum): string {
    return CurrencyToSymbolMapper.map(currency);
  }

  getBillingPeriodLabel(period: BillingPeriodEnum): string {
    return BillingPeriodToStringMapper.map(period);
  }

  formatPrice(amount: number, currency: CurrencyEnum): string {
    const symbol = this.getCurrencySymbol(currency);
    return `${symbol} ${amount.toFixed(2)}`;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTermChange.emit(input.value);
  }

  onSelectPlan(plan: PlanCatalogEntity): void {
    this.planSelected.emit(plan);
  }

  onEditPlan(plan: PlanCatalogEntity, event: Event): void {
    event.stopPropagation();
    this.planEdit.emit(plan);
  }

  onDeletePlan(plan: PlanCatalogEntity, event: Event): void {
    event.stopPropagation();
    this.planDelete.emit(plan);
  }

  trackById(_: number, plan: PlanCatalogEntity): string {
    return plan.id;
  }
}
