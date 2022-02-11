import { Injectable } from '@angular/core';
import { AnnulationFacture } from './annulationFacture';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnulationFactureService {
  private baseUrl = globals.apiBaseUrl + 'annulationFacture';

  constructor(private http: HttpClient) {}

  getNumero(numero: string, annee: string) {
    return this.http.get(`${this.baseUrl}/search/getNumero?numero=${numero}&annee=${annee}`);
  }

  getFacture(numero: string): Observable<AnnulationFacture[]> {
    return this.http.get<AnnulationFacture[]>(`${this.baseUrl}/search/getFacture?numero=${numero}`);
  }
  deleteFromBrou(numero: string, annee: string) {
    return this.http.get(`${this.baseUrl}/search/deleteFromBrou?numero=${numero}&annee=${annee}`);
  }
  deleteFromFacture(numero: string, annee: string) {
    return this.http.get(`${this.baseUrl}/search/deleteFromFacture?numero=${numero}&annee=${annee}`);
  }
  modifyRecettes(combine: string) {
    return this.http.get(`${this.baseUrl}/search/modifyRecettes?combine=${combine}`);
  }
  contientAvoirEtBl(combine: string) {
    return this.http.get(`${this.baseUrl}/search/contientAvoirEtBl?combine=${combine}`);
  }
}
