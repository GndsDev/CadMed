import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgendamentoService {
  private apiUrl = environment.apiUrl + '/api/agendamentos';

  constructor(private http: HttpClient) { }

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  agendar(dados: any): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }

  // NOVO: Para o Médico poder mudar o status!
  atualizarStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  // NOVO: Para a Secretária poder cancelar!
  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
