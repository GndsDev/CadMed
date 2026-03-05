import { Component, OnInit, signal } from '@angular/core';
import { CadastroService } from './services/cadastro.service';
import { AuthService } from './services/auth.service';
import { AgendamentoService } from './services/agendamento.service'; // <-- Novo import
import { Cadastro } from './models/cadastro';
import { Agendamento } from './models/agendamento'; // <-- Novo import

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  standalone: false
})
export class AppComponent implements OnInit {

  // Controle de Telas e Estado
  estaLogado = signal<boolean>(false);
  abaAtual = signal<'pacientes' | 'agenda'>('pacientes'); // <-- Controle das abas
  enviando = signal<boolean>(false);

  // Listas de Dados
  cadastros = signal<Cadastro[]>([]);
  agendamentos = signal<Agendamento[]>([]); // <-- Lista de consultas

  // Formulários
  formLogin = { email: '', senha: '' };
  formCadastro: Cadastro = this.novoObjeto();

  // Formulário da Agenda
  formAgenda = { pacienteId: '', data: '', hora: '', observacoes: '' };

  constructor(
    private service: CadastroService,
    private authService: AuthService,
    private agendamentoService: AgendamentoService // <-- Injetando o serviço de agenda
  ) {}

  ngOnInit(): void {
    this.verificarAcesso();
  }

  // ==========================================
  // LÓGICA DE AUTENTICAÇÃO E NAVEGAÇÃO
  // ==========================================

  verificarAcesso() {
    if (this.authService.estaLogado()) {
      this.estaLogado.set(true);
      this.carregarDados();
      this.carregarAgendamentos(); // Carrega a agenda também
    } else {
      this.estaLogado.set(false);
    }
  }

  fazerLogin() {
    if (!this.formLogin.email || !this.formLogin.senha) return;
    this.enviando.set(true);
    this.authService.login(this.formLogin).subscribe({
      next: () => {
        this.enviando.set(false);
        this.verificarAcesso();
      },
      error: (err) => {
        console.error('Erro no login:', err);
        alert('E-mail ou senha incorretos! Tente novamente.');
        this.enviando.set(false);
      }
    });
  }

  sair() {
    this.authService.logout();
    this.estaLogado.set(false);
    this.cadastros.set([]);
    this.agendamentos.set([]);
    this.formLogin = { email: '', senha: '' };
    this.abaAtual.set('pacientes'); // Volta para a aba padrão
  }

  mudarAba(aba: 'pacientes' | 'agenda') {
    this.abaAtual.set(aba);
  }

  // ==========================================
  // LÓGICA DA AGENDA DE CONSULTAS
  // ==========================================

  carregarAgendamentos() {
    this.agendamentoService.listar().subscribe({
      next: (res) => this.agendamentos.set(res),
      error: (err) => console.error('Erro ao carregar agenda:', err)
    });
  }

  agendar() {
    if (!this.formAgenda.pacienteId || !this.formAgenda.data || !this.formAgenda.hora) return;
    this.enviando.set(true);

    // O Java espera a data no formato ISO 8601 (Ex: 2026-03-04T14:30:00)
    // Nós juntamos o campo de data e o campo de hora do HTML aqui:
    const dataHoraFormatada = `${this.formAgenda.data}T${this.formAgenda.hora}:00`;

    const payload = {
      pacienteId: this.formAgenda.pacienteId,
      dataHora: dataHoraFormatada,
      observacoes: this.formAgenda.observacoes
    };

    this.agendamentoService.agendar(payload).subscribe({
      next: () => {
        this.enviando.set(false);
        // Limpa o formulário após o sucesso
        this.formAgenda = { pacienteId: '', data: '', hora: '', observacoes: '' };
        this.carregarAgendamentos(); // Atualiza a tabela
        alert('Consulta agendada com sucesso!');
      },
      error: (err) => {
        console.error('Erro ao agendar:', err);
        this.enviando.set(false);
        alert('Erro ao agendar consulta. Verifique os dados.');
      }
    });
  }

  // Função especial para formatar a data e hora na tabela da agenda
  formatarDataHora(dataHora: any): string {
    if (!dataHora) return '';

    // O Spring Boot geralmente devolve LocalDateTime como um array: [Ano, Mês, Dia, Hora, Minuto]
    if (Array.isArray(dataHora)) {
      const [ano, mes, dia, hora, minuto] = dataHora;
      return `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}/${ano} às ${hora.toString().padStart(2, '0')}:${minuto?.toString().padStart(2, '0') || '00'}`;
    }

    // Fallback caso venha como String
    const d = new Date(dataHora);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return String(dataHora);
  }

  // ==========================================
  // LÓGICA DE PACIENTES (Mantida igual)
  // ==========================================

  carregarDados() {
    this.service.listar().subscribe({
      next: (res) => this.cadastros.set(res),
      error: (err) => {
        if (err.status === 403) {
          alert('Sua sessão expirou. Faça login novamente.');
          this.sair();
        }
      }
    });
  }

  submit() {
    if (this.enviando() || !this.formCadastro.nome || !this.formCadastro.descricao) return;
    this.enviando.set(true);
    const request = this.formCadastro.id
      ? this.service.atualizar(this.formCadastro.id, this.formCadastro)
      : this.service.salvar(this.formCadastro);

    request.subscribe({
      next: () => this.finalizarAcao(),
      error: (err) => { console.error('Erro:', err); this.finalizarAcao(); }
    });
  }

  finalizarAcao() {
    setTimeout(() => { this.limpar(); }, 500);
  }

  editar(item: Cadastro) { this.formCadastro = { ...item }; }

  remover(id: string) {
    if(confirm("Tem certeza que deseja eliminar este paciente?")) {
      this.service.excluir(id).subscribe({
        next: () => this.carregarDados(),
        error: (err) => console.error('Erro ao eliminar:', err)
      });
    }
  }

  limpar() {
    this.formCadastro = this.novoObjeto();
    this.enviando.set(false);
    this.carregarDados();
  }

  formatarData(data: any): string {
    if (!data) return 'Recente';
    if (Array.isArray(data) && data.length >= 3) {
      return `${data[2].toString().padStart(2, '0')}/${data[1].toString().padStart(2, '0')}/${data[0]}`;
    }
    if (typeof data === 'string' && data.includes('-')) {
      const partes = data.split('T')[0].split('-');
      if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    const d = new Date(data);
    if (!isNaN(d.getTime())) return d.toLocaleDateString('pt-BR');
    return String(data);
  }

  private novoObjeto(): Cadastro {
    return { nome: '', descricao: '', idade: '', sexo: '' };
  }
}
