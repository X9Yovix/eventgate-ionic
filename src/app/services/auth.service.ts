import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  private getHeaders(): HttpHeaders {
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
      .post(url, data, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public login(data: any): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/login`;
    return this.http
      .post(url, data, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public logout(): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/logout`;
    return this.http
      .post(url, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public verifyToken(token: string): Observable<any> {
    const url = `${environment.eventgateApi}/token/verify/`;
    return this.http
      .post(url, { token }, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public async refreshToken(refresh: string): Promise<Observable<any>> {
    const url = `${environment.eventgateApi}/token/refresh/`;
    const token = await this.storageService.get('token');
    const headers = this.getHeaders()
      .set('Authorization', `Bearer ${token.access}`)
      .set('Content-Type', 'application/json');
    return this.http
      .post(url, { refresh }, { headers })
      .pipe(catchError(this.errorHandler));
  }

  public verifyOtp(otp_code: string, email: string): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/verify-otp`;
    return this.http
      .post(url, { otp_code, email }, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public cancelAccountCreation(email: string): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/cancel-account`;
    return this.http
      .post(url, { email }, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public resendOtp(email: string): Observable<any> {
    const url = `${environment.eventgateApi}/profiles/resend-otp`;
    return this.http
      .post(url, { email }, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }

  public async completeProfile(data: FormData): Promise<Observable<any>> {
    const url = `${environment.eventgateApi}/profiles/complete-profile`;
    const token = await this.storageService.get('token');
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${token.access}`
    );

    return this.http
      .patch(url, data, { headers })
      .pipe(catchError(this.errorHandler));
  }

  public async skipCompleteProfile(): Promise<Observable<any>> {
    const url = `${environment.eventgateApi}/profiles/skip-complete-profile`;
    const token = await this.storageService.get('token');
    const headers = this.getHeaders().set(
      'Authorization',
      `Bearer ${token.access}`
    );
    return this.http
      .patch(url, null, { headers })
      .pipe(catchError(this.errorHandler));
  }
}
