import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  mensagem: string;
  tipo: 'success' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // O BehaviorSubject guarda o estado atual do Toast (começa nulo/escondido)
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  toast$ = this.toastSubject.asObservable();

  show(mensagem: string, tipo: 'success' | 'error' = 'success') {
    this.toastSubject.next({ mensagem, tipo });

    // Some automaticamente depois de 3 segundos
    setTimeout(() => {
      this.toastSubject.next(null);
    }, 3000);
  }
}
