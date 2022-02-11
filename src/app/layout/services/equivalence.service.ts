import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equivalence } from './equivalence';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EquivalenceService {
  equivalence: Equivalence[] = [];
  private baseUrl = globals.apiBaseUrl + 'equivalences';
  constructor(private http: HttpClient) {}
  getEquivalence(code: string): Observable<Equivalence> {
    return this.http.get<Equivalence>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }

  createEquivalence(equivalence: Equivalence): Observable<Equivalence> {
    return this.http.post<Equivalence>(`${this.baseUrl}`, equivalence);
  }
  updateEquivalence1(
    code: string,
    code1: string,
    code2: string,
    code3: string,
    code4: string,
    code5: string
  ) {
    const params = new HttpParams()
    .set('code', code)
    .set('code1', code1)
    .set('code2', code2)
    .set('code3', code3)
    .set('code4', code4)

    .set('code5', code5);
    return this.http.get(
      `${this.baseUrl}/search/update`, {params});
  }

  updateEquivalence(equivalence: Equivalence): Observable<Equivalence> {
    return this.http.put<Equivalence>(
      `${this.baseUrl}/${equivalence.id}`,
      equivalence
    );
  }

  updateStock(code: string, codeEquiv: string) {
    const params = new HttpParams()
    .set('code', code)
    .set('codeEquiv', codeEquiv);
    return this.http.get(
      `${this.baseUrl}/search/updateStock`, {params});
  }

  deleteEquivalence(id: string): Observable<any> {
    return this.http.delete<Equivalence>(`${this.baseUrl}/${id}`);
  }

  getEquivalencesList(): Observable<Equivalence[]> {
    return this.http.get<Equivalence[]>(
      `${this.baseUrl}/search/findByOrderByCode`
    );
  }
  /*
    deleteAll(): Observable<any> {
      return this.http.delete(`${this.baseUrl}` + `/delete`, { responseType: 'text' });
    }
    */
  getTop100EquivsByCodeStartsWith(code: string) {
    const params = new HttpParams()
    .set('code', code);

    return this.http.get<Equivalence[]>(
      `${this.baseUrl}/search/findTop100ByCodeStartsWith?`, {params});
  }
  getEquivByCodeGreaterThan(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get<Equivalence[]>(
      `${this.baseUrl}/search/findByCodeGreaterThan`, {params}
    );
  }
  getEquivListByCodeArtStartsWith(codeArt: string) {
    const params = new HttpParams()
    .set('codeArt', codeArt);
    return this.http.get<Equivalence[]>(
      `${this.baseUrl}/search/getEquivListByCodeArtStartsWith`, {params}
    );
  }
  getMaxCodeEquiv() {
    return this.http.get(`${this.baseUrl}/search/getMaxCodeEquiv`);
  }
  getEquivParCodeArticle(codeArt: string) {
    const params = new HttpParams()
    .set('codeArt', codeArt);
    return this.http.get<Equivalence[]>(
      `${this.baseUrl}/search/getEquivParCodeArticle`, {params}
    );
  }
}
