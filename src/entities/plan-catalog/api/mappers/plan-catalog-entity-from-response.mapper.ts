import {PlanCatalogResponse} from '@entities/plan-catalog/api';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';
import {EnumMapper} from '@shared/api/mappers/enum.mapper';

export class PlanCatalogEntityFromResponseMapper {
  static fromDtoToEntity(dto: PlanCatalogResponse): PlanCatalogEntity {
    console.log(dto);
    return {
      id: dto.id ?? '',
      name: dto.name ?? '',
      priceAmount: dto.priceAmount ?? 0,
      priceCurrency: EnumMapper.mapStringToEnum(dto.priceCurrency, CurrencyEnum, CurrencyEnum.PEN),
      billingPeriod: EnumMapper.mapStringToEnum(dto.billingPeriod, BillingPeriodEnum, BillingPeriodEnum.MONTHLY),
      maxVehicles: dto.maxVehicles ?? 0,
      maxDrivers: dto.maxDrivers ?? 0,
      maxContainers: dto.maxContainers ?? 0,
    };
  }
}

