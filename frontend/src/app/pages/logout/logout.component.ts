import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
})
export class LogoutComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.tokenService.clear();
        this._snackBar.open('User Logout Successful', '', {
          duration: 2 * 1000,
        });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this._snackBar.open(err.error.message, '', {
          duration: 2 * 1000,
        });
      },
    });
  }
}
