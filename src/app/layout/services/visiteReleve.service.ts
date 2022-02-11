import { Injectable } from '@angular/core';
import { VisiteReleve } from './visiteReleve';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VisiteReleveService {
  private baseUrl = globals.apiBaseUrl + 'visiteReleve';

  constructor(private http: HttpClient) {}
  createVisiteReleve(visiteReleve: VisiteReleve): Observable<VisiteReleve> {
    return this.http.post<VisiteReleve>(`${this.baseUrl}`, visiteReleve);
  }
  updateVisiteReleve(visiteReleve: VisiteReleve): Observable<any> {
    return this.http.put<VisiteReleve>(
      `${this.baseUrl}/${visiteReleve.id}`,
      visiteReleve
    );
  }
  deleteVisiteReleve(visiteReleve: VisiteReleve) {
    return this.http.delete<VisiteReleve>(`${this.baseUrl}/${visiteReleve.id}`);
  }
  deleteVisiteReleveByCode(numVisite: string): Observable<{}> {
    return this.http.delete<VisiteReleve>(`${this.baseUrl}/${numVisite}`);
  }
  getVisiteReleveByNumVisite(numVisite: string): Observable<VisiteReleve[]> {
    return this.http.get<VisiteReleve[]>(
      `${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`
    );
  }
  getVisitesRelevesByCodeClt(codeClt: string): Observable<VisiteReleve[]> {
    return this.http.get<VisiteReleve[]>(
      `${this.baseUrl}/search/getVisitesRelevesByCodeClt?codeClt=${codeClt}`
    );
  }
  createVisiteRelevesMultiple(codeClt: string) {
    return this.http.get(
      `${this.baseUrl}/search/createVisiteRelevesMultiple?codeClt=${codeClt}`
    );
  }
}
