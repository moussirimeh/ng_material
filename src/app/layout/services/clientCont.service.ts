import { Injectable, NgZone } from '@angular/core';
import { Client } from './client';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ClientCont } from './clientCont';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ClientContService {
  private baseUrl = globals.apiBaseUrl + 'clientsCont';

  constructor(private http: HttpClient, private ngZone: NgZone) {}


  getClientContList(): Observable<ClientCont[]> {
    return this.http.get<ClientCont[]>(`${this.baseUrl}/search/findByOrderByDeno`);
  }
  getDeno(code: string) {
    return this.http.get(`${this.baseUrl}/search/deno?code=${code}`);
  }
  getClientContByCode(code:string): Observable<ClientCont[]> {
    return this.http.get<ClientCont[]>(`${this.baseUrl}/search/findByCode?code=${code}`);
  }
  getClientsContTop100ByDenoStartsWith(deno: string): Observable<Client[]> {
    return this.http.get<ClientCont[]>(`${this.baseUrl}/search/findTop100ByDenoStartsWith?deno=${deno}`);
  }
  createClientCont(clientCont: ClientCont): Observable<Client> {
    return this.http.post<ClientCont>(`${this.baseUrl}`, clientCont);
  }
}
