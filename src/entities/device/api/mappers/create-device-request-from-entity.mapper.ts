import {DeviceEntity} from '@entities/device/model/entities/device.entity';
import {CreateDeviceRequest} from '@entities/device/api/types/create-device-request.type';

export class CreateDeviceRequestFromEntityMapper {
  static fromEntityToDto(entity: DeviceEntity): CreateDeviceRequest {
    return {
      deviceIdentifier: entity.deviceIdentifier ?? null,
    };
  }
}
