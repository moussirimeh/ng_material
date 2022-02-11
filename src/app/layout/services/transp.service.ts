import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transp } from './transp';
import { globals } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TranspService {
    private baseUrl = globals.apiBaseUrl + 'transp';

    constructor(private http: HttpClient) { }

    getTransp(): Observable<Transp> {
        return this.http.get<Transp>(`${this.baseUrl}`);
    }
    listeTransporteur(): Observable<Transp[]> {
        return this.http.get<Transp[]>(`${this.baseUrl}/search/findByOrderByDeno`);
       }
}
