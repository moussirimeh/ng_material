import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Achat0 } from './achat0';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class Achat0Service {
  private baseUrl = globals.apiBaseUrl + 'achat0';
  constructor(private http: HttpClient) { }
  getAchat0(): Observable<Achat0> {
    return this.http.get<Achat0>(`${this.baseUrl}`);
}
getListeBanqueOrderBYFF(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/search/listeBanqueOrderBYFF`);
}
EngagementFournisseurs(dat0: string, dat1: string, banq: string, type: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/EngagementFournisseurs?echeance0=${dat0}&echeance=${dat1}&banque=${banq}&typef=${type}`);
   }

ImpressionEngagementFournisseurs(dat0: string, dat: string, banq: string, type: string, mois: string, annee: string): Observable<any> {
    return this.http.get<any>
       (`${this.baseUrl}/search/ImpressionEngagementFournisseurs?echeance0=${dat0}&echeance=${dat}&banque=${banq}&typef=${type}&mois=${mois}&annee=${annee}`);
   }

getByOperateur(op: string): Observable<Achat0> {
    return this.http.get<Achat0>(`${this.baseUrl}/search/findByOperateur?operateur=${op}`);
}
getFactureFournisseurPeriod(op: string, datef: string, dated: string): Observable<Achat0> {
  return this.http.get<Achat0>(`${this.baseUrl}/search/ListeFactureFournisseurPeriod?operateur=${op}&datef=${datef}&dated=${dated}`);
}

createFacture(fact: Achat0): Observable<Achat0> {
  return this.http.post<Achat0>(`${this.baseUrl}`, fact);
}

update(fact: Achat0): Observable<any> {

     return this.http.put<Achat0>(`${this.baseUrl}/${fact.id}`, fact);
}


delete(id: string): Observable<any> {

  return this.http.delete<any>(`${this.baseUrl}/${id}`);
}

ListeFactureRegFRS(d1: string, d2: string, op1: string, rg: string, rc: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/search/ListeFactureRegFRS?d1=${d1}&d2=${d2}&op1=${op1}&rg=${rg}&rc=${rc}`);
}

}
