import { Injectable } from '@angular/core';
import { Recouv } from './recouv';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RecouvService {

  private baseUrl = globals.apiBaseUrl + 'recouvs';

  constructor(private http: HttpClient) { }

createRecouv(recouv: Recouv): Observable<Recouv> {
    return this.http.post<Recouv>(`${this.baseUrl}`, recouv);
}
getRecouvsList(): Observable<Recouv[]> {
   return this.http.get<Recouv[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
updateRecouv(id: string, deno: string) {

    return this.http.get(`${this.baseUrl}/search/update?id=${id}&&deno=${deno}`);
  }
update(recouv: Recouv): Observable<any> {
   return this.http.put<Recouv>(`${this.baseUrl}/${recouv.id}`, recouv);
  }
  updatee(recouv: Recouv): Observable<any> {
    console.log(recouv);
    return this.http.put<Recouv>(`${this.baseUrl}/${recouv.id}`, recouv);
  }
deleteRecouv(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteRecouv?id=${id}`);
  }
  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }

  findByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/findByCode?code=${code}`);
  }
}
