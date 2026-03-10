import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService, BreadcrumbItem } from '../services/breadcrumb.service';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Dashboard carregado com sucesso!');
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' }
    ]);
  }

  isMedico(): boolean {
    return this.authService.isMedico();
  }

  isSecretaria(): boolean {
    return this.authService.isSecretaria();
  }
}
