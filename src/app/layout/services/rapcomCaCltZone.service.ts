import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RapcomCaCltZone } from './rapcomCaCltZone';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapcomCaCltZoneService {
  private baseUrl = globals.apiBaseUrl + 'rapcomCaCltZone';
  constructor(private http: HttpClient) {}
  createRapcomCaCltZone(rapcomCaCltZone: RapcomCaCltZone): Observable<RapcomCaCltZone> {
    return this.http.post<RapcomCaCltZone>(`${this.baseUrl}`, rapcomCaCltZone);
  }
  deleteRapcomCaCltZone(rapcomCaCltZone: RapcomCaCltZone): Observable<RapcomCaCltZone> {
    return this.http.delete<RapcomCaCltZone>(`${this.baseUrl}/${rapcomCaCltZone.id}`);
  }
  getRapcomCaCltZone(numRapport: string): Observable<RapcomCaCltZone[]> {
    return this.http.get<RapcomCaCltZone[]>(`${this.baseUrl}/search/getRapComZone?numRapport=${numRapport}`);
  }
  deleteByNumRapport(numRapport: string){
    return this.http.get(`${this.baseUrl}/search/deleteByNumRapport?numRapport=${numRapport}`)
  }
}
