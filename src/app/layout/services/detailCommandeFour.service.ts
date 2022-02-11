import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DetailCommandeFourService {
    private baseUrl = globals.apiBaseUrl + 'detailCommandeFour';

    constructor(private http: HttpClient) { }

    commandeFour(numero: string) {
        return this.http.get(`${this.baseUrl}/search/commandeFournisseur?numero=${numero}`);
      }

}
