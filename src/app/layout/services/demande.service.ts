import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Demande } from './demande';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DemandeService {
    private baseUrl = globals.apiBaseUrl + 'demandes';

  constructor(private http: HttpClient) { }


updateFusion(code1: string, code2: string) {
  const params = new HttpParams()
  .set('code1', code2).set('code2', code1);
  return this.http.get(
    `${this.baseUrl}/search/updateFusion`, {params}
  );
}


createDemande(demande: Demande): Observable<Demande> {
  return this.http.post<Demande>(`${this.baseUrl}`, demande);
}
existsByCombine(combine: String) {
  return this.http.get(`${this.baseUrl}/search/existsByCombine?combine=${combine}`);
}
findByCombine(combine: String) {
  return this.http.get(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
}
removeByCombine(combine: String) {
  return this.http.get(`${this.baseUrl}/search/removeByCombine?combine=${combine}`);
}
RechercheProformat(codefrs: string, combine: string, from: string , to: string) {
  return this.http.get(`${this.baseUrl}/search/rechercheProformat?codefrs=${codefrs}&combine=${combine}&from=${from}&to=${to}`);
}

}
