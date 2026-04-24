import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service'; // <-- Importamos o nosso novo serviço

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // Variáveis para guardar os números do Back-end
  resumo: any = {
    totalPacientes: 0,
    totalMedicos: 0,
    consultasHoje: 0,
    consultasConcluidas: 0
  };

  carregando = true; // Controla o "A carregar..." na tela

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService // <-- Injetamos o serviço aqui
  ) {}

  // No dashboard.ts
ngOnInit() {
  this.carregando = true; // Força o estado de carregamento inicial
  setTimeout(() => {
    this.carregarResumo();
  }, 500); // 500ms é o tempo de "segurança"
}

  // Função que vai ao Java buscar a estatística
  carregarResumo() {
    this.carregando = true;
    this.dashboardService.getResumo().subscribe({
      next: (dados) => {
        this.resumo = dados;
        this.carregando = false;
      },
      error: (e) => {
        console.error('Erro ao carregar os dados do dashboard', e);
        this.carregando = false; // Paramos o carregamento mesmo se der erro
      }
    });
  }

  isMedico(): boolean {
    return this.authService.isMedico();
  }

  isSecretaria(): boolean {
    return this.authService.isSecretaria();
  }
}
