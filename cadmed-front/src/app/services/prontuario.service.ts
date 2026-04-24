import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProntuarioService {
  private apiUrl = environment.apiUrl + '/api/prontuarios';

  constructor(private http: HttpClient) { }

  registrar(dados: any): Observable<any> {
    return this.http.post(this.apiUrl, dados);
  }
}
