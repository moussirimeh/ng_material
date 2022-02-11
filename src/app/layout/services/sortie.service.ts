import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sortie } from './sortie';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SortieService {

  private baseUrl = globals.apiBaseUrl + 'sortie';
  constructor(private http: HttpClient) { }


  createSortie(sortie: Sortie): Observable<Sortie> {
    return this.http.post<Sortie>(`${this.baseUrl}`, sortie);
}
  getSortieList(): Observable<Sortie[]> {
   return this.http.get<Sortie[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
}
