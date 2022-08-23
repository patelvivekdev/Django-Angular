import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
@Injectable({
  providedIn: 'root',
})
export class CustomValidators {
  match(control: AbstractControl<any, any>): ValidationErrors | null {
    const { password, confirmPassword } = control.value;
    return password === confirmPassword ? null : { misMatch: true };
  }

  patternWithMessage = (
    pattern: string | RegExp,
    message: string
  ): ValidatorFn => {
    const delegateFn = Validators.pattern(pattern);
    return (control) => (delegateFn(control) === null ? null : { message });
  };
}
