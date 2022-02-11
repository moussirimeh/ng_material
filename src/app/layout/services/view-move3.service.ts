import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ViewMove3Service {

  private baseUrl = globals.apiBaseUrl + 'viewMouve3';
  constructor(private http: HttpClient) { }
  getCA(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/getCA`);
  }
}
