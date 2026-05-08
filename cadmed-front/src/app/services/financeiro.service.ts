import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from "./auth.service"; // Ajuste o caminho se necessário
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private apiUrl = 'http://localhost:8080/api/financeiro';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Função auxiliar para injetar o Token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Busca os dados do gráfico
  obterDadosGrafico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grafico`, { headers: this.getHeaders() });
  }

  // Busca a tabela de histórico
  obterHistorico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historico`, { headers: this.getHeaders() });
  }
}
