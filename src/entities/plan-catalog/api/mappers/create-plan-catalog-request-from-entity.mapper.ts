import {PlanCatalogEntity} from '@entities/plan-catalog/model';
import {CreatePlanCatalogRequest} from '@entities/plan-catalog/api';
import {EnumMapper} from '@shared/api/mappers/enum.mapper';

export class CreatePlanCatalogRequestFromEntityMapper {
  static fromEntityToDto(entity: PlanCatalogEntity): CreatePlanCatalogRequest {
    return {
      name: entity.name,
      priceAmount: entity.priceAmount,
      priceCurrency: EnumMapper.mapEnumToString(entity.priceCurrency),
      billingPeriod: EnumMapper.mapEnumToString(entity.billingPeriod),
      maxVehicles: entity.maxVehicles,
      maxDrivers: entity.maxDrivers,
      maxContainers: entity.maxContainers,
    };
  }
}
