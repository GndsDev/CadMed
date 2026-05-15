import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = environment.apiUrl + '/api/pagamentos';

  constructor(private http: HttpClient) {}

  registrar(dados: any) {
    return this.http.post(this.apiUrl, dados);
  }
}
