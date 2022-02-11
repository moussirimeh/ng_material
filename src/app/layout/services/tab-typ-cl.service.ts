import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TabTypCl } from './TabTypCl';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TabTypClService {

  private baseUrl = globals.apiBaseUrl + 'tabTypCl';
  constructor(private http: HttpClient) { }

  createClientsTypeI(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/createClientsTypeI`);
}
createClientsTypeN(): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/search/createClientsTypeN`);

}
historiqueTypoClt(code: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/search/historiqueTypoClt?op=${code}`);
}

createTypoClt(tabTypCl: TabTypCl): Observable<TabTypCl> {
  return this.http.post<TabTypCl>(`${this.baseUrl}`, tabTypCl);
}

}


