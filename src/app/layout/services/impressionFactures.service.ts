import { Injectable } from '@angular/core';
import { ImpressionFactures } from './impressionFacture';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImpressionFacturesService {
  private baseUrl = globals.apiBaseUrl + 'impressionfactures';

  constructor(private http: HttpClient) {}

  getImprFactList(date, codeClient, numero1, numero2): Observable<ImpressionFactures[]> {
    let res: any;
    if (date === null || date === '') {
      if (numero1 === null || numero1 === '') {
        if (codeClient === null || codeClient === '') {
          res = this.http.get<ImpressionFactures[]>(`${this.baseUrl}/search/impressionFacts?`);
        } else {
          res = this.http.get<ImpressionFactures[]>(`${this.baseUrl}/search/impressionFacts?codeClient=${codeClient}`);
        }
      } else {
        if (codeClient === null || codeClient === '') {
          res = this.http.get<ImpressionFactures[]>(
            `${this.baseUrl}/search/impressionFacts?numero1=${numero1}&numero2=${numero2}`
          );
        } else {
          res = this.http.get<ImpressionFactures[]>(
            `${this.baseUrl}/search/impressionFacts?codeClient=${codeClient}&numero1=${numero1}&numero2=${numero2}`
          );
        }

      }
    } else {
      if (numero1 === null || numero1 === '') {
        if (codeClient === null || codeClient === '') {
          res = this.http.get<ImpressionFactures[]>(`${this.baseUrl}/search/impressionFacts?date=${date}`);
        } else {
          res = this.http.get<ImpressionFactures[]>(`${this.baseUrl}/search/impressionFacts?date=${date}&codeClient=${codeClient}`);
        }
      } else {
        if (codeClient === null || codeClient === '') {
          res = this.http.get<ImpressionFactures[]>(
            `${this.baseUrl}/search/impressionFacts?date=${date}&numero1=${numero1}&numero2=${numero2}`
          );
        } else {
          res = this.http.get<ImpressionFactures[]>(
            `${this.baseUrl}/search/impressionFacts?date=${date}&codeClient=${codeClient}&numero1=${numero1}&numero2=${numero2}`
          );
        }

      }
    }

    return res;
  }
  getFactAimprimer(numero): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/FactureImprim?numero=${numero}`);
  }
  getTvaFacture(numero): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getTvaFacture?numero=${numero}`);
  }
  getFactAimprimerGros(numero): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/FactureImprimGros?numero=${numero}`);
  }
  getTvaFactureGros(numero): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getTvaFactureGros?numero=${numero}`);
  }
  async getAsyncData(numero) {
    const asyncResult = await this.http.get<any[]>(`${this.baseUrl}/search/getTvaFacture?numero=${numero}`).toPromise();
    console.log(asyncResult);
    console.log('No issues, I will wait until promise is resolved..');
    return asyncResult;
  }
}
