import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeuilleCaissePrincipale } from './feuilleCaissePrincipale';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FeuilleCaissePrincipaleService {
  private baseUrl = globals.apiBaseUrl + 'feuilleCaissePrincipale';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  feuilleRecette( date: string): Observable<FeuilleCaissePrincipale []> {
console.log('testttt');

    return this.http.get<FeuilleCaissePrincipale[]>(`${this.baseUrl}/search/feuilleRecette?date=${date}`);
  }
  feuilleDepense( date: string): Observable<FeuilleCaissePrincipale[]> {
    console.log('testttt');

        return this.http.get<FeuilleCaissePrincipale[]>(`${this.baseUrl}/search/feuilleDepense?date=${date}`);
      }

}
