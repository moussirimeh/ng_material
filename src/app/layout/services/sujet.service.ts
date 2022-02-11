import { Injectable } from '@angular/core';
import { Sujet } from './sujet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SujetService {
  private baseUrl = globals.apiBaseUrl + 'sujets';

  constructor(private http: HttpClient) {}

  getSujetsListByOrderByRubrique(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(`${this.baseUrl}/search/findByOrderByRubrique`);
  }
}
