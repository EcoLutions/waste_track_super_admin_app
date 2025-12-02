import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';

export interface PlanCatalogEntity {
  id: string;
  name: string;
  priceAmount: number;
  priceCurrency: CurrencyEnum;
  billingPeriod: BillingPeriodEnum;
  maxVehicles: number;
  maxDrivers: number;
  maxContainers: number;
}

