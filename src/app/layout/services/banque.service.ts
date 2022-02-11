import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banque } from './banque';
import { globals } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BanqueService {
    private baseUrl = globals.apiBaseUrl + 'banque';

    constructor(private http: HttpClient) { }

    getBanque(): Observable<Banque> {
        return this.http.get<Banque>(`${this.baseUrl}`);
    }
    listeBanque(): Observable<Banque[]> {
        return this.http.get<Banque[]>(`${this.baseUrl}/search/findByOrderByDeno`);
       }
    getBanqueByCode(code: string): Observable<Banque> {
        return this.http.get<Banque>(`${this.baseUrl}/search/findByCode?code=${code}`);
    }
}
