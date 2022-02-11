import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class EcomService {

  private baseUrl = globals.apiBaseUrl + 'ecom';

  constructor(private http: HttpClient) { }

  ExistCMDByCLTRef(ref: string, codeclt: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByCltDevANDRef?ref=${ref}&cd=${codeclt} `);
   }

  // findByNumDev

   getEcomByNumDev(ref: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByNumDev?numDev=${ref} `);
   }

   updateEcom(ecom: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${ecom.id}`, ecom);
  }
  deleteEcom(id: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`, );
  }
  createEcom(ecom: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, ecom);
  }
  getEcomByNumDevAndCltDev(numDev: string,cltDev:string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByNumDevAndCltDev?numDev=${numDev}&cltDev=${cltDev}`);
   }
}
