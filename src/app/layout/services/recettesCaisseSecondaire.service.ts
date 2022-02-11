import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecettesCaisseSecondaire } from './RecettesCaisseSecondaire';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecettesCaisseSecondaireService {
  private baseUrl = globals.apiBaseUrl + 'recettesCaisseSecondaire';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  recettesCaisseSecondaire( from: string, to: string): Observable<RecettesCaisseSecondaire[]> {


    return this.http.get<RecettesCaisseSecondaire[]>(`${this.baseUrl}/search/recette?from=${from}&to=${to}`);
  }

}
