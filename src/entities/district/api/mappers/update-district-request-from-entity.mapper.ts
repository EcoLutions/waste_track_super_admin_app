import {DistrictEntity} from '@entities/district/model';
import {UpdateDistrictRequest} from '@entities/district/api';

export class UpdateDistrictRequestFromEntityMapper {
  static fromEntityToDto(entity: DistrictEntity): UpdateDistrictRequest {
    return {
      districtId: entity.id,
      name: entity.name,
      code: entity.code,
    };
  }
}
