import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReleveClient } from './releveClient';
import { HttpClient } from '@angular/common/http';
import { Brou } from './Brou';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReleveClientService {
  private baseUrl = globals.apiBaseUrl + 'releveClient'; // URL to web API
  constructor(private http: HttpClient) {}

  getReleves(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/releveClientG?code=${code}`);
  }
  getDelaisPayment(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/delaisPayment?codeClient=${code}`);
  }
  getDelaisReglement(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/delaisReglement?codeClient=${code}`);
  }
  getreleveClientsBrou(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/releveClientBrou?code=${code}`);
  }
  getReglementsNonEchus(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/reglementsNonEchus?codeClient=${code}`);
  }
  getBrous(cmpt: string, echean: string): Observable<any> {
    return this.http.get<Brou>(`${this.baseUrl}/search/findBrous?cmpt=${cmpt}&echean=${echean}`);
  }
  getRelevesComptants(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/releveClientComptant?code=${code}`);
  }
  getreleveClientsBrouComptant(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/releveClientBrouComptant?code=${code}`);
  }
  getReglementsNonEchusComptantCs(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/reglementsNonEchusCmptCs?codeClient=${code}`);
  }
  getReglementsNonEchusComptantCp(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/reglementsNonEchusCmptCp?codeClient=${code}`);
  }
  getRelevesCont(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/releveClientGCont?code=${code}`);
  }
  getreleveClientsBrouCont(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/releveClientBrouCont?code=${code}`);
  }
  getDelaisPaymentCont(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/delaisPaymentCont?codeClient=${code}`);
  }
  getDelaisReglementCont(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/delaisReglementCont?codeClient=${code}`);
  }
  getReglementsNonEchusCont(code: string): Observable<any> {
    return this.http.get<ReleveClient[]>(`${this.baseUrl}/search/reglementsNonEchusCont?codeClient=${code}`);
  }
}
