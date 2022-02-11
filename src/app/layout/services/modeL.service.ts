import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeL } from './modeL';
import { globals } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ModeLService {
    private baseUrl = globals.apiBaseUrl + 'modeL';

    constructor(private http: HttpClient) { }

    getModeL(): Observable<ModeL> {
        return this.http.get<ModeL>(`${this.baseUrl}`);
    }
    modeLivraison(): Observable<ModeL[]> {
        return this.http.get<ModeL[]>(`${this.baseUrl}/search/findByOrderByDeno`);
       }
}
