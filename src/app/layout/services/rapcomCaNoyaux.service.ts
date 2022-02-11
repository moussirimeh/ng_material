import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RapcomCaNoyaux } from './rapcomCaNoyaux';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapcomCaNoyauxService {
  private baseUrl = globals.apiBaseUrl + 'rapcomCaNoyaux';
  constructor(private http: HttpClient) {}
  createRapcomCaNoyaux(rapcomCaNoyaux: RapcomCaNoyaux): Observable<RapcomCaNoyaux> {
    return this.http.post<RapcomCaNoyaux>(`${this.baseUrl}`, rapcomCaNoyaux);
  }
  deleteRapcomCaNoyaux(rapcomCaNoyaux: RapcomCaNoyaux): Observable<RapcomCaNoyaux> {
    return this.http.delete<RapcomCaNoyaux>(`${this.baseUrl}/${rapcomCaNoyaux.id}`);
  }
  getRapcomCaNoyaux(numRapport: string): Observable<RapcomCaNoyaux[]> {
    return this.http.get<RapcomCaNoyaux[]>(`${this.baseUrl}/search/getRapComNoyaux?numRapport=${numRapport}`);
  }
  deleteByNumRapport(numRapport: string){
    return this.http.get(`${this.baseUrl}/search/deleteByNumRapport?numRapport=${numRapport}`)
  }
}
