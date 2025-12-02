import {BillingPeriodEnum} from '@shared/model';

export class BillingPeriodToStringMapper {
  static map(period: BillingPeriodEnum): string {
    switch (period) {
      case BillingPeriodEnum.MONTHLY:
        return 'Mensual';
      case BillingPeriodEnum.ANNUAL:
        return 'Anual';
      default:
        return 'Desconocido';
    }
  }
}
