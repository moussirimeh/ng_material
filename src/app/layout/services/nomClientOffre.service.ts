import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NomClientOffre } from './nomClientOffre';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NomClientOffreService {
    private baseUrl = globals.apiBaseUrl + 'NomClientOffre';

  constructor(private http: HttpClient) { }
  createNomClient(nomClient: NomClientOffre): Observable<NomClientOffre> {
    return this.http.post<NomClientOffre>(`${this.baseUrl}`, nomClient);
  }
  getNomClientOffreByNumDev(numDev: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findByNumDev?numDev=${numDev} `);
  }
}
