import { CurrencyEnum } from '@shared/model';

export class CurrencyMapper {
  static toSymbol(currency: CurrencyEnum): string {
    const symbols: Record<CurrencyEnum, string> = {
      [CurrencyEnum.PEN]: 'S/',
      [CurrencyEnum.USD]: '$',
    };
    return symbols[currency] || 'S/';
  }

  static toLabel(currency: CurrencyEnum): string {
    const labels: Record<CurrencyEnum, string> = {
      [CurrencyEnum.PEN]: 'Soles Peruanos',
      [CurrencyEnum.USD]: 'Dólares Americanos',
    };
    return labels[currency] || 'Soles Peruanos';
  }
}
