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
    const canvas = document.getElementById('meuGrafico') as HTMLCanvasElement;
    if (!canvas) return;

    // Se já existir um gráfico, destrói antes de criar outro (evita bugs de sobreposição)
    if (this.grafico) {
      this.grafico.destroy();
    }

    this.grafico = new Chart(canvas, {
      type: 'doughnut', // Aqui está a mágica: mudou de 'bar' para 'doughnut' (rosca)
      data: {
        labels: ['Consultas Hoje', 'Atendimentos Concluídos'],
        datasets: [{
          data: [this.resumo.consultasHoje, this.resumo.consultasConcluidas],
          backgroundColor: [
            '#3b82f6', // Azul (Agendadas)
            '#10b981'  // Verde (Concluídas)
          ],
          borderWidth: 0,
          hoverOffset: 10 // A fatia "pula" para fora quando passa o mouse!
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%', // Tamanho do buraco no meio (deixa o design mais leve)
        plugins: {
          legend: {
            position: 'bottom', // Coloca a legenda em baixo para não espremer o gráfico
            labels: { color: '#64748b', font: { size: 14 } }
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
