import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refresh = false;
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.refresh) {
      this.refresh = true;
      this.refreshTokenSubject.next(null);
      const refresh_token = localStorage.getItem('refresh_token');
      if (refresh_token) {
        return this.authService.refreshToken(refresh_token).pipe(
          switchMap((res: any) => {
            localStorage.setItem('access_token', res.access_token);
            this.refreshTokenSubject.next(res.access_token);
            return next.handle(this.addTokenHeader(request, res.access_token));
          }),
          catchError((err: HttpErrorResponse) => {
            this.refresh = false;
            localStorage.removeItem('access_token');
            return throwError(() => err);
          })
        );
      }
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let authReq = request;
    const access_token = localStorage.getItem('access_token');

    if (access_token != null) {
      authReq = this.addTokenHeader(request, access_token);
    }
    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.refresh) {
          return this.handle401Error(request, next);
        }
        if (err.status === 403 && !this.refresh) {
          return this.handle401Error(request, next);
        }
        return throwError(() => err);
      })
    );
  }
}
