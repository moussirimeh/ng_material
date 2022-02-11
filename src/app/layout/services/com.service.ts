import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Com } from './com';
import { globals } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ComService {
    private baseUrl = globals.apiBaseUrl + 'com';

    constructor(private http: HttpClient) { }

    getCom(): Observable<Com> {
        return this.http.get<Com>(`${this.baseUrl}`);
    }
    update(numero: string) {
        return this.http.get(`${this.baseUrl}/search/update?numero=${numero}`);
      }
}
