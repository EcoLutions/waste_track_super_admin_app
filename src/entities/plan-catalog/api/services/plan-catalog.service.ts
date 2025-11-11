import {Injectable} from '@angular/core';
import {map, Observable, retry} from 'rxjs';
import {PlanCatalogEntity} from '../../model';
import {
  CreatePlanCatalogRequest,
  CreatePlanCatalogRequestFromEntityMapper,
  PlanCatalogEntityFromResponseMapper,
  PlanCatalogResponse,
  UpdatePlanCatalogRequest
} from '@entities/plan-catalog/api';
import {catchError} from 'rxjs/operators';
import {BaseService} from '@shared/api';

@Injectable({
  providedIn: 'root'
})
export class PlanCatalogService extends BaseService {
  constructor() {
    super();
    this.resourceEndpoint = 'plan-catalogs';
  }

  getAll(): Observable<PlanCatalogEntity[]> {
    return this.http.get<PlanCatalogResponse[]>(this.resourcePath(), this.httpOptions).pipe(
      map((responses: PlanCatalogResponse[]) => responses.map(r => PlanCatalogEntityFromResponseMapper.fromDtoToEntity(r))),
      retry(2),
      catchError(this.handleError)
    );
  }

  getById(id: string): Observable<PlanCatalogEntity> {
    return this.http.get<PlanCatalogResponse>(`${this.resourcePath()}/${id}`, this.httpOptions).pipe(
      map((response: PlanCatalogResponse) => PlanCatalogEntityFromResponseMapper.fromDtoToEntity(response)),
      retry(2),
      catchError(this.handleError)
    );
  }

  create(entity: PlanCatalogEntity): Observable<PlanCatalogEntity> {
    const request: CreatePlanCatalogRequest = CreatePlanCatalogRequestFromEntityMapper.fromEntityToDto(entity);
    return this.http.post<PlanCatalogResponse>(this.resourcePath(), request, this.httpOptions).pipe(
      map((response: PlanCatalogResponse) => PlanCatalogEntityFromResponseMapper.fromDtoToEntity(response)),
      catchError(this.handleError)
    );
  }

  update(entity: Partial<PlanCatalogEntity>): Observable<PlanCatalogEntity> {
    const request: UpdatePlanCatalogRequest = CreatePlanCatalogRequestFromEntityMapper.fromEntityToDto(entity as PlanCatalogEntity);
    return this.http.put<PlanCatalogResponse>(`${this.resourcePath()}/${entity.id}`, request, this.httpOptions).pipe(
      map((response: PlanCatalogResponse) => PlanCatalogEntityFromResponseMapper.fromDtoToEntity(response)),
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

