import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ste } from './ste';
import { AppConfigService } from '../../app-config.service';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SteService {
  // build
  // private baseUrl = 'http://192.168.2.16:8080/rest/rest/ste';

  // build  For server test

  // private baseUrl = 'http://192.168.2.16:8080/automotive/rest/ste';

  // dev
  // private baseUrl = 'http://localhost:8200/rest/ste';
  private baseUrl = '';
  constructor(private http: HttpClient, private appConfigService: AppConfigService) {
    this.baseUrl = this.appConfigService.apiBaseUrl + 'ste';
    globals.apiBaseUrl = this.appConfigService.apiBaseUrl;
    globals.smsApi = this.appConfigService.smsApi;
  }

  getSte(): Observable<Ste> {
    return this.http.get<Ste>(`${this.baseUrl}`);
  }
  getDateCaisse() {
    return this.http.get(`${this.baseUrl}/search/getdateCasse`);
  }
  getDateCaissePlus() {
    return this.http.get(`${this.baseUrl}/search/getdateCaissePlus`);
  }
  validerCaisse(dsoldec: string, soldecc: string, soldece: string) {
    return this.http.get<Ste>(
      `${this.baseUrl}/search/validerCaisse?dsoldec=${dsoldec}&soldecc=${soldecc}&soldece=${soldece}`
    );
  }
  getDateServeur() {
    return this.http.get(`${this.baseUrl}/search/getDateServeur`);
  }
  getDateDebutInventaire() {
    return this.http.get(`${this.baseUrl}/search/getDateDebutInventaire`);
  }
  getDateFinInventaire() {
    return this.http.get(`${this.baseUrl}/search/getDateFinInventaire`);
  }
  updateDateInventaire(dates: string) {
    return this.http.get(
      `${this.baseUrl}/search/updateDateInventaire?dates=${dates}`
    );
  }
}
