import { Injectable } from '@angular/core';
import { Groupe } from './groupe';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GroupeService {

  private baseUrl = globals.apiBaseUrl + 'groupes';

  constructor(private http: HttpClient) { }

  getCaMargesAnnCrntByGroupe(
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
      `${this.baseUrl}/search/getCaMargesAnnCrntByGroupe`, {params}
    );
  }
  getCaMargesAnne1ByGroupe(
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
      `${this.baseUrl}/search/getCaMargesAnne1ByGroupe`, {params}
    );
  }
  getCaMargesAnne2ByGroupe(
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
      `${this.baseUrl}/search/getCaMargesAnne2ByGroupe`, {params}
    );
  }




createGroupe(groupe: Groupe): Observable<Groupe> {
    return this.http.post<Groupe>(`${this.baseUrl}`, groupe);
}
  getGroupesList(): Observable<Groupe[]> {
   return this.http.get<Groupe[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  updateGroupe(id: string, deno: string) {

    return this.http.get(`${this.baseUrl}/search/update?id=${id}&deno=${deno}`);
  }
update(groupe: Groupe): Observable<any> {
   return this.http.put<Groupe>(`${this.baseUrl}/${groupe.id}`, groupe);
  }
  updatee(groupe: Groupe): Observable<any> {
    console.log(groupe);
    return this.http.put<Groupe>(`${this.baseUrl}/${groupe.id}`, groupe);
  }
deleteGroupe(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteGroupe?id=${id}`);
  }
  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }
  getGroupeByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/findByCode?code=${code}`);
  }
  getGroupeByDeno (deno: string) {
    return this.http.get(`${this.baseUrl}/search/findByOrderByDeno?deno=${deno}`); }
  searchGroupeByDenoStartsWith(deno: string) {
    return this.http.get<Groupe>(`${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`);
  }
}
