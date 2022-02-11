import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeuilleCaisseSecondaire } from './feuille-caisse-secondaire';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FeuilleCaisseSecondaireService {
  private baseUrl = globals.apiBaseUrl + 'feuilleCaisseSecondaire';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  feuilleRecette( date: string): Observable<FeuilleCaisseSecondaire[]> {
console.log('testttt');

    return this.http.get<FeuilleCaisseSecondaire[]>(`${this.baseUrl}/search/feuilleRecette?date=${date}`);
  }
  feuilleDepense( date: string): Observable<FeuilleCaisseSecondaire[]> {
    console.log('testttt');

        return this.http.get<FeuilleCaisseSecondaire[]>(`${this.baseUrl}/search/feuilleDepense?date=${date}`);
      }

}
