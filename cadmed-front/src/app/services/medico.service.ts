import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DadosCadastroMedico } from '../models/medico';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private apiUrl = environment.apiUrl + '/api/medicos';

  constructor(private http: HttpClient) { }

  cadastrar(medico: DadosCadastroMedico): Observable<any> {
    return this.http.post(this.apiUrl, medico, { responseType: 'text' });
  }

  // NOVO: Vai buscar todos os médicos
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // NOVO: Apaga um médico pelo ID
  excluir(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
