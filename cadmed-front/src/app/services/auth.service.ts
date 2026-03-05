import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  login(dados: any): Observable<any> {
    return this.http.post<any>(`${this.API}/login`, dados).pipe(
      tap(resposta => {
        // Se o Java devolver o token, nós o salvamos no navegador
        if (resposta && resposta.token) {
          localStorage.setItem('token', resposta.token);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  obterToken(): string | null {
    return localStorage.getItem('token');
  }

  estaLogado(): boolean {
    return this.obterToken() !== null;
  }
}
