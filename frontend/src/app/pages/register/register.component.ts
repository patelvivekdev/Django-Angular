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

const patternWithMessage = (
  pattern: string | RegExp,
  message: string
): ValidatorFn => {
  const delegateFn = Validators.pattern(pattern);
  return (control) => (delegateFn(control) === null ? null : { message });
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  durationInSeconds = 5;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl('', [
    Validators.required,
    patternWithMessage(
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
      'Invalid Email'
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

  registerForm = new FormGroup(
    {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
    },
    [CustomValidators.MatchValidator('password', 'confirmPassword')]
  );

  get passwordMatchError() {
    return (
      this.registerForm.getError('mismatch') &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }
  constructor(private router: Router, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {}

  onRegister(form: any) {
    if (this.registerForm.valid) {
      this._snackBar.open('Registration Successful', '', {
        duration: this.durationInSeconds * 1000,
      });
      this.router.navigate(['/login']);
    } else {
      this._snackBar.open('Registration Failed', '', {
        duration: this.durationInSeconds * 1000,
      });
    }
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
