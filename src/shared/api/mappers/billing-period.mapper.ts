import {BillingPeriodEnum} from '@shared/model';

export class BillingPeriodMapper {
  static mapStringToEnum(period: string): BillingPeriodEnum {
    const normalized = (period ?? '').toString().trim().toUpperCase();
    const key = Object.keys(BillingPeriodEnum).find((k) => {
      const val = BillingPeriodEnum[k as keyof typeof BillingPeriodEnum];
      return String(val).toUpperCase() === normalized || k.toUpperCase() === normalized;
    });
    if (key) {
      return BillingPeriodEnum[key as keyof typeof BillingPeriodEnum];
    }
    console.warn(`Invalid billing period received: ${period}, defaulting to MONTHLY`);
    return BillingPeriodEnum.MONTHLY;
  }

  static mapEnumToString(period: BillingPeriodEnum): string {
    return period;
  }
}
