import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  formLogin = { email: '', senha: '' };
  enviando = false;
  mensagemErro = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  fazerLogin() {
    this.enviando = true;
    this.mensagemErro = '';

    this.authService.login(this.formLogin).subscribe({
      // 1. Adicionamos a variável (resposta) para capturar o que o Java envia
      next: (resposta: any) => {
        this.enviando = false;

        // 2. Extraímos o token e guardamos no navegador
        // (Verifica se o Java mandou um JSON com a propriedade .token ou a string pura)
        const token = resposta.token ? resposta.token : resposta;
        this.authService.salvarToken(token);

        // 3. Agora vamos para o Dashboard em vez de ir direto para a Agenda
        this.router.navigate(['/dashboard']);
      },
      error: (erro: any) => {
        this.enviando = false;
        this.mensagemErro = 'E-mail ou senha incorretos!';
        console.error('Erro no login:', erro);
      }
    });
  }
}
