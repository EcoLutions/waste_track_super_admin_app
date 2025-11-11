import {CurrencyEnum} from '@shared/model';

export class CurrencyMapper {
  static mapStringToEnum(currency: string): CurrencyEnum {
    const normalized = (currency ?? '').toString().trim().toUpperCase();
    const key = Object.keys(CurrencyEnum).find((k) => {
      const val = CurrencyEnum[k as keyof typeof CurrencyEnum];
      return String(val).toUpperCase() === normalized || k.toUpperCase() === normalized;
    });
    if (key) {
      return CurrencyEnum[key as keyof typeof CurrencyEnum];
    }
    console.warn(`Invalid currency received: ${currency}, defaulting to PEN`);
    return CurrencyEnum.PEN;
  }

  static mapEnumToString(currency: CurrencyEnum): string {
    return currency;
  }
}

