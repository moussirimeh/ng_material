import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtatFacture } from './etat-facture';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtatFactureService {
  private baseUrl =  globals.apiBaseUrl + 'etatFacture';
  constructor(private http: HttpClient) {}

  getEtatFacture(dateDebut: string, dateFin: string) {
    return this.http.get<EtatFacture[]>(`${this.baseUrl}/search/getEtatFacture?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
}
