import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableFinService {
  private baseUrl = globals.apiBaseUrl + 'TableFin';

  constructor(private http: HttpClient) {}
  listeByRangInf255(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/listeByRangInf255`);
  }
  listeByRangSup255(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/listeByRangSup255`);
  }

  // tslint:disable-next-line:max-line-length
  updateRang(Date_jour: string, Banque1: string, Banque2: string, Banque3: string, mp1: string, amp1: string, mp2: string, amp2: string): Observable<any> {
    return this.http.get<any>
    // tslint:disable-next-line:max-line-length
    (`${this.baseUrl}/search/updateRang?Date_jour=${Date_jour}&Banque1=${Banque1}&Banque2=${Banque2}&Banque3=${Banque3}&mp1=${mp1}&amp1=${amp1}&mp2=${mp2}&amp2=${amp2}`);
  }
  //
  updateTablFinSaisieTabBrd(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/updateTablFinSaisieTabBrd`);
  }
}
