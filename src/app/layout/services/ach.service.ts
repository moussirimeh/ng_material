import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AchService {
  private baseUrl = globals.apiBaseUrl + 'ach';
  constructor(private http: HttpClient) { }
  getAchList(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
}
putAch(ach ): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/${ach.id}`, ach );
}
}
