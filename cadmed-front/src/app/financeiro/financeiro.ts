import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FinanceiroService } from '../services/financeiro.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-financeiro',
  standalone: false,
  templateUrl: './financeiro.html',
  styleUrls: ['./financeiro.css']
})
export class FinanceiroComponent implements OnInit {
  historicoPagamentos: any[] = [];
  chart: any;
  carregando: boolean = true;

  constructor(private financeiroService: FinanceiroService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.financeiroService.obterHistorico().subscribe({
      next: (dados) => {
        this.historicoPagamentos = dados.map((pag: any) => {
          // 1. Tratamento da Data
          if (Array.isArray(pag.dataPagamento)) {
            const [ano, mes, dia, hora, min] = pag.dataPagamento;
            pag.dataPagamento = new Date(ano, mes - 1, dia, hora || 0, min || 0);
          }

          // 2. Tradução do Método de Pagamento (Remove os _ e formata)
          pag.metodoPagamento = this.formatarMetodoPagamento(pag.metodoPagamento);

          return pag;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        // Mantemos apenas o log de erro para monitorização
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

  // Função Auxiliar para embelezar o texto do Cartão
  formatarMetodoPagamento(metodo: string): string {
    if (!metodo) return '';

    // Mapeamento manual para garantir a acentuação correta
    const traducoes: { [key: string]: string } = {
      'CARTAO_CREDITO': 'Cartão de Crédito',
      'CARTAO_DEBITO': 'Cartão de Débito',
      'DINHEIRO': 'Dinheiro',
      'PIX': 'Pix',
      'TRANSFERENCIA': 'Transferência'
    };

    return traducoes[metodo] || metodo.replace(/_/g, ' ');
  }

  renderizarGrafico(dados: any[]) {
  const canvas = document.getElementById('graficoFaturamento') as HTMLCanvasElement;
  if (!canvas) return;

  if (this.chart) {
    this.chart.destroy();
  }

  const nomesMeses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // --- LÓGICA DE NORMALIZAÇÃO ---
  // Criamos um array de 12 posições preenchido com zeros
  const valoresFaturamento = new Array(12).fill(0);

  // Percorremos o que veio do Java e preenchemos a posição correta no nosso array de 12 meses
  dados.forEach(d => {
    // d.mes costuma vir como 1 para Janeiro, 2 para Fevereiro...
    // No Array, a posição 0 é Janeiro, então fazemos mes - 1
    const indice = d.mes - 1;
    if (indice >= 0 && indice < 12) {
      valoresFaturamento[indice] = d.total;
    }
  });

  this.chart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: nomesMeses, // Agora usamos sempre os 12 meses como legenda
      datasets: [{
        label: 'Faturamento (R$)',
        data: valoresFaturamento, // Usamos o nosso array normalizado
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true, // Garante que o gráfico comece do 0 no eixo vertical
          ticks: {
            callback: (value) => 'R$ ' + value // Formata os valores no eixo Y
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
