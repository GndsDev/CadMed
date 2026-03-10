import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbService } from '../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumb-container" aria-label="Breadcrumb">
      <ul class="breadcrumb">
        <li *ngFor="let item of (breadcrumbs$ | async); let last = last">
          <a *ngIf="!last" [routerLink]="item.url" class="breadcrumb-link">
            {{ item.label }}
          </a>
          <span *ngIf="last" class="breadcrumb-current">
            {{ item.label }}
          </span>
          <span *ngIf="!last" class="breadcrumb-separator">/</span>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      padding: 0.5rem 0;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-light);
    }

    .breadcrumb {
      list-style: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      flex-wrap: wrap;
    }

    .breadcrumb li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .breadcrumb-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s ease;
    }

    .breadcrumb-link:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .breadcrumb-current {
      color: var(--text-dark);
      font-weight: 600;
      font-size: 0.95rem;
    }

    .breadcrumb-separator {
      color: var(--text-light);
      margin: 0 0.25rem;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs$: any;

  constructor(private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }
}
