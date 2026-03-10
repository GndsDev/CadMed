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

  // O objeto vazio que vai ser preenchido pelo HTML
  medico: DadosCadastroMedico = {
    nome: '',
    crm: '',
    especialidade: '',
    telefone: '',
    email: '',
    senha: ''
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
    this.medicoService.cadastrar(this.medico).subscribe({
      // Adicionado ': any' para o TypeScript parar de reclamar
      next: (resposta: any) => {
        alert('Médico registado com sucesso!');
        this.mensagem = 'Registo concluído!';
        // Redireciona para a página principal (ou lista)
        this.router.navigate(['/']);
      },
      // Adicionado ': any' aqui também
      error: (erro: any) => {
        console.error(erro);
        alert('Erro ao registar: ' + (erro.error || 'Verifique os dados.'));
      }
    });
  }
}
