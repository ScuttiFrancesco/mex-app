import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { switchMap, catchError, filter, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = localStorage.getItem('token'); // Get token from localStorage

    if (token != null) {
      authReq = this.addTokenHeader(req, token); // Add token to header for every request initially
    }

    return next.handle(authReq).pipe(
      // Send the request and THEN handle errors
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Handle 401 Unauthorized response from the server
          return this.handle401Error(authReq, next);
        }

        return throwError(() => error); // Propagate other errors
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log('Handling 401 error...');
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null); // Reset the subject

      const refreshToken = localStorage.getItem('refreshToken'); // Get refresh token
      console.log('Refresh token:', refreshToken);
      if (refreshToken) {
        return this.authService.getNewAccessToken().pipe(
          // Call AuthService to refresh token
          switchMap((newToken: string) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(newToken); // Emit new token to subject
            return next.handle(this.addTokenHeader(request, newToken)); // Retry original request with new token
          }),
          catchError((err) => {
            console.error('Error refreshing token:', err);
            this.isRefreshing = false;
            this.authService.logout(); // Logout on refresh failure
            return throwError(() => err);
          })
        );
      } else {
        // No refresh token available, logout
        console.error('No refresh token available, logging out...');
        this.isRefreshing = false;
        this.authService.logout();
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // Refreshing is already in progress, queue the request
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null), // Wait for token to be non-null
        take(1), // Take only the first emitted token
        switchMap((newToken) => {
          console.log('Retrying request with new token:', newToken);
          return next.handle(this.addTokenHeader(request, newToken)); // Retry original request with new token
        })
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }
}
