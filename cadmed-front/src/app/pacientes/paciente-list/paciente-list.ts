import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-list.html' // (Ajuste para .component.html se for o caso)
})
export class PacienteListComponent implements OnInit { // <-- Nome da classe!

  pacientes: any[] = [];
  carregando: boolean = true;

  constructor(
    private pacienteService: PacienteService,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Pacientes', url: '/pacientes' }
    ]);
    this.carregarPacientes();
  }

  carregarPacientes() {
    this.carregando = true;
    this.pacienteService.listar().subscribe({
      next: (dados: any) => { // <-- Adicionado :any
        // Se for medico, filtrar apenas pacientes dele
        if (this.authService.isMedico()) {
          const usuario = this.authService.obterUsuarioAtual();
          if (usuario && usuario.id) {
            this.pacientes = dados.filter((p: any) => p.medicoId === usuario.id);
          } else {
            this.pacientes = [];
          }
        } else {
          // Se for secretaria, mostrar todos os pacientes
          this.pacientes = dados;
        }
        this.carregando = false;
      },
      error: (erro: any) => { // <-- Adicionado :any
        console.error('Erro ao buscar pacientes', erro);
        this.carregando = false;
      }
    });
  }

  remover(id: string) {
    if (confirm('Tem a certeza que deseja eliminar este paciente?')) {
      this.pacienteService.excluir(id).subscribe({
        next: () => {
          alert('Paciente removido com sucesso!');
          this.carregarPacientes();
        },
        error: (erro: any) => { // <-- Adicionado :any
          alert('Erro ao remover paciente.');
          console.error(erro);
        }
      });
    }
  }
}
