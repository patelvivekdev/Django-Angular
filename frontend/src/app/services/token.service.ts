import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  saveToken(access_token: string, refresh_token: string) {
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  setAccessToken(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  removeAccessToken() {
    return localStorage.removeItem('access_token');
  }

  setRefreshToken(refresh_token: string) {
    localStorage.setItem('refresh_token', refresh_token);
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }

  removeRefreshToken() {
    return localStorage.removeItem('refresh_token');
  }

  clear() {
    localStorage.clear();
  }
}
