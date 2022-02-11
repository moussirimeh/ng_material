import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DLivraison} from './Dlivraison';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DLivraisonService {
  private baseUrl = globals.apiBaseUrl + 'dlivraisons';
  constructor(private http: HttpClient) { }

  // supprimer delevraison paar Numero
  deleteDelivraisonByNumero(numero: string): Observable<any> {
    return this.http.get<string>(`${this.baseUrl}/search/deleteByNumeroBS?numero=${numero}`);
  }
  // recuperer la liste des delivraison selon numero du bon de sortie
  listDelivraisonByNumero(numero: string): Observable<DLivraison[]> {
    return this.http.get<DLivraison[]>(`${this.baseUrl}/search/findByNumero?numero=${numero}`);
  }
  // supprimer un delivraison par id
  deleteDelivraison(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
  // supprimer la liste des delivraisons par id
  supprimerListeDelivraison(liste: DLivraison[] ) {
    let dl: any;
    for (dl of liste) {
      this.deleteDelivraison(dl.id);
    }
  }

  createDlivraison(dLivraison: DLivraison): Observable<DLivraison> {
      return this.http.post<DLivraison>(`${this.baseUrl}`, dLivraison);
    }

    // recuperer un delivraison selon combine
 getDelivraisonByCombine(combine: string): Observable<DLivraison> {
    return this.http.get<DLivraison>(`${this.baseUrl}/search/findByCombine?numero=${combine}`);
  }


}



