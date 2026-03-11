import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    senha: '' // Fica vazio no início
  };

  mensagem: string = '';

  constructor(
    private medicoService: MedicoService,
    private router: Router,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Médicos', url: '/medicos' },
      { label: 'Novo Médico', url: '/medicos/novo' }
    ]);
  }

  cadastrar() {
    // 1. O sistema gera a palavra-passe padrão antes de enviar
    this.medico.senha = 'cadmed123';

    this.medicoService.cadastrar(this.medico).subscribe({
      next: (resposta: any) => {
        // 2. Avisa a secretária de qual é a senha gerada
        alert(`Médico registado com sucesso!\n\nPor favor, informe ao médico que a palavra-passe de acesso dele é: ${this.medico.senha}`);
        this.mensagem = 'Registo concluído!';

        // 3. Já redireciona diretamente para a lista de médicos
        this.router.navigate(['/medicos']);
      },
      error: (erro: any) => {
        console.error(erro);
        alert('Erro ao registar: ' + (erro.error || 'Verifique os dados.'));
      }
    });
  }
}
