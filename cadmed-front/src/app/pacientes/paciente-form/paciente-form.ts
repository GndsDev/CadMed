import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-form.html',
  styleUrls: ['./paciente-form.css'] // Usa o mesmo arquivo CSS que usámos no médico!
})
export class PacienteFormComponent implements OnInit {

  // O objeto limpo que o formulário vai preencher
  paciente: any = {
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    senha: '' // Caso o paciente também tenha login no sistema
  };

  isEdicao: boolean = false;
  pacienteId: string | null = null;

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    // Lê a URL para ver se tem um ID
    this.pacienteId = this.route.snapshot.paramMap.get('id');

    if (this.pacienteId) {
      // MODO EDIÇÃO
      this.isEdicao = true;
      this.configurarBreadcrumb('Editar Paciente');
      this.carregarPaciente(this.pacienteId);
    } else {
      // MODO CADASTRO NOVO
      this.isEdicao = false;
      this.configurarBreadcrumb('Novo Paciente');
    }
  }

  configurarBreadcrumb(acao: string) {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Pacientes', url: '/pacientes' },
      { label: acao, url: this.isEdicao ? `/pacientes/editar/${this.pacienteId}` : '/pacientes/novo' }
    ]);
  }

  // Se for edição, vai ao Java buscar os dados atuais
  carregarPaciente(id: string) {
    this.pacienteService.buscarPorId(id).subscribe({
      next: (dados: any) => {
        this.paciente.nome = dados.nome;
        this.paciente.cpf = dados.cpf;
        this.paciente.telefone = dados.telefone;
        // Pega o email na raiz ou dentro do usuário (como fizemos no médico)
        this.paciente.email = dados.email || (dados.usuario ? dados.usuario.email : '');
      },
      error: (erro: any) => {
        console.error('Erro ao carregar paciente', erro);
        alert('Erro ao carregar os dados. O paciente pode ter sido apagado.');
        this.router.navigate(['/pacientes']);
      }
    });
  }

  // O botão azul do HTML chama isto
  salvar() {
    if (this.isEdicao && this.pacienteId) {

      // FLUXO DE ATUALIZAÇÃO (PUT)
      this.pacienteService.atualizar(this.pacienteId, this.paciente).subscribe({
        next: () => {
          alert('Paciente atualizado com sucesso!');
          this.router.navigate(['/pacientes']);
        },
        error: (erro: any) => {
          console.error(erro);
          alert('Erro ao atualizar paciente. Verifique se o CPF já existe.');
        }
      });

    } else {

      // FLUXO DE CADASTRO (POST)
      this.paciente.senha = 'paciente123'; // Senha padrão se o sistema criar login para eles

      this.pacienteService.cadastrar(this.paciente).subscribe({
        next: () => {
          alert(`Paciente registado com sucesso!\n\nSenha padrão de acesso: ${this.paciente.senha}`);
          this.router.navigate(['/pacientes']);
        },
        error: (erro: any) => {
          console.error(erro);
          alert('Erro ao registar: ' + (erro.error || 'Verifique os dados.'));
        }
      });

    }
  }

  // O botão cinza do HTML chama isto
  cancelar() {
    this.router.navigate(['/pacientes']);
  }
}
