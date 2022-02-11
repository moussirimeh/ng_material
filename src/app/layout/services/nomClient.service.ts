import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NomClient } from './nomclient';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NomClientService {
    private baseUrl = globals.apiBaseUrl + 'NomClient';

  constructor(private http: HttpClient) { }
  createNomClient(nomClient: NomClient): Observable<NomClient> {
    return this.http.post<NomClient>(`${this.baseUrl}`, nomClient);
}
getNomClientByCombine(combine : string): Observable<NomClient[]> {
  return this.http.get<NomClient[]>(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
}
}
