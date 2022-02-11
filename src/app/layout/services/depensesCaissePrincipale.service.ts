import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepensesCaissePrincipale } from './depensesCaissePrincipale';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepensesCaissePrincipaleService {
  private baseUrl = globals.apiBaseUrl + 'depensesCaissePrincipale';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  depensesCaissePrincipale( from: string, to: string): Observable<DepensesCaissePrincipale[]> {

    return this.http.get<DepensesCaissePrincipale[]>(`${this.baseUrl}/search/depense?from=${from}&to=${to}`);
  }

}
