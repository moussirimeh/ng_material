import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Sfamille } from './sfamille';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SfamilleService {
  private baseUrl = globals.apiBaseUrl + 'sfamilles';
  constructor(private http: HttpClient) {}


  getCaMargesAnnCrntBySFamille(
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
    return this.http.get<any[]>( `${this.baseUrl}/search/getCaMargesAnnCrntBySFamille`, {params} );
  }
  getCaMargesAnne1BySFamille(
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
    return this.http.get<any[]>( `${this.baseUrl}/search/getCaMargesAnne1BySFamille`, {params} );
  }
  getCaMargesAnne2BySFamille(
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
    return this.http.get<any[]>( `${this.baseUrl}/search/getCaMargesAnne2BySFamille`, {params} );
  }



  createSfamille(sfamille: Sfamille): Observable<Sfamille> {
    return this.http.post<Sfamille>(`${this.baseUrl}`, sfamille);
  }
  getSfamillesList(): Observable<Sfamille[]> {
    return this.http.get<Sfamille[]>(
      `${this.baseUrl}/search/findByOrderByCode`
    );
  }
  updateeSfamille(id: string, nom: string) {
    return this.http.get(`${this.baseUrl}/search/update?id=${id}&nom=${nom}`);
  }
  updateSfamille(sfamille: Sfamille): Observable<any> {
    return this.http.put<Sfamille>(`${this.baseUrl}/${sfamille.id}`, sfamille);
  }
  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }
  getSfamilleByCode(code: string): Observable<Sfamille> {
    return this.http.get<Sfamille>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }
  getSfamilleByNom(nom: string): Observable<Sfamille[]> {
    return this.http.get<Sfamille[]>(
      `${this.baseUrl}/search/findByNomStartsWith?nom=${nom}`
    );
  }
  SFamByCode(code: string): Observable<Sfamille> {
    return this.http.get<Sfamille>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }
  searchSousFamilleByNomStartsWith(nom: string) {
    return this.http.get<Sfamille>(
      `${this.baseUrl}/search/findTop100ByNomStartsWith?nom=${nom}`
    );
  }
  deleteSfamille(id: string) {
    return this.http.delete<Sfamille>(`${this.baseUrl}/${id}`);
  }
  getSousFamillesByOrderByNom(): Observable<Sfamille[]> {
    return this.http.get<Sfamille[]>(`${this.baseUrl}/search/findByOrderByNom`);
  }
}
