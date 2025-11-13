import { BillingPeriodEnum } from '@shared/model';

export class BillingPeriodMapper {
  static toLabel(period: BillingPeriodEnum): string {
    const labels: Record<BillingPeriodEnum, string> = {
      [BillingPeriodEnum.MONTHLY]: 'Mensual',
      [BillingPeriodEnum.ANNUAL]: 'Anual',
    };
    return labels[period] || 'Mensual';
  }

  static toShortLabel(period: BillingPeriodEnum): string {
    const labels: Record<BillingPeriodEnum, string> = {
      [BillingPeriodEnum.MONTHLY]: 'Mes',
      [BillingPeriodEnum.ANNUAL]: 'Año',
    };
    return labels[period] || 'Mes';
  }
}
