import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EtatTva } from './etat-tva';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtatTvaService {
  private baseUrl =  globals.apiBaseUrl + 'etatTva';
  constructor(private http: HttpClient) {}

  getEtatTva1(dateDebut: string, dateFin: string) {
    return this.http.get<EtatTva[]>(`${this.baseUrl}/search/getEtatTva1?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
  getEtatTva2(dateDebut: string, dateFin: string) {
    return this.http.get<EtatTva[]>(`${this.baseUrl}/search/getEtatTva2?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
  getEtatTva3(dateDebut: string, dateFin: string) {
    return this.http.get<EtatTva[]>(`${this.baseUrl}/search/getEtatTva3?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
  getEtatTva4(dateDebut: string, dateFin: string) {
    return this.http.get<EtatTva[]>(`${this.baseUrl}/search/getEtatTva4?dateDebut=${dateDebut}&dateFin=${dateFin}`);
  }
  majTranspFactures(dateDebut: string, dateFin: string) {
    return this.http.get(`${this.baseUrl}/search/majTranspFactures?dateDebut=${dateDebut}&dateFin=${dateFin}`);      
  }
  getArticlesExonores(dateDebut: string, dateFin: string) {
    return this.http.get(`${this.baseUrl}/search/getArticlesExonores?dateDebut=${dateDebut}&dateFin=${dateFin}`);      
  }
}