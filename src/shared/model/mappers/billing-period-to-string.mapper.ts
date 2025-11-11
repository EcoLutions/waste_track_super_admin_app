import {BillingPeriodEnum} from '@shared/model';

export class BillingPeriodToStringMapper {
  static map(period: BillingPeriodEnum): string {
    switch (period) {
      case BillingPeriodEnum.MONTHLY:
        return 'Mensual';
      case BillingPeriodEnum.YEARLY:
        return 'Anual';
      default:
        return 'Desconocido';
    }
  }
}
