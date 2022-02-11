import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class BcomService  {
    private baseUrl = globals.apiBaseUrl + 'bcoms';

    constructor(private http: HttpClient) { }

    getBcom(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}`);
    }

    createBcom(): Observable<any> {
      return this.http.get<any[]>(`${this.baseUrl}/search/updateNumero`);
    }
}
