import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {
  private apiUrl = environment.apiUrl + '/api/financeiro';

  constructor(private http: HttpClient) {}

  obterDadosGrafico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grafico`);
  }

  obterHistorico(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/historico`);
  }
}
