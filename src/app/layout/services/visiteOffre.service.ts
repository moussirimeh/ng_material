import { Injectable } from '@angular/core';
import { VisiteOffre } from './visiteOffre';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisiteOffreService {
  private baseUrl = globals.apiBaseUrl + 'visiteOffre';

  constructor(private http: HttpClient) {}
  createVisiteOffre(visiteOffre: VisiteOffre): Observable<VisiteOffre> {
    return this.http.post<VisiteOffre>(`${this.baseUrl}`, visiteOffre);
  }
  updateVisiteOffre(visiteOffre: VisiteOffre): Observable<any> {
    return this.http.put<VisiteOffre>(`${this.baseUrl}/${visiteOffre.id}`, visiteOffre);
  }
  deleteVisiteOffre(visiteOffre: VisiteOffre) {
    return this.http.delete<VisiteOffre>(`${this.baseUrl}/${visiteOffre.id}`);
  }
  deleteVisiteOffreByCode(numVisite: string): Observable<{}> {
    return this.http.delete<VisiteOffre []>(`${this.baseUrl}/${numVisite}`);
  }
  getVisiteOffreByNumVisite(numVisite: string): Observable<VisiteOffre[]> {
    return this.http.get<VisiteOffre[]>(`${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`);
  }
  getVisitesOffresByCodeClt(codeClt: string): Observable<VisiteOffre[]> {
    return this.http.get<VisiteOffre[]>(`${this.baseUrl}/search/getVisitesOffresByCodeClt?codeClt=${codeClt}`);
  }
  createVisiteOffresMultiple(codeClt: string) {
    return this.http.get(
      `${this.baseUrl}/search/createVisitesOffresMultiple?codeClt=${codeClt}`
    );
  }
}
