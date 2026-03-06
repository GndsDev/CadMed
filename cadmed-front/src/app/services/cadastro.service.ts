import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from '../models/cadastro';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private readonly API = `${environment.apiUrl}/cadastros`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(this.API);
  }

  salvar(item: Cadastro): Observable<Cadastro> {
    return this.http.post<Cadastro>(this.API, item);
  }

  atualizar(id: string, item: Cadastro): Observable<Cadastro> {
    return this.http.put<Cadastro>(`${this.API}/${id}`, item);
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
