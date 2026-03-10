import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MedicoService } from '../../services/medico.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-medico-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medico-list.html'
})
export class MedicoListComponent implements OnInit {

  medicos: any[] = [];
  carregando: boolean = true;

  constructor(
    private medicoService: MedicoService,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Médicos', url: '/medicos' }
    ]);
    this.carregarMedicos();
  }

  carregarMedicos() {
    this.carregando = true;
    this.medicoService.listar().subscribe({
      next: (dados: any) => {
        this.medicos = dados;
        this.carregando = false;
      },
      error: (erro: any) => {
        console.error('Erro ao buscar médicos', erro);
        this.carregando = false;
      }
    });
  }

  remover(id: string) {
    if (confirm('Tem a certeza que deseja eliminar este médico do sistema?')) {
      this.medicoService.excluir(id).subscribe({
        next: () => {
          alert('Médico removido com sucesso!');
          this.carregarMedicos();
        },
        error: (erro: any) => {
          alert('Erro ao remover médico.');
          console.error(erro);
        }
      });
    }
  }
}
