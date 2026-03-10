import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  sair() {
    this.authService.sair();
    this.router.navigate(['/login']);
  }
}
