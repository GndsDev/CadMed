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
    private cdr: ChangeDetectorRef // <-- Ferramenta que força a tela a atualizar
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
        const perfil = this.authService.getRole();

        if (perfil === 'SECRETARIA') {
          this.pacientes = dados;
        } else {
          this.pacientes = [];
        }

        // Tira o aviso de carregamento
        this.carregando = false;

        // MÁGICA: Obriga o HTML a desenhar a tabela com os pacientes agora mesmo!
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
    if (confirm('Tem a certeza que deseja eliminar este paciente?')) {
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
