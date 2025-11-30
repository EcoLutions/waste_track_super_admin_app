import {DeviceResponse} from '@entities/device/api/types/device-response.type';
import {DeviceEntity} from '@entities/device/model/entities/device.entity';

export class DeviceEntityFromResponseMapper {
  static fromDtoToEntity(dto: DeviceResponse): DeviceEntity {
    return {
      id: dto.id ?? '',
      deviceIdentifier: dto.deviceIdentifier ?? '',
      isOnline: dto.isOnline ?? false,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(0),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : null,
    };
  }
}
