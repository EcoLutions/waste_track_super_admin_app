import {DistrictEntity} from '@entities/district/model';
import {CreateDistrictRequest} from '@entities/district/api';

export class CreateDistrictRequestFromEntityMapper {
  static fromEntityToDto(entity: DistrictEntity): CreateDistrictRequest {
    return {
      name: entity.name,
      code: entity.code,
      primaryAdminEmail: entity.primaryAdminEmail,
      primaryAdminUsername: entity.primaryAdminEmail,
      planId: entity.planId,
    };
  }
}

