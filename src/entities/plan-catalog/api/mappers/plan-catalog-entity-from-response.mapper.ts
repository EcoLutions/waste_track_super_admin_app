import {PlanCatalogResponse} from '@entities/plan-catalog/api';
import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';
import {EnumMapper} from '@shared/api/mappers/enum.mapper';

export class PlanCatalogEntityFromResponseMapper {
  static fromDtoToEntity(dto: PlanCatalogResponse): PlanCatalogEntity {
    return {
      id: dto.id ?? '',
      name: dto.name ?? '',
      priceAmount: dto.priceAmount ? Number(dto.priceAmount) : 0,
      priceCurrency: EnumMapper.mapStringToEnum(dto.priceCurrency, CurrencyEnum, CurrencyEnum.PEN),
      billingPeriod: EnumMapper.mapStringToEnum(dto.billingPeriod, BillingPeriodEnum, BillingPeriodEnum.MONTHLY),
      maxVehicles: dto.maxVehicles ? Number(dto.maxVehicles): 0,
      maxDrivers: dto.maxDrivers ? Number(dto.maxDrivers): 0,
      maxContainers: dto.maxContainers ? Number(dto.maxContainers): 0,
    };
  }
}

