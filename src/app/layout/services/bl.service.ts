import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bl } from './bl';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlService {
    private baseUrl = globals.apiBaseUrl + 'bl';

  constructor(private http: HttpClient) { }

  getBl(): Observable<Bl> {
    return this.http.get<Bl>(`${this.baseUrl}`);
  }
  updateBl(bl: Bl): Observable<Bl> {
    return this.http.put<Bl>(`${this.baseUrl}/${bl.id}`, bl);
  }
}
