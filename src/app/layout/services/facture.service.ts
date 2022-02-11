import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Facture } from './facture';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FactureService {
  private baseUrl = globals.apiBaseUrl + 'factures';
  constructor(private http: HttpClient) {}
  getFactureByNumero(numero: string): Observable<Facture> {
    return this.http.get<Facture>(`${this.baseUrl}/search/findByNumero?numero=${numero}`);
  }

  getFactures(): Observable<Facture[]> {
    return this.http.get<Facture[]>(`${this.baseUrl}/search/findAll`);
  }

  createFacture(facture: Facture): Observable<Facture> {
    return this.http.post<Facture>(`${this.baseUrl}`, facture);
  }

  updateFacture(facture: Facture): Observable<any> {
    return this.http.put<Facture>(`${this.baseUrl}/${facture.id}`, facture);
  }

  deleteFacture(facture: Facture) {
    return this.http.delete<Facture>(`${this.baseUrl}/${facture.id}`);
  }
  rechercheAvoirsTerme(from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/rechercheAvoirTerme?from=${from}&to=${to}`);
  }
  listeVentesSuspensionTva (datedeb: string , datefin: string) {
    return this.http.get(`${this.baseUrl}/search/listeVentesSuspensionTva?datedeb=${datedeb}&datefin=${datefin}`);
  }
  getFactureinDate(datedeb: string , datefin: string) {
    return this.http.get(`${this.baseUrl}/search/getFactureinDate?datedeb=${datedeb}&datefin=${datefin}`);
  }
  updateTrspAndTaxepmFacture(datedeb: string , datefin: string) {
    return this.http.get(`${this.baseUrl}/search/updateTrspAndTaxepmFacture?datedeb=${datedeb}&datefin=${datefin}`);
  }
}
