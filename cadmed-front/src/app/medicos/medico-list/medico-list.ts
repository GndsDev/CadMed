import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Adicionado aqui
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
    public authService: AuthService,
    private cdr: ChangeDetectorRef // 2. Injetado aqui
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
        if (Array.isArray(dados)) {
          this.medicos = dados;
        } else if (dados && dados.content) {
          this.medicos = dados.content;
        } else if (dados) {
          this.medicos = [dados];
        } else {
          this.medicos = [];
        }

        this.carregando = false;
        this.cdr.detectChanges(); // 3. A MÁGICA: Força o HTML a desenhar a tabela agora!
      },
      error: (erro: any) => {
        console.error('Erro ao buscar médicos', erro);
        this.carregando = false;
        this.cdr.detectChanges(); // Garante que a tela atualiza mesmo com erro
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
