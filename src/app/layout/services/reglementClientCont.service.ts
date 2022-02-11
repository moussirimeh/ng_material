import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReglementClientCont } from './reglementClientCont';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReglementClientContService {
  private baseUrl = globals.apiBaseUrl + 'reglementClientCont';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ListByDebit(compte: string): Observable<ReglementClientCont[]> {

    return this.http.get<ReglementClientCont[]>(`${this.baseUrl}/search/selectUnionDebit?compte=${compte}`);
  }
  ListByCredit(compte: string): Observable<ReglementClientCont[]> {


    return this.http.get<ReglementClientCont[]>(`${this.baseUrl}/search/selectUnionCredit?compte=${compte}`);
  }

}
