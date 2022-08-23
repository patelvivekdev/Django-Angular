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
import { CheckUserEmail } from 'src/app/validators/check-useremail';
import { CustomValidators } from '../../validators/custom-validators';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  durationInSeconds = 3;
  firstName = new FormControl('', [Validators.required]);
  lastName = new FormControl('', [Validators.required]);
  email = new FormControl(
    '',
    [
      Validators.required,
      this.customValidators.patternWithMessage(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        'Invalid Email'
      ),
    ],
    [this.checkUserEmail.validate.bind(this.checkUserEmail)]
  );
  password = new FormControl('', [
    Validators.required,
    this.customValidators.patternWithMessage(
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
    {
      validators: [this.customValidators.match],
    }
  );

  get passwordMatchError() {
    return (
      this.registerForm.getError('misMatch') &&
      this.registerForm.get('confirmPassword')?.touched
    );
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private checkUserEmail: CheckUserEmail,
    private customValidators: CustomValidators,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  onRegister() {
    if (this.registerForm.invalid) {
      console.log('register form is invalid', this.registerForm);
      return;
    }
    const value = {
      first_name: String(this.firstName.value),
      last_name: String(this.lastName.value),
      email: String(this.email.value),
      password: String(this.password.value),
      password_confirmation: String(this.confirmPassword.value),
    };
    this.authService.register(value).subscribe({
      next: (data) => {
        this.registerForm.reset();
        this._snackBar.open('User Registration Successful', '', {
          duration: this.durationInSeconds * 1000,
        });
        // Navigate to the login page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this._snackBar.open('Registration Failed', '', {
          duration: this.durationInSeconds * 1000,
        });
        // if (err.status === 0) {
        //   this.registerForm.setErrors({
        //     noConnection: true,
        //   });
        // } else {
        //   this.registerForm.setErrors({
        //     serverError: true,
        //   });
        // }
      },
    });
  }

  onLogin() {
    this.router.navigate(['/login']);
  }
}
