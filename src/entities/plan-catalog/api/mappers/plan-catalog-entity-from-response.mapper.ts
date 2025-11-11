import {PlanCatalogResponse} from '@entities/plan-catalog/api';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {BillingPeriodMapper} from '@shared/api/mappers/billing-period.mapper';
import {CurrencyMapper} from '@shared/api/mappers/currency.mapper';

export class PlanCatalogEntityFromResponseMapper {
  static fromDtoToEntity(dto: PlanCatalogResponse): PlanCatalogEntity {
    return {
      id: dto.id ?? '',
      name: dto.name ?? '',
      priceAmount: dto.priceAmount ?? 0,
      priceCurrency: CurrencyMapper.mapStringToEnum(dto.priceCurrency ?? ''),
      billingPeriod: BillingPeriodMapper.mapStringToEnum(dto.billingPeriod ?? ''),
      maxVehicles: dto.maxVehicles ?? 0,
      maxDrivers: dto.maxDrivers ?? 0,
      maxContainers: dto.maxContainers ?? 0,
    };
  }
}

