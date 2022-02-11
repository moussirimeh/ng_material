import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fa } from './fa';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FaService {
    private baseUrl = globals.apiBaseUrl + 'fa';

  constructor(private http: HttpClient) { }

  getFa(): Observable<Fa> {
    return this.http.get<Fa>(`${this.baseUrl}`);
  }
  updateFa(fa: Fa): Observable<Fa> {
    return this.http.put<Fa>(`${this.baseUrl}/${fa.id}`, fa);
  }
  updateNumeroFa(numero: string){
    return this.http.get(`${this.baseUrl}/search/updateNumeroFa?numero=${numero}`);
  }
}
