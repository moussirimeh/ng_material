import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terme } from './terme';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TermeService {
  private baseUrl = globals.apiBaseUrl + 'termes';
  constructor(private http: HttpClient) {}
  getTermeByCombine(combine: string): Observable<Terme> {
    return this.http.get<Terme>(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
  }

  getTermes(): Observable<Terme[]> {
    return this.http.get<Terme[]>(`${this.baseUrl}/search/findAll`);
  }

  createTerme(terme: Terme): Observable<Terme> {
    return this.http.post<Terme>(`${this.baseUrl}`, terme);
  }

  updateTerme(terme: Terme): Observable<any> {
    return this.http.put<Terme>(`${this.baseUrl}/${terme.id}`, terme);
  }

  deleteTerme(terme: Terme) {
    return this.http.delete<Terme>(`${this.baseUrl}/${terme.id}`);
  }
  deleteTermeByCombine(combine: string) {
    return this.http.get(`${this.baseUrl}/search/deleteByCombine?combine=${combine}`);
  }
  findFactureByBL(bl: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/findFactureByBL?bl=${bl}`);
  }
  getTermeByCommande(commande: string): Observable<Terme> {
    return this.http.get<Terme>(`${this.baseUrl}/search/findByCommande?commande=${commande}`);
  }
}
