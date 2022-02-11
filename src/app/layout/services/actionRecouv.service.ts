import { Injectable } from '@angular/core';
import { ActionRecouv } from './actionRecouv';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActionRecouvService {
  private baseUrl = globals.apiBaseUrl + 'actionRecouv';

  constructor(private http: HttpClient) {}
  createActionRecouv(actionRecouv: ActionRecouv): Observable<ActionRecouv> {
    return this.http.post<ActionRecouv>(`${this.baseUrl}`, actionRecouv);
  }
  getActionRecouvList(effectueePar: String) {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findTop100ByeffectueeParStartsWith?effectueePar=${effectueePar}`);
  }
  rechercheActionRecv( codeclt: string, effectpar: string, from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/rechercheActionRecouvEff?codeclt=${codeclt}&effectpar=${effectpar}&from=${from}&to=${to}`);
  }
  updateActionRecouv(actionRecouv: ActionRecouv): Observable<any> {
    return this.http.put<ActionRecouv>(`${this.baseUrl}/${actionRecouv.numAction}`, actionRecouv);
  }
  deleteActionRecouv(actionRecouv: ActionRecouv) {
    return this.http.delete<ActionRecouv>(`${this.baseUrl}/${actionRecouv.numAction}`);
  }
  getActionRecouvByNumAction(numAction: string): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findByNumAction?numAction=${numAction}`);
  }
  getActionRecouvByNumVisite(numVisite: string): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`);
  }
  getActionRecouvByCodeClt(codeClt: string): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findByCodeClt?codeClt=${codeClt}`);
  }
  getNumMission(codeClt: string) {
    return this.http.get(`${this.baseUrl}/search/getNumMission?codeClt=${codeClt}`);
  }

  getActRecouvList(): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findByOrderByNumAction`);
   }
   getActRecouv(): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findAll`);
  }
   getNumActRecouv(): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/NumActionn`);
   }

  getRelevesForAffect(codeClt: string) {
    return this.http.get(`${this.baseUrl}/search/getRelevesForAffect?codeClt=${codeClt}`);
  }
  getActionRecouvByNumMission(numMission: string): Observable<ActionRecouv[]> {
    return this.http.get<ActionRecouv[]>(`${this.baseUrl}/search/findByNumMissionOrderByDate?numMission=${numMission}`);
  }
}
