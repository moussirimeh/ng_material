import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from './client';
import { Brou } from './brou';
import { FacturationTermeIndiv } from './facturationTermeIndiv';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacturationCollectiveService {
  private baseUrl = globals.apiBaseUrl + 'facturationCollective';

  constructor(private http: HttpClient) {}
  /*factAvCdg(date: string) {
    return this.http.get(`${this.baseUrl}/search/factAvCdg?dt=${date}`);
  }*/
  facturer(date: string) {
    return this.http.get(`${this.baseUrl}/search/facturer?dt=${date}`);
  }/*
  factAvCdg1() {
    return this.http.get(`${this.baseUrl}/search/factAvCdg1`);
  }
  factAvCdg2() {
    return this.http.get(`${this.baseUrl}/search/factAvCdg2`);
  }
  factAvCdg3(date: string) {
    return this.http.get(`${this.baseUrl}/search/factAvCdg3?dt=${date}`);
  }*/
  termeAll(date: string, comm: string): Observable<Client[]> {
    if (comm === '') {
      return this.http.get<Client[]>(`${this.baseUrl}/search/termeAll?dat=${date}`);
    } else {
      return this.http.get<Client[]>(`${this.baseUrl}/search/termeAll?dat=${date}&comm=${comm}`);
    }
  }
  brouFact(numero: string, date: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(`${this.baseUrl}/search/brouFact?numero=${numero}&dat=${date}`);
  }
  termeClt(operateur: string, date: string): Observable<FacturationTermeIndiv[]> {
    return this.http.get<FacturationTermeIndiv[]>(`${this.baseUrl}/search/termeClt?operateur=${operateur}&dat=${date}`);
  }
}
