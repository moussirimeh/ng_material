import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from '@syncfusion/ej2-base';
import { globals } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TopnavService {

    private baseUrl = globals.apiBaseUrl + 'users';

    constructor(private http: HttpClient) {
        // console.log(globals.apiBaseUrl + 'users');
     }

    getLoginsList(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/search/findByOrderByCode`);
    }
    getLoginName(login: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/search/findByCodeUtil?codeUtil=${login}`);
    }
    existsByLogin(login: string) {
        return this.http.get(`${this.baseUrl}/search/existsByCodeUtil?codeUtil=${login}`);
    }
    existsByLoginPwd(login: string, pwd: string) {
        return this.http.get(`${this.baseUrl}/search/existsByCodeUtilAndMPUtil?codeUtil=${login}&mPUtil=${pwd}`);
    }
}
