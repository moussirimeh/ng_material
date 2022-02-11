import { Injectable } from '@angular/core';
import { Marque } from './marque';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarqueService {
  private baseUrl = globals.apiBaseUrl + 'marques';

  constructor(private http: HttpClient) {}

  getMarquesList(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  getMarqueByCode(code: string) {
    return this.http.get<Marque>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }
  createMarque(marque: Marque): Observable<Marque> {
    return this.http.post<Marque>(`${this.baseUrl}`, marque);
  }
  updateMarque(marque: Marque): Observable<any> {
    return this.http.put<Marque>(`${this.baseUrl}/${marque.id}`, marque);
  }
  deleteMarque(id: string) {
    return this.http.delete<Marque>(`${this.baseUrl}/${id}`);
  }
  update(marque: Marque): Observable<any> {
    return this.http.put<Marque>(`${this.baseUrl}/${marque.id}`, marque);
  }
  updatee(marque: Marque): Observable<any> {
    console.log(marque);
    return this.http.put<Marque>(`${this.baseUrl}/${marque.id}`, marque);
  }

  existsByCode(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get(`${this.baseUrl}/search/existsByCode`, {params});
  }
  getMarqueByNom(nom: string): Observable<Marque[]> {
    return this.http.get<Marque[]>(
      `${this.baseUrl}/search/findByNomStartsWith?nom=${nom}`
    );
  }
  getMarqueByCODE(code: string): Observable<Marque[]> {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get<Marque[]>(
      `${this.baseUrl}/search/findByCode`, {params}
    );
  }
  getMrqByCode(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get(`${this.baseUrl}/search/findByCode`, {params});
  }
  getMarquesByOrderByNom(): Observable<Marque[]> {
    return this.http.get<Marque[]>(`${this.baseUrl}/search/findByOrderByNom`);
  }
  getMarquesByCodeArticle(codeArticle: string) {
    const params = new HttpParams()
  .set('codeArticle', codeArticle);
    return this.http.get(`${this.baseUrl}/search/findByCodeArticle`, {params});
  }
}
