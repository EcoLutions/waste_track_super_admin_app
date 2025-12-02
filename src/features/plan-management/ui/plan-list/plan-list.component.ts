import {Component, computed, input, output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';
import {CurrencyMapper} from '@shared/model/mappers/currency.mapper';
import {BillingPeriodMapper} from '@shared/model/mappers/billing-period.mapper';

@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plan-list.component.html',
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

  formatPrice(amount: number, currency: CurrencyEnum): string {
    const symbol = CurrencyMapper.toSymbol(currency);
    return `${symbol} ${amount.toFixed(2)}`;
  }

  getBillingPeriodLabel(period: BillingPeriodEnum): string {
    return BillingPeriodMapper.toLabel(period);
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

  trackById(_: number, plan: PlanCatalogEntity): string {
    return plan.id;
  }
}
