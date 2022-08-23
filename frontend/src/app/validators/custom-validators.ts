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
    const { password, passwordConfirmation } = control.value;
    return password === passwordConfirmation ? null : { misMatch: true };
  }

  patternWithMessage = (
    pattern: string | RegExp,
    message: string
  ): ValidatorFn => {
    const delegateFn = Validators.pattern(pattern);
    return (control) => (delegateFn(control) === null ? null : { message });
  };
}
