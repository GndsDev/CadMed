import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = environment.apiUrl + '/api/pagamentos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  registrar(dados: any) {
    const token = this.authService.getToken();

    // Anexando o Token JWT na requisição
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, dados, { headers });
  }
}
