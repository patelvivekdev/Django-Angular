import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomValidators } from './../../providers/CustomValidators';
import { AuthService } from 'src/app/services/auth.service';

const patternWithMessage = (
  pattern: string | RegExp,
  message: string
): ValidatorFn => {
  const delegateFn = Validators.pattern(pattern);
  return (control) => (delegateFn(control) === null ? null : { message });
};

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  old_password = new FormControl('', [
    Validators.required,
    patternWithMessage(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      `Password must be at least 8 characters | contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and Can contain special characters`
    ),
  ]);

  password = new FormControl('', [
    Validators.required,
    patternWithMessage(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      `Password must be at least 8 characters | contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and Can contain special characters`
    ),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);

  changePasswordForm = new FormGroup(
    {
      password: this.password,
      confirmPassword: this.confirmPassword,
    },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]
  );

  get passwordMatchError() {
    return (
      this.changePasswordForm.getError('mismatch') &&
      this.changePasswordForm.get('confirmPassword')?.touched
    );
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onChangePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    const value = {
      old_password: String(this.old_password.value),
      new_password: String(this.password.value),
      password_confirmation: String(this.confirmPassword.value),
    };
    this.authService.changePassword(value).subscribe({
      next: (data) => {
        this._snackBar.open('Password Change successfully', '', {
          duration: 3000,
        });
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        console.log(err);
        this._snackBar.open(err.error.message, '', {
          duration: 3000,
        });
      },
    });
  }
}
