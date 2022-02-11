import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bl1 } from './bl1';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Bl1Service {
    private baseUrl = globals.apiBaseUrl + 'bl1';

  constructor(private http: HttpClient) { }

  getBl1(): Observable<Bl1> {
    return this.http.get<Bl1>(`${this.baseUrl}`);
  }
  updateBl1(bl1: Bl1): Observable<Bl1> {
    return this.http.put<Bl1>(`${this.baseUrl}/${bl1.id}`, bl1);
  }
}
