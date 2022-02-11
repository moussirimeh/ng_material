import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableOff } from './tablOff';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TablOffService {
  private baseUrl = globals.apiBaseUrl + 'tablOff';
  constructor(private http: HttpClient) { }
  findAllByOrder(): Observable<TableOff> {
    return this.http.get<TableOff>(`${this.baseUrl}/search/findAllByOrderByTypeCltAscDenoCltAsc`);
  }
  updateTablOff() {
    return this.http.get(`${this.baseUrl}/search/updateTablOff`);
  }
}
