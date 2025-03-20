import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/Login';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  loginForm: Login | undefined;
  errorMessage: string | null = null;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Compila tutti i campi!';
      return;
    }
    
    this.loading = true;
    this.errorMessage = null;

    const userLogin: Login = { ...form.value } as Login;

    this.authService.login(userLogin).subscribe({
      
      next: () => {
      
        this.loading = false;
        this.router.navigate(['./home']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Errore di autenticazione';
      },
    });
  }
}
