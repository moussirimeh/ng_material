import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FacturationTermeIndivService {
  private baseUrl = globals.apiBaseUrl + 'facturationTermeIndiv';

  constructor(private http: HttpClient) {}

  facturationTermeIndivParBl(operateur: string, date: string) {
    return this.http.get(`${this.baseUrl}/search/FacturationTermeIndivParBl?operateur=${operateur}&date=${date}`);
  }
  facturationTermeIndivParCmd(operateur: string, date: string) {
    return this.http.get(`${this.baseUrl}/search/FacturationTermeIndivParCmd?operateur=${operateur}&date=${date}`);
  }
  factTermeRef(operateur: string, nature: string, date: string, ref: string) {

    if (ref === '') {
      return this.http.get(`${this.baseUrl}/search/factTermeRef?operateur=${operateur}&nature=${nature}&date=${date}`);
    } else {
      const params = new HttpParams()
      .set('operateur', operateur)
      .set('nature', nature)
      .set('date', date)
      .set('ref', ref);
      return this.http.get(`${this.baseUrl}/search/factTermeRef`, {params});
    }
  }
}
