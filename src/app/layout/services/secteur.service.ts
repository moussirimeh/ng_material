import { Injectable } from '@angular/core';
import { Secteur } from './secteur';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SecteurService {

  private baseUrl = globals.apiBaseUrl + 'secteurs';

  constructor(private http: HttpClient) { }

  getCaMargesAnnCrntBySecteur(
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
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnnCrntBySecteur?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }
  getCaMargesAnne1BySecteur(
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
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnne1BySecteur?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }
  getCaMargesAnne2BySecteur(
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
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnne2BySecteur?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }

createSecteur(secteur: Secteur): Observable<Secteur> {
    return this.http.post<Secteur>(`${this.baseUrl}`, secteur);
}
  getSecteursList(): Observable<Secteur[]> {
   return this.http.get<Secteur[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  updateSecteur(id: string, deno: string) {

    return this.http.get(`${this.baseUrl}/search/update?id=${id}&deno=${deno}`);
  }
update(secteur: Secteur): Observable<any> {
   return this.http.put<Secteur>(`${this.baseUrl}/${secteur.id}`, secteur);
  }
  updatee(secteur: Secteur): Observable<any> {
    console.log(secteur);
    return this.http.put<Secteur>(`${this.baseUrl}/${secteur.id}`, secteur);
  }
deleteSecteur(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteSecteur?id=${id}`);
  }

  findByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/findByCode?code=${code}`);
  }


  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }
  getSecteurByDeno() {
    return this.http.get(`${this.baseUrl}/search/findByOrderByDeno`);
  }
  searchSecteurByDenoStartsWith(deno: string) {
    return this.http.get<Secteur>(`${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`);
  }
}
