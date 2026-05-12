import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';

// 1. Importações do Chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  resumo: any = {
    totalPacientes: 0,
    totalMedicos: 0,
    consultasHoje: 0,
    consultasConcluidas: 0,
    faturamentoHoje: 0
  };

  // Ideia 6: Lista de avisos (Pode vir do back-end no futuro)
  avisos: any[] = [];

  carregando = true;
  graficoFluxo: any; // Instância do gráfico de barras

  constructor(
    public authService: AuthService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregando = true;
    this.tentarCarregarEstatisticas();
  }

  ngAfterViewInit() {
    // Se os dados já estiverem carregados por algum motivo, renderiza
    if (!this.carregando) {
      this.renderizarGraficoFluxo();
    }
  }

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

        // 2. Alimenta a Central de Avisos com os dados vindos do Java!
        // Usamos o || [] para garantir que não dá erro se o Java não mandar nada
        this.avisos = dados.avisos || [];

        this.carregando = false;
        this.cdr.detectChanges();

        // 3. Chama o gráfico APENAS APÓS receber os dados do Java
        setTimeout(() => this.renderizarGraficoFluxo(), 0);
      },
      error: (e) => {
        console.error('Erro ao carregar os dados', e);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Ideia 5: Renderiza o gráfico de barras (Fluxo Semanal)
  renderizarGraficoFluxo() {
    const canvas = document.getElementById('graficoFluxo') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.graficoFluxo) {
      this.graficoFluxo.destroy();
    }

    // 1. Gera os rótulos dinamicamente (Ex: se hoje for Quinta, ele cria ['Sáb', 'Dom', 'Seg', 'Ter', 'Qua', 'Qui'])
    const labelsDinamicas = [];
    for (let i = 5; i >= 0; i--) {
      const data = new Date();
      data.setDate(data.getDate() - i);
      // Pega o nome abreviado do dia em português (ex: "seg", "ter") e coloca com a primeira letra maiúscula
      let diaFormatado = data.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      diaFormatado = diaFormatado.charAt(0).toUpperCase() + diaFormatado.slice(1);
      labelsDinamicas.push(diaFormatado);
    }

    // 2. Pega os dados reais vindos do Java
    const dadosReaisDoGrafico = this.resumo.fluxoSemanal || [0, 0, 0, 0, 0, 0];

    this.graficoFluxo = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labelsDinamicas, // <-- Nomes dos dias gerados dinamicamente
        datasets: [{
          label: 'Atendimentos',
          data: dadosReaisDoGrafico, // <-- Dados 100% reais do banco!
          backgroundColor: '#10b981',
          borderRadius: 5,
          barThickness: 25
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { stepSize: 1 } // Garante que o eixo Y mostre números inteiros (1, 2, 3...)
          },
          x: { grid: { display: false } }
        }
      }
    });
  }

  // Auxiliares de permissão
  isMedico() { return this.authService.isMedico(); }
  isSecretaria() { return this.authService.isSecretaria(); }
  isPaciente() { return this.authService.isPaciente(); }
}
