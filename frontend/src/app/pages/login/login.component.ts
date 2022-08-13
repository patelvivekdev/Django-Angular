import { Input, Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onLogin(form: any) {
    console.log(form);
  }
  onRegister() {
    this.router.navigate(['/register']);
  }
  onForgotPassword() {}
}
