import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { interval } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Regulat } from './regulat';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegulatService {
  private apiUrl = globals.apiBaseUrl + 'regulats'; // URL to web API
  constructor(private http: HttpClient) {}

  getRegulats(): Observable<any> {
    // return interval(10000).pipe(map(() => this.http.get(this.apiUrl + '/search/regulat')));
    return this.http.get<Regulat[]>(`${this.apiUrl}/search/regula`);
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
    // In a real-world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
