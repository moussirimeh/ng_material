import { Injectable } from '@angular/core';
import { VisiteVisite } from './visiteVisite';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisiteVisiteService {
  private baseUrl = globals.apiBaseUrl + 'visiteVisite';

  constructor(private http: HttpClient) {}
  createVisiteVisite(visiteVisite: VisiteVisite): Observable<VisiteVisite> {
    return this.http.post<VisiteVisite>(`${this.baseUrl}`, visiteVisite);
  }
  updateVisiteVisite(visiteVisite: VisiteVisite): Observable<any> {
    return this.http.put<VisiteVisite>(`${this.baseUrl}/${visiteVisite.id}`, visiteVisite);
  }
  deleteVisiteVisite(visiteVisite: VisiteVisite) {
    return this.http.delete<VisiteVisite>(`${this.baseUrl}/${visiteVisite.id}`);
  }
  deleteVisiteVisiteByCode(numVisite: string): Observable<{}> {
    return this.http.delete<VisiteVisite[]>(`${this.baseUrl}/${numVisite}`);
  }
  getVisiteVisiteByNumVisite(numVisite: string): Observable<VisiteVisite[]> {
    return this.http.get<VisiteVisite[]>(`${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`);
  }
  createVisiteVisitesMultiple(codeClt: string) {
    return this.http.get(
      `${this.baseUrl}/search/createVisitesVisitesMultiple?codeClt=${codeClt}`
    );
  }
}
