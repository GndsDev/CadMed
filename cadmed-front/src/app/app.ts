import { Component, OnInit, signal } from '@angular/core';
import { CadastroService } from './services/cadastro.service';
import { Cadastro } from './models/cadastro';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  // 1. Transformamos o estado em Signals! O Angular agora "vê" qualquer mudança aqui na hora.
  cadastros = signal<Cadastro[]>([]);
  enviando = signal<boolean>(false);

  formCadastro: Cadastro = this.novoObjeto();

  constructor(private service: CadastroService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.service.listar().subscribe({
      // Usamos .set() para atualizar o valor do Signal
      next: (res) => this.cadastros.set(res),
      error: (err) => console.error('Erro ao carregar lista:', err)
    });
  }

  submit() {
    // Para ler o valor de um Signal, usamos os parênteses ()
    if (this.enviando() || !this.formCadastro.nome || !this.formCadastro.descricao) {
      return;
    }

    this.enviando.set(true); // O Angular bloqueia o botão IMEDIATAMENTE

    const request = this.formCadastro.id
      ? this.service.atualizar(this.formCadastro.id, this.formCadastro)
      : this.service.salvar(this.formCadastro);

    request.subscribe({
      next: () => this.finalizarAcao(),
      error: (err) => {
        console.error('Erro no servidor:', err);
        this.finalizarAcao();
      }
    });
  }

  finalizarAcao() {
    setTimeout(() => {
      this.limpar();
    }, 500);
  }

  editar(item: Cadastro) {
    this.formCadastro = { ...item };
  }

  remover(id: number) {
    if(confirm("Tens a certeza que desejas eliminar este paciente?")) {
      this.service.excluir(id).subscribe({
        next: () => this.carregarDados(),
        error: (err) => console.error('Erro ao eliminar:', err)
      });
    }
  }

  limpar() {
    this.formCadastro = this.novoObjeto();
    this.enviando.set(false); // O botão desbloqueia sem precisarmos de forçar o Angular!
    this.carregarDados();
  }

  formatarData(data: any): string {
    if (!data) return 'Recente';
    if (Array.isArray(data) && data.length >= 3) {
      return `${data[2].toString().padStart(2, '0')}/${data[1].toString().padStart(2, '0')}/${data[0]}`;
    }
    const d = new Date(data);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-PT');
    }
    return String(data);
  }

  private novoObjeto(): Cadastro {
    return { nome: '', descricao: '', idade: '', sexo: '' };
  }
}
