import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {CreatePlanCatalogRequest} from '@entities/plan-catalog/api';
import {CurrencyMapper} from '@shared/api/mappers/currency.mapper';
import {BillingPeriodMapper} from '@shared/api/mappers/billing-period.mapper';

export class CreatePlanCatalogRequestFromEntityMapper {
  static fromEntityToDto(entity: PlanCatalogEntity): CreatePlanCatalogRequest {
    return {
      name: entity.name,
      priceAmount: entity.priceAmount,
      priceCurrency: CurrencyMapper.mapEnumToString(entity.priceCurrency),
      billingPeriod: BillingPeriodMapper.mapEnumToString(entity.billingPeriod),
      maxVehicles: entity.maxVehicles,
      maxDrivers: entity.maxDrivers,
      maxContainers: entity.maxContainers,
    };
  }
}
