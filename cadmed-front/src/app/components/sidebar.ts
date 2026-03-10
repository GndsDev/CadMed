import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="sidebar">
      <nav class="sidebar-nav">
        <ul class="menu-list">
          <li *ngFor="let item of menuItems"
              [class.active]="isActive(item.route)"
              class="menu-item">
            <a [routerLink]="item.route"
               [routerLinkActive]="'menu-link-active'"
               class="menu-link">
              <span class="menu-icon">{{ item.icon }}</span>
              <span class="menu-label">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-logout-sidebar" (click)="logout()">
          <span class="menu-icon">🚪</span>
          <span class="menu-label">Sair</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      background: var(--surface);
      backdrop-filter: blur(10px);
      border-right: 1px solid var(--border-light);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      padding-top: 80px;
      overflow-y: auto;
      box-shadow: 2px 0 8px rgba(0,0,0,0.04);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 0;
    }

    .menu-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .menu-item {
      margin: 0.5rem 0;
    }

    .menu-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.875rem 1.5rem;
      color: var(--text-dark);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      border-left: 3px solid transparent;
    }

    .menu-link:hover {
      background-color: var(--primary-light);
      color: var(--primary);
      border-left-color: var(--primary);
    }

    .menu-link.menu-link-active {
      background-color: var(--primary-light);
      color: var(--primary);
      border-left-color: var(--primary);
      font-weight: 700;
    }

    .menu-icon {
      font-size: 1.3rem;
      min-width: 1.5rem;
    }

    .menu-label {
      flex: 1;
    }

    .sidebar-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-light);
      background: var(--primary-light);
    }

    .btn-logout-sidebar {
      display: flex;
      align-items: center;
      gap: 1rem;
      width: 100%;
      padding: 0.875rem 1rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.95rem;
      font-family: inherit;
    }

    .btn-logout-sidebar:hover {
      background: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.3);
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 200px;
      }

      .menu-label {
        display: none;
      }

      .menu-link {
        justify-content: center;
        padding: 0.875rem;
      }
    }
  `]
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.menuItems = [
      { label: 'Dashboard', icon: '📊', route: '/dashboard' },
      { label: 'Agenda', icon: '📅', route: '/agenda' },
      { label: 'Pacientes', icon: '👥', route: '/pacientes' },
      { label: 'Médicos', icon: '👨‍⚕️', route: '/medicos' }
    ];
  }

  isActive(route: string): boolean {
    return this.router.url.includes(route);
  }

  logout() {
    this.authService.sair();
    this.router.navigate(['/login']);
  }
}
