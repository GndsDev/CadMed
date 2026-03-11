import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoService } from '../../services/agendamento.service';
import { PacienteService } from '../../services/paciente.service';
import { MedicoService } from '../../services/medico.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html'
})
export class AgendaComponent implements OnInit {

  agendamentos: any[] = [];
  pacientes: any[] = [];
  medicos: any[] = [];
  carregando: boolean = false;

  formAgenda = { pacienteId: '', medicoId: '', data: '', hora: '', observacoes: '' };

  constructor(
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService,
    private medicoService: MedicoService,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Agenda', url: '/agenda' }
    ]);
    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;

    // Só a Secretária precisa de carregar a lista de nomes para o formulário
    if (this.authService.isSecretaria()) {
      this.pacienteService.listar().subscribe(d => this.pacientes = d);
      this.medicoService.listar().subscribe(d => this.medicos = d);
    }

    this.carregarAgendamentos();
  }

  carregarAgendamentos() {
    this.agendamentoService.listar().subscribe({
      next: (dados: any[]) => {
        const perfil = this.authService.getRole();
        const usuarioAtual = this.authService.obterUsuarioAtual();

        if (perfil === 'SECRETARIA') {
          this.agendamentos = dados; // Vê tudo
        }
        else if (perfil === 'MEDICO' && usuarioAtual) {
          // Filtro silencioso e limpo
          this.agendamentos = dados.filter(a =>
            a.medico && a.medico.email && a.medico.email.toLowerCase() === usuarioAtual.email.toLowerCase()
          );
        }

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (e: any) => { console.error(e); this.carregando = false; }
    });
  }

  agendar() {
    this.carregando = true;
    const dataHoraISO = `${this.formAgenda.data}T${this.formAgenda.hora}:00`;
    const payload = {
      medicoId: this.formAgenda.medicoId,
      pacienteId: this.formAgenda.pacienteId,
      dataHora: dataHoraISO
    };

    this.agendamentoService.agendar(payload).subscribe({
      next: () => {
        alert('Consulta agendada com sucesso!');
        this.formAgenda = { pacienteId: '', medicoId: '', data: '', hora: '', observacoes: '' };
        this.carregarAgendamentos(); // Recarrega a tabela!
      },
      error: (erro: any) => { alert('Erro ao agendar.'); console.error(erro); this.carregando = false; }
    });
  }

  mudarStatus(id: string, novoStatus: string) {
    if(confirm(`Mudar status para ${novoStatus}?`)) {
      this.agendamentoService.atualizarStatus(id, novoStatus).subscribe({
        next: () => this.carregarAgendamentos(),
        error: (e) => console.error('Erro ao atualizar', e)
      });
    }
  }

  cancelar(id: string) {
    if(confirm('Tem a certeza que deseja cancelar esta consulta?')) {
      this.agendamentoService.excluir(id).subscribe({
        next: () => this.carregarAgendamentos(),
        error: (e) => console.error('Erro ao cancelar', e)
      });
    }
  }

  formatarDataHora(dataISO: string): string {
    if (!dataISO) return '-';
    const partes = dataISO.split('T');
    const data = partes[0].split('-').reverse().join('/'); // Ex: 20-05-2024
    const hora = partes[1].substring(0, 5); // Ex: 14:30
    return `${data} às ${hora}`;
  }
}
