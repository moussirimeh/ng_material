import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DuplicataEntete } from './duplicataEntete';
import { DuplicataDetail } from './duplicataDetail';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DuplicataService {
  private baseUrl = globals.apiBaseUrl + 'duplicata';
  constructor(private http: HttpClient) {}
  getEntete(combine: string): Observable<DuplicataEntete> {
    console.log(`${this.baseUrl}/search/getEntete?combine=${combine}`);
    return this.http.get<DuplicataEntete>(`${this.baseUrl}/search/getEntete?combine=${combine}`);
  }
  getDetail(combine: string): Observable<DuplicataDetail> {
    return this.http.get<DuplicataDetail>(`${this.baseUrl}/search/getDetail?combine=${combine}`);
  }
}
