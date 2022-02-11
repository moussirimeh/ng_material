import { Injectable } from '@angular/core';
import { HistCreance } from './histCreance';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistCreanceService {
  private baseUrl = globals.apiBaseUrl + 'histCreances';

  constructor(private http: HttpClient) {}

  soldeCreanceDebut() {
    return this.http.get(`${this.baseUrl}/search/soldeCreanceDebut`);
  }
  soldeCreanceFin() {
    return this.http.get(`${this.baseUrl}/search/soldeCreanceFin`);
  }
  getHistoriqueActuelle() {
    return this.http.get(`${this.baseUrl}/search/getHistoriqueActuelle`);
  }

  getHistoriqueancienne(D1: string, D2: string) {
    return this.http.get(`${this.baseUrl}/search/getHistoriqueancienne?D1=${D1}&D2=${D2}`);
  }

}
