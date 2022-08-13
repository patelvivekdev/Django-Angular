import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Django-Angular-Auth';
  faGithub = faGithub;

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}