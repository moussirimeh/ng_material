import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AchatService {
  private baseUrl = globals.apiBaseUrl + 'achat';
  constructor(private http: HttpClient) { }
  rechercheAchats( numAcht: string) {
    return this.http.get(`${this.baseUrl}/search/rechercheAchat?numAcht=${numAcht}`);
  }

  createAchat(achat ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, achat);
  }

  getObjectifsFoursRealise() {
    return this.http.get(`${this.baseUrl}/search/getObjectifsFoursRealise`);
  }
  getAchatsByFoursForVente() {
    return this.http.get(`${this.baseUrl}/search/getAchatsByFoursForVente`);
  }
}
