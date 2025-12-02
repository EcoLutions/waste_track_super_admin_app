import {Injectable} from '@angular/core';
import {map, Observable, retry} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {BaseService} from '@shared/api';
import {DeviceEntity} from '@entities/device/model/entities/device.entity';
import {DeviceResponse} from '@entities/device/api/types/device-response.type';
import {DeviceEntityFromResponseMapper} from '@entities/device/api/mappers/device-entity-from-response.mapper';
import {CreateDeviceRequest} from '@entities/device/api/types/create-device-request.type';
import {
  CreateDeviceRequestFromEntityMapper
} from '@entities/device/api/mappers/create-device-request-from-entity.mapper';

@Injectable({
  providedIn: 'root',
})
export class DeviceService extends BaseService {
  constructor() {
    super();
    this.resourceEndpoint = 'devices';
  }

  getAll(): Observable<DeviceEntity[]> {
    return this.http
      .get<DeviceResponse[]>(this.resourcePath(), this.httpOptions)
      .pipe(
        map((responses: DeviceResponse[]) =>
          responses.map((r) => DeviceEntityFromResponseMapper.fromDtoToEntity(r)),
        ),
        retry(2),
        catchError(this.handleError),
      );
  }

  getById(id: string): Observable<DeviceEntity> {
    return this.http
      .get<DeviceResponse>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(
        map((response: DeviceResponse) =>
          DeviceEntityFromResponseMapper.fromDtoToEntity(response),
        ),
        retry(2),
        catchError(this.handleError),
      );
  }

  create(entity: DeviceEntity): Observable<DeviceEntity> {
    const request: CreateDeviceRequest =
      CreateDeviceRequestFromEntityMapper.fromEntityToDto(entity);

    return this.http
      .post<DeviceResponse>(this.resourcePath(), request, this.httpOptions)
      .pipe(
        map((response: DeviceResponse) =>
          DeviceEntityFromResponseMapper.fromDtoToEntity(response),
        ),
        catchError(this.handleError),
      );
  }
}
