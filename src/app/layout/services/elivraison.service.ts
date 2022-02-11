import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Elivraison} from './elivraison';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ElivraisonService {
  private baseUrl = globals.apiBaseUrl + 'elivraisons';
  constructor(private http: HttpClient) { }
  getElivraisonsList(): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/findByOrderById`);
   }
   getTop100ElivraisonsListByNumero(numero: string): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/findTop100ByNumeroStartsWith?numero=${numero}`);
  }
  getTop10ElivraisonsListByNumero(numero: string): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/findTop10ByNumeroStartsWith?numero=${numero}`);
  }
  getTop50ElivraisonsListByNumero(numero: string): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/findTop50ByNumeroStartsWith?numero=${numero}`);
  }
  getBSFermes(): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/getBSFermes`);
   }
   // rapport Bon des Sortie
   rapportBS(dt1: string, dt2: string): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/rapportBS?d1=${dt1}&d2=${dt2}`);
   }
   getBSOuverts(): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/getBSOuverts`);
   }
   getMaxId(): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/DerId`);
   }

   getLenghthAttribut(): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/lenghtAttribut`);
   }



   createElivraison(elivraison: Elivraison): Observable<Elivraison> {
    return this.http.post<Elivraison>(`${this.baseUrl}`, elivraison);
  }
  getElivraisonByNumero(numero: string): Observable<Elivraison[]> {
    return this.http.get<Elivraison[]>(`${this.baseUrl}/search/findByNumero?numero=${numero}`);
   }

   updateElivraison(elivraison: Elivraison): Observable<Elivraison> {
    return this.http.put<Elivraison>(`${this.baseUrl}/${elivraison.id}`, elivraison);
  }
  deleteElivraison(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
