import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mouve1 } from './mouve1';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Mouve1Service {
    private baseUrl = globals.apiBaseUrl + 'mouves1';

  constructor(private http: HttpClient) { }

  getCaMrgTypoClt(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByTypoClt?d1=${d1}&d2=${d2}`);
  }


  getCaMrgRepresan(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByRepresan?d1=${d1}&d2=${d2}`);
  }
  getCaMrgSecteur(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffBySecteur?d1=${d1}&d2=${d2}`);
  }
  getCaMrgZone(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByZone?d1=${d1}&d2=${d2}`);
  }

  getCaMrgSfamille(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffBySfamille?d1=${d1}&d2=${d2}`);
  }

  getCaMrgFamille(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByFamille?d1=${d1}&d2=${d2}`);
  }
  getCaMrgVendeur(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByVendeur?d1=${d1}&d2=${d2}`);
  }
  getCaMrgFournisseur(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByFournisseur?d1=${d1}&d2=${d2}`);
  }

  getCaMrgStock(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByStock?d1=${d1}&d2=${d2}`);
  }

  getCaMrgClient(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByClient?d1=${d1}&d2=${d2}`);
  }














  updateFusion(code1: string, code2: string) {
    let ref1 = '';
    if (code1 != null) {
      ref1 = code1.replace(' ', '%20');
    }
    let ref2 = '';
    if (code2 != null) {
      ref2 = code2.replace(' ', '%20');
    }
    return this.http.get(
        `${this.baseUrl}/search/updateFusion?code1=${ref2}&code2=${ref1}`
      );
}
getMouve1ByCode (code: String) {
  return this.http.get(`${this.baseUrl}/search/findByCode?code=${code}`);
}
getMouve1ByCodeForConsultationRef(coderef: string) {
  const params = new HttpParams()
  .set('coderef', coderef);
  return this.http.get(`${this.baseUrl}/search/getMouve1ByCodeForConsultationRef`,{params});
}
}
