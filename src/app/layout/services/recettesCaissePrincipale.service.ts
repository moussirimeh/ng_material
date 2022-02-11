import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecettesCaissePrincipale } from './RecettesCaissePrincipale';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RecettesCaissePrincipaleService {
  private baseUrl = globals.apiBaseUrl + 'recettesCaissePrincipale';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  recettesCaissePrincipale( from: string, to: string): Observable<RecettesCaissePrincipale[]> {


    return this.http.get<RecettesCaissePrincipale[]>(`${this.baseUrl}/search/recette?from=${from}&to=${to}`);
  }

}
