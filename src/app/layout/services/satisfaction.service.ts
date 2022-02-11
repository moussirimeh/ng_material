
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Soldcs } from './soldcs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SatisfactionService {
    private baseUrl = globals.apiBaseUrl + 'satisfactions';
    constructor(private http: HttpClient) { }

    createSatisfaction(satisf: any): Observable<any> {
      console.log('satisf service  ', satisf);

      return this.http.post<any>(`${this.baseUrl}`, satisf);
    }

    getSatisf(sdevis: string , scode: string): Observable<any> {
      const params = new HttpParams()
      .set('sdevis', sdevis)
      .set('scode', scode)
      ;
      return this.http.get(`${this.baseUrl}/search/getSatisf`, {params});

     }
}
