import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cadastro } from '../models/cadastro';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  private readonly API = 'http://172.16.11.167:8080/cadastros';

  constructor(private http: HttpClient) { }

  listar(): Observable<Cadastro[]> {
    return this.http.get<Cadastro[]>(this.API);
  }

  salvar(item: Cadastro): Observable<Cadastro> {
    return this.http.post<Cadastro>(this.API, item);
  }

  atualizar(id: number, item: Cadastro): Observable<Cadastro> {
    return this.http.put<Cadastro>(`${this.API}/${id}`, item);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
