import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TransferfactComptabilite } from './transferfact-comptabilite';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransfCptService {
  private baseUrl = globals.apiBaseUrl + 'transfcpt';

  constructor(private http: HttpClient) { }

  deleteTransfCpt() {
    return this.http.get(`${this.baseUrl}/search/deleteTransfCpt`);
  }

   InsertTransfCpt(transferfactComptabilite: TransferfactComptabilite): Observable<TransferfactComptabilite> {
    return this.http.post<TransferfactComptabilite>(`${this.baseUrl}`, transferfactComptabilite);
  }
}
