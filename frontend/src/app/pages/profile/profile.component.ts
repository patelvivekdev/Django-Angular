import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user = {
    id: 0,
    first_name: '',
    last_name: '',
    email: '',
  };
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data) => {
        this.user.id = data.data.id;
        this.user.email = data.data.email;
        this.user.first_name = data.data.first_name;
        this.user.last_name = data.data.last_name;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onLogout() {
    this.router.navigate(['/logout']);
  }

  onChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
