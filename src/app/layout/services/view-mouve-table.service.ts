import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ViewMouveTableService {
  private baseUrl = globals.apiBaseUrl + 'viewMouveTable';
  constructor(private http: HttpClient) { }



 deleteAll(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/deleteViewMouveTable`);
   }

   AddAllViewMouves(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/insertViewMouveTable`);
   }


}
