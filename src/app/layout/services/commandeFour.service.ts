import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from './commande';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandeFourService {
  private baseUrl = globals.apiBaseUrl + 'commandeFour';

  constructor(private http: HttpClient) { }


  detailCommandeFour(numero: string) {
    return this.http.get(`${this.baseUrl}/search/detailCommandeFour?numero=${numero}`);
  }
  commandeFrs(coderef: string) {
    return this.http.get(`${this.baseUrl}/search/commandeFrs?coderef=${coderef}`);
  }

}
