import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EDemandeDevis } from './eDemandeDevis';
import { Marque } from '../services/marque';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EDemandeDevisService {
  private baseUrl = globals.apiBaseUrl + 'eDemandeDevis';

  constructor(private http: HttpClient) {}

  getEDDevisByNumero(numero: string): Observable<EDemandeDevis> {
    return this.http.get<EDemandeDevis>(
      `${this.baseUrl}/search/findEDDevisByNumero?numero=${numero}`
    );
  }
  getMarqueByCodeArticle(codeArticle: string): Observable<Marque> {
    return this.http.get<Marque>(
      `${this.baseUrl}/search/getMarqueByCodeArticle?codeArticle=${codeArticle}`
    );
  }
  getMaxNumero() {
    return this.http.get(`${this.baseUrl}/search/getMaxNumero`);
  }
  createEDemandeDevis(eDemandeDevis: EDemandeDevis): Observable<EDemandeDevis> {
    return this.http.post<EDemandeDevis>(`${this.baseUrl}`, eDemandeDevis);
  }
  etatdemandeDevis(
    codeClient: string,
    numero: string,
    article: string,
    numeroDevis: string,
    from: string,
    to: string
  ): Observable<EDemandeDevis> {
    return this.http.get<EDemandeDevis>(
      `${this.baseUrl}/search/findDemandeDevis?codeClient=${codeClient}&numero=${numero}&article=${article}&numeroDevis=${numeroDevis}&from=${from}&to=${to}`
    );
  }
  demandeDevisTraiter(
    codeClient: string,
    numero: string,
    article: string,
    from: string,
    to: string
  ): Observable<EDemandeDevis> {
    return this.http.get<EDemandeDevis>(
      `${this.baseUrl}/search/findDemandeDevisTraiter?codeClient=${codeClient}&numero=${numero}&article=${article}&from=${from}&to=${to}`
    );
  }
}
