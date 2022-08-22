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

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  email = new FormControl('', [
    Validators.required,
    patternWithMessage(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Invalid Email'
    ),
  ]);
  forgotPasswordForm = new FormGroup({
    email: this.email,
  });
  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onForgotPassword() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    const value = String(this.email.value);
    this.authService.forgotPassword(value).subscribe({
      next: (data) => {
        this._snackBar.open('Email sent', '', {
          duration: 3 * 1000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this._snackBar.open(err.error.message, '', {
          duration: 3 * 1000,
        });
      },
    });
  }
}
