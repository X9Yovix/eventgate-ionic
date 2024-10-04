import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

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

  login(data: any) {
    const url = `${environment.eventgateApi}/profiles/login`;
    return this.http
      .post(url, data, { headers: this.getHeaders() })
      .pipe(catchError(this.errorHandler));
  }
}
