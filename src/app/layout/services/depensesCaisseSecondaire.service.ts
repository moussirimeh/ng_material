import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepensesCaisseSecondaire } from './depensesCaisseSecondaire';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class DepensesCaisseSecondaireService {
  private baseUrl = globals.apiBaseUrl + 'depensesCaisseSecondaire';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  depensesCaisseSecondaire( from: string, to: string): Observable<DepensesCaisseSecondaire[]> {


    return this.http.get<DepensesCaisseSecondaire[]>(`${this.baseUrl}/search/depense?from=${from}&to=${to}`);
  }

}
