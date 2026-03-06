import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API = `${environment.apiUrl}/auth`;

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
