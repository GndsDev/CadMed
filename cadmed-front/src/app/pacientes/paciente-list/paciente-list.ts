import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paciente-list.html'
})
export class PacienteListComponent implements OnInit {

  pacientes: any[] = [];
  carregando: boolean = true;

  constructor(
    private pacienteService: PacienteService,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
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
      next: (dados: any) => {
        if (Array.isArray(dados)) {
          this.pacientes = dados;
        } else if (dados && dados.content) {
          this.pacientes = dados.content;
        } else if (dados) {
          this.pacientes = [dados];
        } else {
          this.pacientes = [];
        }

        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: (erro: any) => {
        console.error('Erro ao buscar pacientes', erro);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  remover(id: string) {
    if (confirm('Tem a certeza que deseja eliminar este paciente do sistema?')) {
      this.pacienteService.excluir(id).subscribe({
        next: () => {
          alert('Paciente removido com sucesso!');
          this.carregarPacientes();
        },
        error: (erro: any) => {
          alert('Erro ao remover paciente.');
          console.error(erro);
        }
      });
    }
  }
}
