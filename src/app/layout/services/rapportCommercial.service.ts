import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RapportCommercial } from './rapportCommercial';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RapportCommercialService {
  private baseUrl = globals.apiBaseUrl + 'rapportCommercial';
  constructor(private http: HttpClient) {}

  createRapportCommercial(rapportCommercial: RapportCommercial): Observable<RapportCommercial> {
    return this.http.post<RapportCommercial>(`${this.baseUrl}`, rapportCommercial);
  }
  getRapportCommercialByCodeRepAndMois(codeRep: string, mois: string): Observable<RapportCommercial[]> {
    return this.http.get<RapportCommercial[]>(`${this.baseUrl}/search/findByCodeRepAndMois?codeRep=${codeRep}&mois=${mois}`);
  }
  getRapportCommercialByNumRapport(numRap: string): Observable<RapportCommercial[]> {
    return this.http.get<RapportCommercial[]>(`${this.baseUrl}/search/findByNumRapport?numRapport=${numRap}`);
  }
  evolutionCa(codeRep: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/evolutionsCa?codeRep=${codeRep}`);
  }
  evolutionCa1(codeRep: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/evolutionsCa1?codeRep=${codeRep}`);
  }
  getCreances(codeRep: string, dat: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getCreances?codeRep=${codeRep}&dat=${dat}`);
  }
  getZones(codeRep: string, mois: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getZones?codeRep=${codeRep}&mois=${mois}`);
  }
  getNoyaux(codeRep: string, mois: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getNoyaux?codeRep=${codeRep}&mois=${mois}`);
  }
  getMaxNumRapport() {
    return this.http.get<any[]>(`${this.baseUrl}/search/getMaxNumRapport`);
  }
  updateRapportCommercial(rapportCommercial: RapportCommercial): Observable<any> {
    return this.http.put<RapportCommercial>(`${this.baseUrl}/${rapportCommercial.id}`, rapportCommercial);
  }
}
