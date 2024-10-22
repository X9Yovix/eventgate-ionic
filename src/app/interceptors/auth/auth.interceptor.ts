import {
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';

let isRefreshingToken: boolean = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
  string | null
>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isInAccessList(req.url)) {
    return next(req);
  }

  return next(addToken(req, authService)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        console.log('Handling 401');
        return handle401Error(req, next, authService);
      }
      return throwError(() => err);
    })
  );
};

function isInAccessList(url: string): boolean {
  return [
    `${environment.eventgateApi}/profiles/login`,
    `${environment.eventgateApi}/profiles/register`,
    `${environment.eventgateApi}/token/verify`,
    `${environment.eventgateApi}/profiles/resend-otp`,
    `${environment.eventgateApi}/profiles/verify-otp`,
  ].includes(url);
}

function addToken(
  req: HttpRequest<any>,
  authService: AuthService
): HttpRequest<any> {
  const token = authService.currentAccessToken;
  if (token) {
    return req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }
  return req;
}

function handle401Error(
  request: HttpRequest<any>,
  next: any,
  authService: AuthService
): Observable<any> {
  console.log('Starting token refresh');

  if (!isRefreshingToken) {
    isRefreshingToken = true;
    refreshTokenSubject.next(null);

    if (authService.currentRefreshToken) {
      return authService.refreshToken().pipe(
        switchMap((token: any) => {
          if (token) {
            console.log('New token inside intercp: ', token.access);
            authService.storeAccessToken(token.access);
            refreshTokenSubject.next(token.access); // notify all queued requests with the new token
            //return next.handle(addToken(request, authService));
            return next(addToken(request, authService));
          }
          return throwError(() => 'Failed to refresh token');
        }),
        catchError((err) => {
          console.error('Token refresh failed');
          return throwError(() => err);
        }),
        finalize(() => {
          isRefreshingToken = false;
        })
      );
    } else {
      return throwError(() => 'No refresh token available');
    }
  } else {
    // queue other requests while token is refreshing
    return refreshTokenSubject.pipe(
      filter((token) => token !== null), // wait for the new token to be available
      take(1), // take only the first emitted value (new token)
      switchMap(() => next(addToken(request, authService))) // proceed with the request using the new token
    );
  }
}
