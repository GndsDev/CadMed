import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';

// 1. Importações obrigatórias do Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  resumo: any = {
    totalPacientes: 0,
    totalMedicos: 0,
    consultasHoje: 0,
    consultasConcluidas: 0,
    faturamentoHoje: 0
  };

  carregando = true;
  grafico: any; // 2. Variável para guardar a instância do gráfico na memória

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregando = true;
    this.tentarCarregarEstatisticas();
  }

  // Espera ativa: Só chama o back-end quando o token realmente existir
  tentarCarregarEstatisticas() {
    if (this.authService.getToken()) {
      this.carregarResumo();
    } else {
      setTimeout(() => this.tentarCarregarEstatisticas(), 200);
    }
  }

  carregarResumo() {
    this.carregando = true;
    this.dashboardService.getResumo().subscribe({
      next: (dados) => {
        this.resumo = dados;
        this.carregando = false;
        this.cdr.detectChanges(); // Força a tela a apagar a ampulheta imediatamente!

        // 3. Após a tela atualizar com os números, desenhamos o gráfico
        this.renderizarGrafico();
      },
      error: (e) => {
        console.error('Erro ao carregar os dados do dashboard', e);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // 4. A função que constrói o visual do gráfico de barras
  renderizarGrafico() {
    // Se já houver um gráfico desenhado, destruímos antes de criar o novo (evita bugar a tela)
    if (this.grafico) {
      this.grafico.destroy();
    }

    const canvas = document.getElementById('meuGrafico') as HTMLCanvasElement;
    if (!canvas) return; // Proteção: se o HTML ainda não tiver o canvas, cancela.

    this.grafico = new Chart(canvas, {
      type: 'bar', // Tipo do gráfico
      data: {
        labels: ['Consultas Hoje', 'Atendimentos', 'Pacientes Ativos', 'Corpo Clínico'],
        datasets: [{
          label: 'Métricas da Clínica',
          data: [
            this.resumo.consultasHoje,
            this.resumo.consultasConcluidas,
            this.resumo.totalPacientes,
            this.resumo.totalMedicos
          ],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',  // Azul
            'rgba(16, 185, 129, 0.7)',  // Verde
            'rgba(245, 158, 11, 0.7)',  // Laranja
            'rgba(139, 92, 246, 0.7)'   // Roxo
          ],
          borderColor: [
            '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'
          ],
          borderWidth: 1,
          borderRadius: 6 // Cantos arredondados nas barras
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false } // Esconde a legenda superior que não precisamos
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 } // Garante que o eixo Y mostre números inteiros (1, 2, 3...)
          }
        }
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
