import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RapportComptant } from './rapport-comptant';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapportComptantService {
  private baseUrl =  globals.apiBaseUrl + 'rapportComptant';
  constructor(private http: HttpClient) {}

  getRapportComptant(dateDebut: string) {
    return this.http.get<RapportComptant[]>(`${this.baseUrl}/search/getRapportComptant?dateDebut=${dateDebut}`);
  }
  getRapportAvoirComptant(dateDebut: string, dateFin: string) {
    return this.http.get<RapportComptant[]>(`${this.baseUrl}/search/getRapportAvoirComptant?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
  getRapportReservation(dateDebut: string, dateFin: string) {
    return this.http.get<RapportComptant[]>(`${this.baseUrl}/search/getRapportReservation?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
}
