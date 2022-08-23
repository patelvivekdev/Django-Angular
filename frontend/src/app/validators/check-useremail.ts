import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CheckUserEmail implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate = (
    control: AbstractControl<any, any>
  ): Observable<ValidationErrors | null> => {
    const { value } = control;
    return this.authService.checkUserEmail(value).pipe(
      map((res) => {
        if (res.available) {
          return null;
        }
        return null;
      }),
      catchError((err) => {
        if (err.status === 400) {
          return of({
            usernameTaken: true,
          });
        } else {
          return of({
            noConnection: true,
          });
        }
      })
    );
  };
}
