import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComL } from './comL';
import { globals } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComLService {
    private baseUrl = globals.apiBaseUrl + 'comL';

    constructor(private http: HttpClient) { }

    getComL(): Observable<ComL> {
        return this.http.get<ComL>(`${this.baseUrl}`);
    }
    update(numero: string) {
        return this.http.get(`${this.baseUrl}/search/update?numero=${numero}`);
    }

    updateDateStf() {
        return this.http.get(`${this.baseUrl}/search/updateDateStf`);
    }
}
