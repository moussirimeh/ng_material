import { Injectable } from '@angular/core';
import { Zone } from './zone';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ZoneService {

  private baseUrl = globals.apiBaseUrl + 'zones';

  constructor(private http: HttpClient) { }

  getCaMargesAnnCrntByZone(
    dated: string,
    datef: string,
    codeClient: string,
    codeVendeur: string,
    codeArticle: string,
    codeFournisseur: string,
    codeFamille: string,
    codeSfamille: string,
    codeZone: string,
    codeSecteur: string,
    codeRepresant: string,
    codetypoClient: string,
    codeTypecomm: string,
    codeGroupe: string
  ): Observable<any> {
    const params = new HttpParams()
    .set('dated', dated)
    .set('datef', datef)
    .set('codeClient', codeClient)
    .set('codeVendeur', codeVendeur)
    .set('codeArticle', codeArticle)
    .set('codeFournisseur', codeFournisseur)
    .set('codeFamille', codeFamille)
    .set('codeSfamille', codeSfamille)
    .set('codeZone', codeZone)
    .set('codeSecteur', codeSecteur)
    .set('codeRepresant', codeRepresant)
    .set('codetypoClient', codetypoClient)
    .set('codeTypecomm', codeTypecomm)
    .set('codeGroupe', codeGroupe);
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnnCrntByZone`, {params}
    );
  }
  getCaMargesAnne1ByZone(
    dated: string,
    datef: string,
    codeClient: string,
    codeVendeur: string,
    codeArticle: string,
    codeFournisseur: string,
    codeFamille: string,
    codeSfamille: string,
    codeZone: string,
    codeSecteur: string,
    codeRepresant: string,
    codetypoClient: string,
    codeTypecomm: string,
    codeGroupe: string
  ): Observable<any> {
    const params = new HttpParams()
    .set('dated', dated)
    .set('datef', datef)
    .set('codeClient', codeClient)
    .set('codeVendeur', codeVendeur)
    .set('codeArticle', codeArticle)
    .set('codeFournisseur', codeFournisseur)
    .set('codeFamille', codeFamille)
    .set('codeSfamille', codeSfamille)
    .set('codeZone', codeZone)
    .set('codeSecteur', codeSecteur)
    .set('codeRepresant', codeRepresant)
    .set('codetypoClient', codetypoClient)
    .set('codeTypecomm', codeTypecomm)
    .set('codeGroupe', codeGroupe);
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnne1ByZone`, {params}
    );
  }
  getCaMargesAnne2ByZone(
    dated: string,
    datef: string,
    codeClient: string,
    codeVendeur: string,
    codeArticle: string,
    codeFournisseur: string,
    codeFamille: string,
    codeSfamille: string,
    codeZone: string,
    codeSecteur: string,
    codeRepresant: string,
    codetypoClient: string,
    codeTypecomm: string,
    codeGroupe: string
  ): Observable<any> {
    const params = new HttpParams()
    .set('dated', dated)
    .set('datef', datef)
    .set('codeClient', codeClient)
    .set('codeVendeur', codeVendeur)
    .set('codeArticle', codeArticle)
    .set('codeFournisseur', codeFournisseur)
    .set('codeFamille', codeFamille)
    .set('codeSfamille', codeSfamille)
    .set('codeZone', codeZone)
    .set('codeSecteur', codeSecteur)
    .set('codeRepresant', codeRepresant)
    .set('codetypoClient', codetypoClient)
    .set('codeTypecomm', codeTypecomm)
    .set('codeGroupe', codeGroupe);
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnne2ByZone`, {params}
    );
  }

createZone(zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(`${this.baseUrl}`, zone);
}
  getZonesList(): Observable<Zone[]> {
   return this.http.get<Zone[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  updateZone(id: string, deno: string) {

    return this.http.get(`${this.baseUrl}/search/update?id=${id}&deno=${deno}`);
  }
update(zone: Zone): Observable<any> {
   return this.http.put<Zone>(`${this.baseUrl}/${zone.id}`, zone);
  }
  updatee(zone: Zone): Observable<any> {
    console.log(zone);
    return this.http.put<Zone>(`${this.baseUrl}/${zone.id}`, zone);
  }
deleteZone(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteZone?id=${id}`);
  }
  existsByCode(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get(`${this.baseUrl}/search/existsByCode`, {params});
  }
  getZoneByCode(code: string) {
    const params = new HttpParams()
    .set('code', code);
    return this.http.get(`${this.baseUrl}/search/getZoneByCode?`, {params});
  }
  getZoneByDeno() {
    return this.http.get(`${this.baseUrl}/search/findByOrderByDeno`);
  }
  searchZoneByDenoStartsWith(deno: string) {
    return this.http.get<Zone>(`${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`);
  }
}
