import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Django-Angular-Auth';
  faGithub = faGithub;
  signedin$: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.signedin$ = this.authService.signedin$;
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe({
      next: (data) => {
        console.log(data);
        // this.signedin$.next(data.authenticated);
      },
      error: (err) => {
        if (err.status === 403) {
          this._snackBar.open('Invalid Credentials', '', {
            duration: 3 * 1000,
          });
        } else {
          this._snackBar.open('Something went wrong', '', {
            duration: 3 * 1000,
          });
        }
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
