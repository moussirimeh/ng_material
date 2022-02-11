import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fa1 } from './fa1';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Fa1Service {
    private baseUrl = globals.apiBaseUrl + 'fa1';

  constructor(private http: HttpClient) { }

  getFa1(): Observable<Fa1> {
    return this.http.get<Fa1>(`${this.baseUrl}`);
  }
  updateFa1(fa1: Fa1): Observable<Fa1> {
    return this.http.put<Fa1>(`${this.baseUrl}/${fa1.id}`, fa1);
  }
  updateNumeroFa1(numero: string) {
    return this.http.get(`${this.baseUrl}/search/updateNumeroFa1?numero=${numero}`);
  }
}
