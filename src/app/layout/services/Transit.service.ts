import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transit } from './Transit';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransitService {
  private baseUrl = globals.apiBaseUrl + 'tableTransit';
  constructor(private http: HttpClient) { }

  createTableTransit(transit: Transit): Observable<Transit> {
    return this.http.post<Transit>(`${this.baseUrl}`, transit);
}
updateTableTransit(transit: Transit): Observable<any> {
  return this.http.put<Transit>(`${this.baseUrl}/${transit.id}`, transit);
}
deleteTableTransit(id: string): Observable<any> {
  return this.http.delete<Transit>(`${this.baseUrl}/${id}`);
}
getTransit(): Observable<Transit[]> {
  return this.http.get<Transit[]>(`${this.baseUrl}/search/findByOrderById`);
}
}
