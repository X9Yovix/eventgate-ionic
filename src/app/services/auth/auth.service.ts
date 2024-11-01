import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isTokenLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentAccessToken: string = '';
  currentRefreshToken: string = '';

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.loadToken();
  }

  async loadToken() {
    await this.storageService.init();
    const token = await this.storageService.get('token');
    console.log('Loaded token:', token);
    if (token) {
      this.currentAccessToken = token.access;
      this.currentRefreshToken = token.refresh;
      this.isTokenLoaded.next(true);
    } else {
      this.isTokenLoaded.next(false);
    }
  }

  private getHeadersJson(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      return throwError(() => error.error.message);
    } else {
      return throwError(() => error.error);
    }
  }

  public register(data: any): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/register`;
    return this.http
      .post(url, data, { headers: this.getHeadersJson() })
      .pipe(catchError(this.errorHandler));
  }

  public login(data: any): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/login`;
    return this.http
      .post(url, data, { headers: this.getHeadersJson() })
      .pipe(catchError(this.errorHandler));
  }

  public logout(): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/logout`;
    return this.http
      .post(url, { headers: this.getHeadersJson() })
      .pipe(catchError(this.errorHandler));
  }

  /* public verifyToken(): Observable<any> {
    const url = `${environment.eventgateApi}/token/verify/`;
    return this.http
      .post(
        url,
        { token: this.currentAccessToken },
        { headers: this.getHeadersJson() }
      )
      .pipe(catchError(this.errorHandler));
  } */

  public refreshToken(): Observable<any> {
    const url = `${environment.eventgateApi}/token/refresh/`;
    return this.http
      .post(url, { refresh: this.currentRefreshToken })
      .pipe(catchError(this.errorHandler));
  }

  public storeAccessToken(accessToken: string) {
    this.currentAccessToken = accessToken;
    const newToken = { access: accessToken, refresh: this.currentRefreshToken };
    this.storageService.set('token', newToken);
  }

  public verifyOtp(otp_code: string, email: string): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/verify-otp`;
    return this.http
      .post(url, { otp_code, email }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.errorHandler));
  }

  public cancelAccountCreation(email: string): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/cancel-account`;
    return this.http
      .post(url, { email }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.errorHandler));
  }

  public resendOtp(email: string): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/resend-otp`;
    return this.http
      .post(url, { email }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.errorHandler));
  }

  public completeProfile(data: FormData): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/complete-profile`;
    return this.http.patch(url, data).pipe(catchError(this.errorHandler));
  }

  public skipCompleteProfile(): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/skip-complete-profile`;
    return this.http.patch(url, null).pipe(catchError(this.errorHandler));
  }

  /* public logout() {
    this.currentAccessToken = null;
    this.currentRefreshToken = null;
    this.isAuthenticated.next(false);
    this.storageService.remove('token');
  } */
}
