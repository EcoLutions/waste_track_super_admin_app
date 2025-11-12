import {OperationalStatusEnum} from '@entities/district/model';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';

export interface DistrictEntity {
  id: string;
  name: string;
  code: string;
  operationalStatus: OperationalStatusEnum;
  serviceStartDate: Date;
  planId: string;
  planName: string;
  maxVehicles: number;
  maxDrivers: number;
  maxContainers: number;
  currency: CurrencyEnum;
  price: number;
  billingPeriod: BillingPeriodEnum;
  currentVehicleCount: number;
  currentDriverCount: number;
  currentContainerCount: number;
  primaryAdminEmail: string;
  primaryAdminUsername: string;
  createdAt: Date;
  updatedAt: Date;
}
