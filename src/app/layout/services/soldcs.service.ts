import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Soldcs } from './soldcs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SoldcsService {
    private baseUrl = globals.apiBaseUrl + 'soldcs';

  constructor(private http: HttpClient) { }
  findByDate(date: string): Observable<Soldcs[]> {
    return this.http.get<Soldcs[]>(`${this.baseUrl}/search/findByDate?date=${date}`);
   }
  validerCaisse(soldcs: Soldcs): Observable<Soldcs> {
    return this.http.post<Soldcs>(`${this.baseUrl}`, soldcs);
  }


  getDateCaisseSecondaire() {
    return this.http.get(`${this.baseUrl}/search/getMaxDate`);
  }
  getMaxDateValS() {
    return this.http.get(`${this.baseUrl}/search/getMaxDateValS`);
  }

}
