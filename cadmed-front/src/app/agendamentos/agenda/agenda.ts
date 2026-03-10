import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoService } from '../../services/agendamento.service';
import { PacienteService } from '../../services/paciente.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda.html'
})
export class AgendaComponent implements OnInit { // <-- AQUI ESTAVA O ERRO (Tem de ser AgendaComponent)

  agendamentos: any[] = [];
  pacientes: any[] = [];
  carregando: boolean = false;

  formAgenda = {
    pacienteId: '',
    data: '',
    hora: '',
    observacoes: ''
  };

  constructor(
    private agendamentoService: AgendamentoService,
    private pacienteService: PacienteService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Agenda', url: '/agenda' }
    ]);
    this.carregarListas();
  }

  carregarListas() {
    this.carregando = true;
    this.pacienteService.listar().subscribe({
      next: (dados: any) => this.pacientes = dados,
      error: (e: any) => console.error(e)
    });

    this.agendamentoService.listar().subscribe({
      next: (dados: any) => {
        this.agendamentos = dados;
        this.carregando = false;
      },
      error: (e: any) => {
        console.error(e);
        this.carregando = false;
      }
    });
  }

  agendar() {
    this.carregando = true;
    const dataHoraISO = `${this.formAgenda.data}T${this.formAgenda.hora}:00`;
    const payload = {
      medicoId: 'a_definir_pelo_login',
      pacienteId: this.formAgenda.pacienteId,
      dataHora: dataHoraISO
    };

    this.agendamentoService.agendar(payload).subscribe({
      next: () => {
        alert('Consulta agendada com sucesso!');
        this.carregarListas();
        this.formAgenda = { pacienteId: '', data: '', hora: '', observacoes: '' };
      },
      error: (erro: any) => {
        alert('Erro ao agendar.');
        console.error(erro);
        this.carregando = false;
      }
    });
  }

  formatarDataHora(dataISO: string): string {
    if (!dataISO) return '-';
    return dataISO.replace('T', ' às ').substring(0, 16);
  }
}
