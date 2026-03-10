import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DadosCadastroPaciente } from '../models/paciente';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  private apiUrl = environment.apiUrl + '/api/pacientes';

  constructor(private http: HttpClient) { }

  cadastrar(paciente: DadosCadastroPaciente): Observable<any> {
    return this.http.post(this.apiUrl, paciente, { responseType: 'text' });
  }

  // O Angular não estava a achar isto:
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Nem isto:
  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
