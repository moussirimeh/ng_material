import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvolutionService {

  private baseUrl = globals.apiBaseUrl + 'evolution';

    constructor(private http: HttpClient) { }

    UpdateEvolution(operateur: String) {
      return this.http.get(`${this.baseUrl}/search/UpdateEvolution?operateur=${operateur}`);
    }
   InsertEvolution(operateur: String , mois: String , lib_mois: String) {
    return this.http.get(`${this.baseUrl}/search/InsertEvolution?operateur=${operateur}&mois=${mois}&lib_mois=${lib_mois}`);
   }
   UpdateEvolutionRealise(operateur: String) {
    return this.http.get(`${this.baseUrl}/search/UpdateEvolutionRealise?operateur=${operateur}`);
   }
   InsertEvolutionRealise(operateur: String , mois: String , lib_mois: String) {
   return this.http.get(`${this.baseUrl}/search/InsertEvolutionRealise?operateur=${operateur}&mois=${mois}&lib_mois=${lib_mois}`);
   }
   deleteEvolution() {
    return this.http.get(`${this.baseUrl}/search/deleteEvolution`);
   }
  findByOrderByZone() {
    return this.http.get(`${this.baseUrl}/search/findByOrderByZone`);
  }
}
