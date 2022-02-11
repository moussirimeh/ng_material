import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeP } from './modeP';
import { globals } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModePService {
    private baseUrl = globals.apiBaseUrl + 'modeP';

    constructor(private http: HttpClient) { }

    getModeP(): Observable<ModeP> {
        return this.http.get<ModeP>(`${this.baseUrl}`);
    }
    modePaiement(): Observable<ModeP[]> {
        return this.http.get<ModeP[]>(`${this.baseUrl}/search/findByOrderByDeno`);
       }
}
