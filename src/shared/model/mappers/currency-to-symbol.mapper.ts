import {CurrencyEnum} from '@shared/model';

export class CurrencyToSymbolMapper {
  static map(currency: CurrencyEnum): string {
    switch (currency) {
      case CurrencyEnum.PEN:
        return 'S/';
      case CurrencyEnum.USD:
        return '$';
      default:
        return '';
    }
  }
}
