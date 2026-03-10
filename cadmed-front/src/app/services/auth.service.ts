import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { DadosAutenticacao, DadosTokenJWT, Usuario, UserRole } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl + '/auth';
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarUsuarioDoStorage();
  }

  login(dados: DadosAutenticacao): Observable<DadosTokenJWT> {
    return this.http.post<DadosTokenJWT>(`${this.apiUrl}/login`, dados).pipe(
      tap(resposta => {
        localStorage.setItem('token', resposta.token);
        if (resposta.usuario) {
          localStorage.setItem('usuario', JSON.stringify(resposta.usuario));
          this.usuarioSubject.next(resposta.usuario);
        }
      })
    );
  }

  salvarToken(token: string) {
    localStorage.setItem('token', token);
    this.carregarUsuarioDoStorage();
  }

  sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAutenticado(): boolean {
    return this.getToken() !== null;
  }

  getUsuario(): Usuario | null {
    return this.usuarioSubject.value;
  }

  getRole(): UserRole | null {
    const usuario = this.getUsuario();
    return usuario ? usuario.role : null;
  }

  isMedico(): boolean {
    return this.getRole() === UserRole.MEDICO;
  }

  isSecretaria(): boolean {
    return this.getRole() === UserRole.SECRETARIA;
  }

  obterUsuarioAtual(): Usuario | null {
    return this.getUsuario();
  }

  private carregarUsuarioDoStorage() {
    const usuarioJson = localStorage.getItem('usuario');
    if (usuarioJson) {
      try {
        const usuario = JSON.parse(usuarioJson);
        this.usuarioSubject.next(usuario);
      } catch (erro) {
        console.error('Erro ao carregar usuário:', erro);
        this.usuarioSubject.next(null);
      }
    }
  }
}
