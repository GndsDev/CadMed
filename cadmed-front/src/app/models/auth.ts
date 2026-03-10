export enum UserRole {
  MEDICO = 'MEDICO',
  SECRETARIA = 'SECRETARIA'
}

export interface DadosAutenticacao {
  email: string;
  senha?: string;
}

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
}

export interface DadosTokenJWT {
  token: string;
  usuario?: Usuario;
}
