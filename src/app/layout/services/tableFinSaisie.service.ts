import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TableFinSaisieService {
  private baseUrl = globals.apiBaseUrl + 'TableFinSaisie';

  constructor(private http: HttpClient) {}

  getableFinSaisie(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  updateTableFinSaisie(tableFinSaisie: any): Observable<any> {
    console.log(tableFinSaisie);
    return this.http.put<any>(`${this.baseUrl}/${tableFinSaisie.id}`, tableFinSaisie);
  }
}
