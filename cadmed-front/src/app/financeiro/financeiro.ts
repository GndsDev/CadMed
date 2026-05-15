import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinanceiroService } from '../services/financeiro.service';

@Component({
  selector: 'app-financeiro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financeiro.html',
  styleUrls: ['./financeiro.css']
})
export class FinanceiroComponent implements OnInit {
  historicoPagamentos: any[] = [];
  chart?: import('chart.js').Chart;
  carregando = true;

  constructor(private financeiroService: FinanceiroService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.financeiroService.obterHistorico().subscribe({
      next: (dados) => {
        this.historicoPagamentos = dados.map((pag: any) => {
          if (Array.isArray(pag.dataPagamento)) {
            const [ano, mes, dia, hora, min] = pag.dataPagamento;
            pag.dataPagamento = new Date(ano, mes - 1, dia, hora || 0, min || 0);
          }

          pag.metodoPagamento = this.formatarMetodoPagamento(pag.metodoPagamento);
          return pag;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro na API de Histórico:', err);
      }
    });

    this.financeiroService.obterDadosGrafico().subscribe({
      next: (dadosGrafico) => {
        this.carregando = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.renderizarGrafico(dadosGrafico);
        }, 50);
      },
      error: (err) => {
        console.error('Erro na API do Gráfico:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatarMetodoPagamento(metodo: string): string {
    if (!metodo) return '';

    const traducoes: { [key: string]: string } = {
      CARTAO_CREDITO: 'Cartão de Crédito',
      CARTAO_DEBITO: 'Cartão de Débito',
      DINHEIRO: 'Dinheiro',
      PIX: 'Pix',
      TRANSFERENCIA: 'Transferência'
    };

    return traducoes[metodo] || metodo.replace(/_/g, ' ');
  }

  async renderizarGrafico(dados: any[]) {
    const canvas = document.getElementById('graficoFaturamento') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    const { default: Chart } = await import('chart.js/auto');
    const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const valoresFaturamento = new Array(12).fill(0);

    dados.forEach((d) => {
      const indice = d.mes - 1;
      if (indice >= 0 && indice < 12) {
        valoresFaturamento[indice] = d.total;
      }
    });

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: nomesMeses,
        datasets: [
          {
            label: 'Faturamento (R$)',
            data: valoresFaturamento,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => 'R$ ' + value
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
