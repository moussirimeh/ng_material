import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DDemandeDevis } from './dDemandeDevis';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DDemandeDevisService {
  private baseUrl = globals.apiBaseUrl + 'dDemandeDevis';

  constructor(private http: HttpClient) { }

  getDDDevisByNumero(numero: string): Observable<DDemandeDevis> {
    return this.http.get<DDemandeDevis>(`${this.baseUrl}/search/findDDDevisByNumero?numero=${numero}`);
  }
  createDDemandeDevis(dDemandeDevis: DDemandeDevis): Observable<DDemandeDevis> {
    return this.http.post<DDemandeDevis>(`${this.baseUrl}`, dDemandeDevis);
  }
  detailDemandeDevis( numero: string): Observable<DDemandeDevis> {


    return this.http.get<DDemandeDevis>(`${this.baseUrl}/search/findByNumero?numero=${numero}`);
}
}
