import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VerifCommande } from './verifCommande';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VerifCommandeService {
  private baseUrl = globals.apiBaseUrl + 'verifCommande';
  constructor(private http: HttpClient) { }
  ListCmd(numCmd: string): Observable<VerifCommande> {
    return this.http.get<VerifCommande>(`${this.baseUrl}/search/findByNumCmdOrderByRangAscArtCmdAsc?numCmd=${numCmd}`);
  }
  VerifCmnd(numCmd: string) {
    console.log(`${this.baseUrl}/search/VerifCmnd?numCmd=${numCmd}`);
    return this.http.get(`${this.baseUrl}/search/VerifCmnd?numCmd=${numCmd}`);
  }

  VerifCmndbyFour(codefour: string ) {
    return this.http.get(`${this.baseUrl}/search/VerifCmndbyFour?codefour=${codefour}`);
  }

  findByNumCmdOrderByRangAscArtCmdAsc(numCmd: string) {
    return this.http.get(`${this.baseUrl}/search/findByNumCmdOrderByRangAscArtCmdAsc?numCmd=${numCmd}`);
  }
}
