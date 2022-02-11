import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreanceClient } from './creanceClient';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreancesClientsService {
  private baseUrl = globals.apiBaseUrl + 'creancesClients';

  constructor(private http: HttpClient) {}

  getCreancesClientPortail(codeClient: string): Observable<CreanceClient> {
    return this.http.get<CreanceClient>(`${this.baseUrl}/search/getCreancesClientPortail?codeClient=${codeClient}`);
  }
}
