import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dcom } from './Dcom';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DcomService {
  private baseUrl = globals.apiBaseUrl + 'dcom';
  constructor(private http: HttpClient) {

   }

   createDcom(dcom: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, dcom);
  }
  deleteDcom(combine: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/deleteDcomByCombine?combine=${combine}`);
  }

   DeficitCMDFour(op: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/DeficitCMDFour?op=${op}`);
  }
  updateDeficitCMDFour(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/updateDeficitFrs`);
  }

   getDcomByCombine(combine: string): Observable<Dcom[]> {
    return this.http.get<Dcom[]>(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
  }

  modifyQuantiteReserv(quantite: string, numbc: string, code: string) {
    return this.http.get(`${this.baseUrl}/search/modifyQuantiteDcom?quantite=${quantite}&numbc=${numbc}&code=${code}`);
  }
  modifyQuantiteDcomENreserv(quantite: string, numbc: string, code: string) {
    return this.http.get(`${this.baseUrl}/search/modifyQuantiteDcomENreserv?quantite=${quantite}&numbc=${numbc}&code=${code}`);
  }
  RechercherDcom(codeClt: string, bc_eqm: string, codeArticle: string) {

    const params = new HttpParams()
    .set('codeClt', codeClt)
    .set('bc_eqm', bc_eqm)
    .set('codeArticle', codeArticle);
 

    return this.http.get(`${this.baseUrl}/search/rechercheDcom`, { params });
  }
  getArticlesCommandesForVente(combine: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getArticlesCommandesForVente?combine=${combine}`);
  }
  updateDcomAfterVenteBC(mvComb: string, dcComb: string) {
    return this.http.get(`${this.baseUrl}/search/updateDcomAfterVenteBC?mvComb=${mvComb}&dcComb=${dcComb}`);
  }
  updateDcomAfterAvoirBC(mvComb: string, dcComb: string) {
    return this.http.get(`${this.baseUrl}/search/updateDcomAfterAvoirBC?mvComb=${mvComb}&dcComb=${dcComb}`);
  }
}
