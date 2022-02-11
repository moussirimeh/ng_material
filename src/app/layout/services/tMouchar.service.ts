import { Injectable } from '@angular/core';
import { TMouchar } from './tMouchar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TMoucharService {

  private baseUrl = globals.apiBaseUrl + 'tmouchar';

  constructor(private http: HttpClient) { }


  getTMouchar(): Observable<TMouchar[]> {
   return this.http.get<TMouchar[]>(`${this.baseUrl}`);
  }
  updateTMouchar(tMouchar: TMouchar): Observable<any> {
   return this.http.put<TMouchar>(`${this.baseUrl}/${tMouchar.id}`, tMouchar);
  }
  createTMouchar(tMouchar: TMouchar): Observable<TMouchar> {
    return this.http.post<TMouchar>(`${this.baseUrl}`, tMouchar);
  }

  rechercheTMoucharByUtilisateur( util: string, opr: string, parm: string, from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/getTMoucharfindByUtilisateur?util=${util}&opr=${opr}&parm=${parm}&from=${from}&to=${to}`);
  }
  rechercheTMoucharByDate( util: string, opr: string, parm: string, from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/getTMoucharfindByDate?util=${util}&opr=${opr}&parm=${parm}&from=${from}&to=${to}`);
  }
  rechercheTMoucharByOperation( util: string, opr: string, parm: string, from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/getTMoucharfindByOperation?util=${util}&opr=${opr}&parm=${parm}&from=${from}&to=${to}`);
  }
  rechercheTMoucharByParametre( util: string, opr: string, parm: string, from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/getTMoucharfindByParametre?util=${util}&opr=${opr}&parm=${parm}&from=${from}&to=${to}`);
  }
}
