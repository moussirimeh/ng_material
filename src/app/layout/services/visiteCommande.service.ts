import { Injectable } from '@angular/core';
import { VisiteCommande } from './visiteCommande';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisiteCommandeService {
  private baseUrl = globals.apiBaseUrl + 'visiteCommande';

  constructor(private http: HttpClient) {}
  createVisiteCommande(visiteCommande: VisiteCommande): Observable<VisiteCommande> {
    return this.http.post<VisiteCommande>(`${this.baseUrl}`, visiteCommande);
  }
  updateVisiteCommande(visiteCommande: VisiteCommande): Observable<any> {
    return this.http.put<VisiteCommande>(`${this.baseUrl}/${visiteCommande.id}`, visiteCommande);
  }
  deleteVisiteCommande(visiteCommande: VisiteCommande) {
    return this.http.delete<VisiteCommande>(`${this.baseUrl}/${visiteCommande.id}`);
  }
  getVisiteCommandeByNumVisite(numVisite: string): Observable<VisiteCommande[]> {
    return this.http.get<VisiteCommande[]>(`${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`);
  }
  getVisitesCommandesByCodeClt(codeClt: string): Observable<VisiteCommande[]> {
    return this.http.get<VisiteCommande[]>(`${this.baseUrl}/search/getVisitesCommandesByCodeClt?codeClt=${codeClt}`);
  }
  deleteVisiteCommandeByCode(numVisite: string): Observable<{}> {
    return this.http.delete<VisiteCommande[]>(`${this.baseUrl}/${numVisite}`);
  }
  createVisiteCommandesMultiple(codeClt: string) {
    return this.http.get(
      `${this.baseUrl}/search/createVisitesCommandesMultiple?codeClt=${codeClt}`
    );
  }
}
