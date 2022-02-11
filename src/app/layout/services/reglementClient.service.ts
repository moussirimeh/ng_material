import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReglementClient } from './reglementClient';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReglementClientService {
  private baseUrl = globals.apiBaseUrl + 'ReglementClients';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  ListByDebit(compte: string): Observable<ReglementClient[]> {

    return this.http.get<ReglementClient[]>(`${this.baseUrl}/search/selectDebit?compte=${compte}`);
  }
  ListByCredit(compte: string): Observable<ReglementClient[]> {


    return this.http.get<ReglementClient[]>(`${this.baseUrl}/search/selectCredit?compte=${compte}`);
  }

}
