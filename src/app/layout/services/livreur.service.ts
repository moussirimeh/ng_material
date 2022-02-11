import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Livreur} from './livreur';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LivreurService {
  private baseUrl = globals.apiBaseUrl + 'livreurs';

  constructor(private http: HttpClient) { }
  getlivreursList(): Observable<Livreur[]> {
    return this.http.get<Livreur[]>(`${this.baseUrl}/search/findByOrderById`);
   }
   getlivreurs(nom: string): Observable<Livreur> {
    return this.http.get<Livreur>(`${this.baseUrl}/search/findByNomStartsWith?nom=${nom}`);
  }

  getNomLivByCode(code: string): Observable<Livreur> {
    return this.http.get<Livreur>(`${this.baseUrl}/search/getNomLivByCode?code=${code}`);
  }
  getByCode(code: string): Observable<Livreur> {
    return this.http.get<Livreur>(`${this.baseUrl}/search/findByCode?code=${code}`);
  }
}
