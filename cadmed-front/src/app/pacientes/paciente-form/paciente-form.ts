import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- NOVO: Para o *ngIf funcionar
import { FormsModule } from '@angular/forms';   // <-- NOVO: Para o ngModel funcionar
import { PacienteService } from '../../services/paciente.service';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { AuthService } from '../../services/auth.service';
import { DadosCadastroPaciente } from '../../models/paciente';

@Component({
  selector: 'app-paciente-form',
  standalone: true, // <-- NOVO: Diz ao Angular que este componente é independente
  imports: [CommonModule, FormsModule], // <-- NOVO: Injeta as ferramentas no HTML
  templateUrl: './paciente-form.html',
  styleUrls: ['./paciente-form.css']
})
export class PacienteFormComponent implements OnInit {

  paciente: DadosCadastroPaciente = {
    nome: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    email: '',
    senha: ''
  };

  mensagem: string = '';

  constructor(
    private pacienteService: PacienteService,
    private router: Router,
    private breadcrumbService: BreadcrumbService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.breadcrumbService.set([
      { label: 'Dashboard', url: '/dashboard' },
      { label: 'Pacientes', url: '/pacientes' },
      { label: 'Novo Paciente', url: '/pacientes/novo' }
    ]);
  }

  cadastrar() {
    this.pacienteService.cadastrar(this.paciente).subscribe({
      next: (resposta: any) => {
        alert('Conta de Paciente criada com sucesso!');
        this.mensagem = 'Registo concluído!';
        this.router.navigate(['/']);
      },
      error: (erro: any) => {
        console.error(erro);
        alert('Erro ao registar: ' + (erro.error || 'Verifique os dados.'));
      }
    });
  }
}
