import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StkMRQ } from './stkMRQ';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StkMRQService {
  private baseUrl = globals.apiBaseUrl + 'StkMRQ';

  constructor(private http: HttpClient, private ngZone: NgZone) { }

  createStkMRK(stkMrq: StkMRQ): Observable<StkMRQ> {
    return this.http.post<StkMRQ>(`${this.baseUrl}`, stkMrq);
  }


  deleteStkMRK(id: string): Observable<{}> {
    return this.http.delete<StkMRQ>(`${this.baseUrl}/${id}`);
  }

  deleteStkMrq(marque: string) {
    return this.http.get(
      `${this.baseUrl}/search/removeByMarque?code=${marque}`
    );
  }
  getStkMrqByCode (code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get<any[]>( `${this.baseUrl}/search/findByCode`, {params} );
  }
  existsByCode(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get(`${this.baseUrl}/search/existsByCode`, {params} );
  }
  existsByCodeAndMarque(code: string, marque: string) {
    const params = new HttpParams()
    .set('code', code)
    .set('marque', marque);
    return this.http.get(`${this.baseUrl}/search/existsByCodeAndMarque`, {params});
  }

  getStkMRQ() {
    return this.http.get(`${this.baseUrl}`);
  }
  getStkMRQByCode(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get(`${this.baseUrl}/search/findByCode`, {params});
  }
  getStkMrqByMarque (marque: String) {
    return this.http.get(`${this.baseUrl}/search/findByMarque?marque=${marque}`);
  }
}
