import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from './token.service';

interface registerCredentials {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface registerResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface loginCredentials {
  email: string;
  password: string;
}

interface loginResponse {
  access_token: string;
  refresh_token: string;
}

interface userResponse {
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface signedinResponse {
  authenticated: boolean;
  username: string;
}

interface resetPasswordCredentials {
  token: string;
  password: string;
  password_confirmation: string;
}

interface changePasswordCredentials {
  old_password: string;
  new_password: string;
  password_confirmation: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  signedin$ = new BehaviorSubject(false);
  constructor(private tokenService: TokenService, private http: HttpClient) {}

  checkUserEmail(email: string) {
    return this.http.post<{ available: boolean }>(
      `${environment.apiUrl}user/check/email/`,
      {
        email: email,
      }
    );
  }

  register(credentials: registerCredentials) {
    return this.http
      .post<registerResponse>(
        `${environment.apiUrl}user/register/`,
        credentials
      )
      .pipe(tap(() => this.signedin$.next(true)));
  }

  login(credentials: loginCredentials) {
    return this.http
      .post<loginResponse>(`${environment.apiUrl}user/login/`, credentials)
      .pipe(tap(() => this.signedin$.next(true)));
  }

  logout() {
    return this.http
      .post(`${environment.apiUrl}user/logout/`, {
        refresh_token: this.tokenService.getRefreshToken(),
      })
      .pipe(tap(() => this.signedin$.next(false)));
  }

  getUser() {
    return this.http.get<userResponse>(`${environment.apiUrl}user/me/`);
  }

  isAuthenticated() {
    return this.http
      .post<signedinResponse>(`${environment.apiUrl}user/is-authenticated/`, {
        refresh_token: this.tokenService.getRefreshToken(),
      })
      .pipe(tap((res) => this.signedin$.next(res.authenticated)));
  }

  refreshToken(refresh_token: string) {
    return this.http.post(`${environment.apiUrl}user/token/refresh/`, {
      refresh_token: refresh_token,
    });
  }

  forgotPassword(email: string) {
    return this.http.post(`${environment.apiUrl}user/password/forgot/`, {
      email: email,
    });
  }

  resetPassword(credentials: resetPasswordCredentials) {
    return this.http.post(
      `${environment.apiUrl}user/password/reset/`,
      credentials
    );
  }

  changePassword(credentials: changePasswordCredentials) {
    return this.http.post(
      `${environment.apiUrl}user/password/change/`,
      credentials
    );
  }
}
