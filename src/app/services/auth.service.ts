import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { API_BASE_URL } from '../models/constants';
import { Login } from '../models/Login';
import { AuthResponse } from '../models/AuthResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = API_BASE_URL;
  private token$ = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );

  constructor(private http: HttpClient, private router: Router) {}

  login(user: Login): Observable<AuthResponse> {
    const encryptedUsername = btoa(user.username);
    const encryptedPassword = btoa(user.password);
    const headers = new HttpHeaders({
      accept: 'text/plain',
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(
        `${this.apiUrl}api/Auth/Login`,
        {
          username: encryptedUsername,
          password: encryptedPassword,
        },
        { headers }
      )
      .pipe(
        tap((res) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('tokenExpiration', res.data.expirationDate);
            this.token$.next(res.data.token);
          } else {
            throw new Error(res.errorMessage);
          }
        }),
        catchError((err) =>
          throwError(
            () => new Error(err.errorMessage || 'Errore di autenticazione')
          )
        )
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    this.token$.next(null);
    this.router.navigate(['/login']);
  }

  getNewAccessToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = localStorage.getItem('token');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('Nessun refresh token trovato'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}api/Auth/RefreshToken`,
        {
          token: token,
          refreshToken: refreshToken,
        },
        { headers }
      )
      .pipe(
        tap((res) => {
          console.log('In getNewAccessToken() => tap()')
          console.log(token)
          console.log(refreshToken)
          if (res.success) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('tokenExpiration', res.data.expirationDate);
            this.token$.next(res.data.token);
          } else {
            this.logout();
            throw new Error(res.errorMessage);
          }
        }),
        map((res) => res.data.token),
        catchError((err) => {
          this.logout();
          return throwError(() => new Error('Sessione scaduta'));
        })
      );
  }

  getToken(): Observable<string | null> {
    /*  const tokenValue = this.token$.value; // Ottieni il valore corrente per il log
    console.log('getToken() is emitting:', tokenValue); */
    return this.token$.asObservable();
  }
}
