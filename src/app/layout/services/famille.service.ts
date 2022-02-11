import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Famille } from './famille';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FamilleService {
  private baseUrl = globals.apiBaseUrl + 'familles';
  constructor(private http: HttpClient) {}

  getCaMargesAnnCrntByFamille(
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
  ): Observable<any[]> {
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnnCrntByFamille?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`);
  }
  getCaMargesAnne1ByFamille(
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
      `${this.baseUrl}/search/getCaMargesAnne1ByFamille?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }
  getCaMargesAnne2ByFamille(
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
      `${this.baseUrl}/search/getCaMargesAnne2ByFamille?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }

  createFamille(famille: Famille): Observable<Famille> {
    return this.http.post<Famille>(`${this.baseUrl}`, famille);
  }
  getFamillesList(): Observable<Famille[]> {
    return this.http.get<Famille[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  updateFamille(famille: Famille): Observable<any> {
    return this.http.put<Famille>(`${this.baseUrl}/${famille.id}`, famille);
  }
  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }
  deleteFamillee(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteFamille?id=${id}`);
  }
  deleteFamille(id: string): Observable<any> {
    return this.http.delete<Famille>(`${this.baseUrl}/${id}`);
  }
  getFamilleByNom(nom: string): Observable<Famille[]> {
    return this.http.get<Famille[]>(
      `${this.baseUrl}/search/findByNomStartsWith?nom=${nom}`
    );
  }
  FamByCode(code: string): Observable<Famille[]> {
    return this.http.get<Famille[]>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }

  searchFamilleByNomStartsWith(nom: string) {
    return this.http.get<Famille>(
      `${this.baseUrl}/search/findTop100ByNomStartsWith?nom=${nom}`
    );
  }
  getFamillesByOrderByNom(): Observable<Famille[]> {
    return this.http.get<Famille[]>(`${this.baseUrl}/search/findByOrderByNom`);
  }
}
