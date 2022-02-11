import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TableVisiteService {
  private baseUrl = globals.apiBaseUrl + 'tablVisit';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  findByOrderByDesignClt(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/findByOrderByDesignClt`);
  }

  updateTableVisit( cod_cl: string ,  cod_rep: string  ,  dt: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/updateTableVisit?cod_cl=${cod_cl}&cod_rep=${cod_rep}&dt=${dt}`);
  }
}
