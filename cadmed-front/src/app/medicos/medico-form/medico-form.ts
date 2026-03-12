import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; // 1. ActivatedRoute adicionado
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { DadosCadastroMedico } from '../../models/medico';

@Component({
  selector: 'app-medico-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medico-form.html',
  styleUrls: ['./medico-form.css']
})
export class MedicoFormComponent implements OnInit {

  medico: DadosCadastroMedico = {
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: '',
    senha: ''
  };

  mensagem: string = '';
  isEdicao: boolean = false; // Bandeira para sabermos em que modo estamos
  medicoId: string | null = null;

  constructor(
    private medicoService: MedicoService,
    private router: Router,
    private route: ActivatedRoute, // 2. Injetado aqui para ler a URL
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    // 3. O Angular olha para a URL para ver se tem um ID
    this.medicoId = this.route.snapshot.paramMap.get('id');

    if (this.medicoId) {
      // MODO EDIÇÃO
      this.isEdicao = true;
      this.configurarBreadcrumb('Editar Médico');
      this.carregarMedico(this.medicoId);
    } else {
      // MODO CADASTRO NOVO
      this.isEdicao = false;
      this.configurarBreadcrumb('Novo Médico');
    }
  }

  // Organiza o topo da página consoante o modo
  configurarBreadcrumb(acao: string) {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Médicos', url: '/medicos' },
      { label: acao, url: this.isEdicao ? `/medicos/editar/${this.medicoId}` : '/medicos/novo' }
    ]);
  }

  // Vai ao Java buscar os dados para preencher o formulário
  carregarMedico(id: string) {
    this.medicoService.buscarPorId(id).subscribe({
      next: (dados: any) => {
        this.medico.nome = dados.nome;
        this.medico.crm = dados.crm;
        this.medico.especialidade = dados.especialidade;
        this.medico.telefone = dados.telefone;
        // Pega o email na raiz ou dentro do usuário, se aplicável
        this.medico.email = dados.email || (dados.usuario ? dados.usuario.email : '');
      },
      error: (erro: any) => {
        console.error('Erro ao carregar médico', erro);
        alert('Erro ao carregar os dados. O médico pode ter sido apagado.');
        this.router.navigate(['/medicos']);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/medicos']);
  }

  // O botão principal do HTML agora chama este método
  salvar() {
    if (this.isEdicao && this.medicoId) {

      // FLUXO DE ATUALIZAÇÃO (PUT)
      this.medicoService.atualizar(this.medicoId, this.medico).subscribe({
        next: () => {
          alert('Médico atualizado com sucesso!');
          this.router.navigate(['/medicos']);
        },
        error: (erro: any) => {
          console.error(erro);
          alert('Erro ao atualizar médico.');
        }
      });

    } else {

      // FLUXO DE CADASTRO NOVO (POST)
      this.medico.senha = 'cadmed123';
      this.medicoService.cadastrar(this.medico).subscribe({
        next: () => {
          alert(`Médico registado com sucesso!\n\nPor favor, informe ao médico que a palavra-passe de acesso dele é: ${this.medico.senha}`);
          this.router.navigate(['/medicos']);
        },
        error: (erro: any) => {
          console.error(erro);
          alert('Erro ao registar: ' + (erro.error || 'Verifique os dados.'));
        }
      });

    }
  }
}
