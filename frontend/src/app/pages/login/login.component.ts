import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

const patternWithMessage = (
  pattern: string | RegExp,
  message: string
): ValidatorFn => {
  const delegateFn = Validators.pattern(pattern);
  return (control) => (delegateFn(control) === null ? null : { message });
};

const minNumberWithMessage = (min: number, message: string): ValidatorFn => {
  const delegateFn = Validators.minLength(min);
  return (control) => (delegateFn(control) === null ? null : { message });
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  durationInSeconds = 3;
  email = new FormControl('', [
    Validators.required,
    patternWithMessage(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Invalid Email'
    ),
  ]);
  password = new FormControl('', [Validators.required]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }
    const value = {
      email: String(this.email.value),
      password: String(this.password.value),
    };
    this.authService.login(value).subscribe({
      next: (data) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        this._snackBar.open('Login Successful', '', {
          duration: this.durationInSeconds * 1000,
        });
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        if (err.status === 403) {
          this._snackBar.open('Invalid Credentials', '', {
            duration: this.durationInSeconds * 1000,
          });
        } else {
          this._snackBar.open('Something went wrong', '', {
            duration: this.durationInSeconds * 1000,
          });
        }
      },
    });
  }
  onRegister() {
    this.router.navigate(['/register']);
  }
  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
