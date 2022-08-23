import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomValidators } from '../../validators/custom-validators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  private sub: any;

  password = new FormControl('', [
    Validators.required,
    this.customValidators.patternWithMessage(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
      `Password must be at least 8 characters | contain at least 1 uppercase letter, 1 lowercase letter, and 1 number and Can contain special characters`
    ),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);

  resetPasswordForm = new FormGroup(
    {
      password: this.password,
      confirmPassword: this.confirmPassword,
    },
    {
      validators: [this.customValidators.match],
    }
  );

  get passwordMatchError() {
    return (
      this.resetPasswordForm.getError('misMatch') &&
      this.resetPasswordForm.get('confirmPassword')?.touched
    );
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private customValidators: CustomValidators,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
  }

  onResetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    const value = {
      token: this.token,
      password: String(this.password.value),
      password_confirmation: String(this.confirmPassword.value),
    };
    this.authService.resetPassword(value).subscribe({
      next: (data) => {
        this._snackBar.open('Password reset successfully', '', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this._snackBar.open(err.error.detail, '', {
          duration: 3000,
        });
      },
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
