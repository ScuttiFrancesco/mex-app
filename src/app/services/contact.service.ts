import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { Contact } from '../models/Contact';
import { API_BASE_URL } from '../models/constants';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = API_BASE_URL;
  errorMex: string = '';
  private contactList$ = new BehaviorSubject<Contact[]>([]);
  contactList = this.contactList$.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authservice: AuthService
  ) {}

  getContactList(): Observable<Contact[]> {
    const Url = `${this.apiUrl}api/Contact`;

    return this.authservice.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token non disponibile'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
          'Content-Type': 'application/json',
        });

        return this.httpClient.get<Contact[]>(Url, { headers }).pipe(
          tap((data: any) => {
            this.contactList$.next(data.data);
          }),
          catchError((error: HttpErrorResponse) => {
            this.errorMex = error.message;
            return throwError(() => error);
          })
        );
      })
    );
  }

  getContact(id: number): Observable<Contact> {
    const Url = `${this.apiUrl}api/User/`;

    return this.authservice.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token non disponibile'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
          'Content-Type': 'application/json',
        });

        return this.httpClient.get<Contact>(Url + id, { headers }).pipe(
          catchError((error: HttpErrorResponse) => {
            this.errorMex = error.message;
            return throwError(() => error);
          })
        );
      })
    );
  }

  
  getImage(id: number): Observable<Blob> {
    const Url = `${this.apiUrl}api/User/GetImage/`;

    return this.authservice.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token non disponibile'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
          'Content-Type': 'application/json',
        });

        // GESTIONE ERRORI CORRETTA
        return this.httpClient
          .get(Url + id, { headers, responseType: 'blob' })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.errorMex = 'Errore imprevisto';
              if (error.error && error.error.message) {
                this.errorMex = error.error.message;
              } else {
                if (error.status === 401) {
                  this.errorMex = 'User not authorizated';
                }
                if (error.status === 500) {
                  this.errorMex = 'id selezionato non presente in archivio';
                }
              }
              return throwError(() => this.errorMex);
            })
          );
      })
    );
  }

  deleteContact(id: number) {
    const Url = `${this.apiUrl}api/Contact/`;

    return this.authservice.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token non disponibile'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
          'Content-Type': 'application/json',
        });

        return this.httpClient.delete<Contact>(Url + id, { headers }).pipe(
          catchError((error: HttpErrorResponse) => {
            this.errorMex = error.message;
            return throwError(() => this.errorMex);
          })
        );
      })
    );
  }

  insertContact(userId: number, nickname: string): Observable<any> {
    const Url = `${this.apiUrl}api/Contact`;

    return this.authservice.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token non disponibile'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
          'Content-Type': 'application/json',
        });
        console.log(token);
        return this.httpClient
          .post<any>(Url, { userId, nickname }, { headers })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.errorMex = error.message;
              return throwError(() => this.errorMex);
            })
          );
      })
    );
  }

  updateContact(id: number, nickname: string): Observable<any> {
    const Url = `${this.apiUrl}api/Contact`;

    return this.authservice.getToken().pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('Token non disponibile'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          accept: 'text/plain',
          'Content-Type': 'application/json',
        });
        console.log(token);
        return this.httpClient
          .put<any>(Url, { id, nickname }, { headers })
          .pipe(
            catchError((error: HttpErrorResponse) => {
              this.errorMex = error.message;
              return throwError(() => this.errorMex);
            })
          );
      })
    );
  }
}
