import { Injectable } from '@angular/core';
import { Termen } from './termen';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TermenService {

  private baseUrl = globals.apiBaseUrl + 'termen';

  constructor(private http: HttpClient) { }


  getTermen(): Observable<Termen[]> {
   return this.http.get<Termen[]>(`${this.baseUrl}`);
  }
  updateTermen(termen: Termen): Observable<any> {
   return this.http.put<Termen>(`${this.baseUrl}/${termen.id}`, termen);
  }
}
