import { Cadastro } from './cadastro';

export interface Agendamento {
  id?: string; // Agora é uma string porque estamos usando UUID!
  dataHora: string;
  status?: string;
  observacoes: string;
  paciente?: Cadastro; // Quando o Java devolver a lista, ele traz os dados do paciente junto
}
