import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { globals } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DetailCommandeClientService {
    private baseUrl = globals.apiBaseUrl + 'detailCommandeClient';

    constructor(private http: HttpClient) { }

    detailCommande( combine: string, choix: string) {
        return this.http.get(`${this.baseUrl}/search/detailCommande?combine=${combine}&choix=${choix}`);
      }
      detailCommandeNonSoldes( combine: string, choix: string) {
        return this.http.get(`${this.baseUrl}/search/detailCommandeNonSoldes?combine=${combine}&choix=${choix}`);
      }
      articlecommandeavecstock(date_debut: string, date_fin: string, code_art: string, code_frn: string ) {
        const params = new HttpParams()
      .set('date_debut', date_debut)
      .set('date_fin', date_fin)
      .set('code_art', code_art)
      .set('code_frn', code_frn);

        return this.http.get(`${this.baseUrl}/search/articlecommandeavecstock`, {params});
      }
}
