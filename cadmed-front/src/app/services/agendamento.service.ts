import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Agendamento } from '../models/agendamento';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private API = `${environment.apiUrl}/agendamentos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Agendamento[]> {
    return this.http.get<Agendamento[]>(this.API);
  }

  agendar(dados: { pacienteId: string | number; dataHora: string; observacoes: string }): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.API, dados);
  }
}
