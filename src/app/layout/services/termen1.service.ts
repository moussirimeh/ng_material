import { Injectable } from '@angular/core';
import { Termen } from './termen';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Termen1Service {

  private baseUrl = globals.apiBaseUrl + 'termen1';

  constructor(private http: HttpClient) { }


  getTermen1(): Observable<Termen[]> {
   return this.http.get<Termen[]>(`${this.baseUrl}`);
  }
  updateTermen1(termen1: Termen): Observable<any> {
   return this.http.put<Termen>(`${this.baseUrl}/${termen1.id}`, termen1);
  }
}
