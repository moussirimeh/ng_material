import { Injectable } from '@angular/core';
import { Vendeur1 } from './vendeur1';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class Vendeur1Service {

  private baseUrl = globals.apiBaseUrl + 'vendeur1';

  constructor(private http: HttpClient) { }

  getCaMargesAnnCrntByVendeur(
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
      `${this.baseUrl}/search/getCaMargesAnnCrntByVendeur`, {params}
    );

  }
  getCaMargesAnne1ByVendeur(
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
      `${this.baseUrl}/search/getCaMargesAnne1ByVendeur`, {params});
  }
  getCaMargesAnne2ByVendeur(
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
      `${this.baseUrl}/search/getCaMargesAnne2ByVendeur`, {params});
  }


createVendeur1(vendeur1: Vendeur1): Observable<Vendeur1> {
    return this.http.post<Vendeur1>(`${this.baseUrl}`, vendeur1);
}
  getVendeur1sList(): Observable<Vendeur1[]> {
   return this.http.get<Vendeur1[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }

  getFicheVendeur1(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/ficheVendeur`);
   }

  getVendeur1sListe(deno: string): Observable<Vendeur1[]> {
    return this.http.get<Vendeur1[]>(`${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`);
   }

  getVendeur1ByCode(code: string): Observable<Vendeur1[]> {
    return this.http.get<Vendeur1[]>(`${this.baseUrl}/search/findByCode?code=${code}`);
   }

  updateVendeur1(id: string, deno: string) {

    return this.http.get(`${this.baseUrl}/search/update?id=${id}&deno=${deno}`);
  }
update(vendeur1: Vendeur1): Observable<any> {
   return this.http.put<Vendeur1>(`${this.baseUrl}/${vendeur1.id}`, vendeur1);
  }
updatee(vendeur1: Vendeur1): Observable<any> {
    console.log(vendeur1);
    return this.http.put<Vendeur1>(`${this.baseUrl}/${vendeur1.id}`, vendeur1);
  }
deleteVendeur1(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteVendeur1?id=${id}`);
  }
  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }
  getVendeur1ByDeno () {
    return this.http.get(`${this.baseUrl}/search/findByOrderByDeno`);
  }
  searchVendeur1ByDenoStartsWith(deno: string) {
    return this.http.get<Vendeur1>(`${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`);
  }
  updateFicheVendeur(d1: string, d2: string, f1: string, f2: string) {
    return this.http.get<Vendeur1>(`${this.baseUrl}/search/updateFicheVendeur?d1=${d1}&d2=${d2}&f1=${f1}&f2=${f2}`);
  }

}
