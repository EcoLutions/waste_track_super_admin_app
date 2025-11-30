import {Injectable} from '@angular/core';
import {map, Observable, retry} from 'rxjs';
import {BaseService} from '@shared/api';
import {UserEntity} from '../../model';
import {
  AuthenticatedUserFromResponseMapper,
  AuthenticatedUserResponse,
  SignInCredentials,
  SignInRequest,
  SignInRequestFromCredentialsMapper
} from '@entities/user/api';
import {catchError} from 'rxjs/operators';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService extends BaseService {
  constructor() {
    super();
    this.resourceEndpoint = 'authentication';
  }

  signIn(credentials: SignInCredentials): Observable<UserEntity> {
    const request: SignInRequest =
      SignInRequestFromCredentialsMapper.fromCredentialsToDto(credentials);

    return this.http
      .post<AuthenticatedUserResponse>(`${this.resourcePath()}/sign-in`, request, this.httpOptions)
      .pipe(
        map((response: AuthenticatedUserResponse) =>
          AuthenticatedUserFromResponseMapper.fromDtoToEntity(response),
        ),
        retry(2),
        catchError(this.handleError),
      );
  }

  getCurrentUser(): Observable<UserEntity> {
    return this.http
      .get<AuthenticatedUserResponse>(`${this.resourcePath()}/me`, this.httpOptions)
      .pipe(
        map((response: AuthenticatedUserResponse) =>
          AuthenticatedUserFromResponseMapper.fromDtoToEntity(response),
        ),
        retry(2),
        catchError(this.handleError),
      );
  }

  forgotPassword(email: string): Observable<void> {
    const params = new HttpParams().set('email', email);
    return this.http.post<void>(`${this.resourcePath()}/forgot-password`, null,  { ...this.httpOptions, params: params }).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }
}
