import {DistrictResponse} from '@entities/district/api';
import {DistrictEntity, OperationalStatusEnum} from '@entities/district/model';
import {EnumMapper} from '@shared/api';
import {BillingPeriodEnum, CurrencyEnum} from '@shared/model';

export class DistrictEntityFromResponseMapper {
  static fromDtoToEntity(dto: DistrictResponse): DistrictEntity {
    return {
      id: dto.id ?? '',
      name: dto.name ?? '',
      code: dto.code ?? '',
      operationalStatus: EnumMapper.mapStringToEnum(dto.operationalStatus, OperationalStatusEnum, OperationalStatusEnum.ACTIVE),
      serviceStartDate: dto.serviceStartDate ? new Date(dto.serviceStartDate) : new Date(0),
      planId: dto.planId ?? '',
      planName: dto.planName ?? '',
      maxVehicles: dto.maxVehicles ?? 0,
      maxDrivers: dto.maxDrivers ?? 0,
      maxContainers: dto.maxContainers ?? 0,
      currency: EnumMapper.mapStringToEnum(dto.currency, CurrencyEnum, CurrencyEnum.PEN),
      price: dto.price ?? 0,
      billingPeriod: EnumMapper.mapStringToEnum(dto.billingPeriod, BillingPeriodEnum, BillingPeriodEnum.MONTHLY),
      currentVehicleCount: dto.currentVehicleCount ?? 0,
      currentDriverCount: dto.currentDriverCount ?? 0,
      currentContainerCount: dto.currentContainerCount ?? 0,
      primaryAdminEmail: '',
      primaryAdminUsername: '',
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(0),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(0),
    };
  }
}

