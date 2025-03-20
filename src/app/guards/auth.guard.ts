import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getToken().pipe(
      map(token => {
        if (token) {
          return true; // Token presente, route attivata
        } else {
          this.router.navigate(['/login']); // Token assente, reindirizza al login
          return false; // Route non attivata
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']); // Errore nell'ottenere il token, reindirizza al login
        return of(false); // Route non attivata
      })
    );
  }

 /*  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    console.log(token);
    return true;
  } */
}
