import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devis } from './devis';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DevisService {
    private baseUrl = globals.apiBaseUrl + 'devis';

  constructor(private http: HttpClient) { }

  update(numero: string) {
    return this.http.get(`${this.baseUrl}/search/update?numero=${numero}`);
  }
  getNumero() {
    return this.http.get(`${this.baseUrl}`);
  }


}
