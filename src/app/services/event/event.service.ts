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
export class EventService {
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

  public getAllTags(): Observable<any> {
    const url = `${environment.eventgateApi}/events/tags`;
    return this.http.get(url).pipe(catchError(this.errorHandler));
  }

  public addEvent(data: FormData): Observable<any> {
    const url = `${environment.eventgateApi}/events/add`;
    return this.http.post(url, data).pipe(catchError(this.errorHandler));
  }
}
