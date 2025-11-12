import {Injectable} from '@angular/core';
import {map, Observable, retry} from 'rxjs';
import {BaseService} from '@shared/api';
import {DistrictEntity} from '@entities/district/model';
import {
  CreateDistrictRequest,
  CreateDistrictRequestFromEntityMapper,
  DistrictEntityFromResponseMapper,
  DistrictResponse,
  UpdateDistrictRequest,
  UpdateDistrictRequestFromEntityMapper
} from '@entities/district/api';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DistrictService extends BaseService {
  constructor() {
    super();
    this.resourceEndpoint = 'districts';
  }

  getAll(): Observable<DistrictEntity[]> {
    return this.http.get<DistrictResponse[]>(this.resourcePath(), this.httpOptions).pipe(
      map((responses: DistrictResponse[]) => responses.map(r => DistrictEntityFromResponseMapper.fromDtoToEntity(r))),
      retry(2),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<DistrictEntity> {
    return this.http.get<DistrictResponse>(`${this.resourcePath()}/${id}`, this.httpOptions).pipe(
      map((response: DistrictResponse) => DistrictEntityFromResponseMapper.fromDtoToEntity(response)),
      retry(2),
      catchError(this.handleError)
    );
  }

  create(entity: DistrictEntity): Observable<DistrictEntity> {
    const request: CreateDistrictRequest = CreateDistrictRequestFromEntityMapper.fromEntityToDto(entity);
    return this.http.post<DistrictResponse>(this.resourcePath(), request, this.httpOptions).pipe(
      map((response: DistrictResponse) => DistrictEntityFromResponseMapper.fromDtoToEntity(response)),
      catchError(this.handleError)
    );
  }

  update(id: string, entity: Partial<DistrictEntity>): Observable<DistrictEntity> {
    const request: UpdateDistrictRequest = UpdateDistrictRequestFromEntityMapper.fromEntityToDto(entity as DistrictEntity);
    return this.http.put<DistrictResponse>(`${this.resourcePath()}/${id}`, request, this.httpOptions).pipe(
      map((response: DistrictResponse) => DistrictEntityFromResponseMapper.fromDtoToEntity(response)),
      retry(2),
      catchError(this.handleError)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}

