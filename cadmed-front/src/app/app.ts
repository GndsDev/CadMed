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

  menuAberto: boolean = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  sair() {
    this.authService.sair();
    this.fecharMenu();
    this.router.navigate(['/login']);
  }

  alternarMenu() {
    this.menuAberto = !this.menuAberto;
  }

  fecharMenu() {
    this.menuAberto = false;
  }
}
