import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toast$ | async as toast">
      <div class="toast-box" [ngClass]="toast.tipo">
        <span class="icon">{{ toast.tipo === 'success' ? '✅' : '❌' }}</span>
        <span class="message">{{ toast.mensagem }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Efeito "mola" */
    }
    .toast-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      min-width: 250px;
    }
    .toast-box.success { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
    .toast-box.error { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
    .icon { font-size: 1.2rem; }

    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
