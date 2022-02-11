import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReferenceEquivalenteService {
  private baseUrl = globals.apiBaseUrl + 'referenceEquivalente';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  getEquivalence(code: string, numEquiv: string) {
    const params = new HttpParams()
    .set('code', code)
    .set('numEquiv', numEquiv)
    ;
    return this.http.get(`${this.baseUrl}/search/getRefEquivalente`, {params});
  }

}
