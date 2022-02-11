import { Injectable } from '@angular/core';
import { Represan } from './represan';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RepresanService {

  private baseUrl = globals.apiBaseUrl + 'represans';

  constructor(private http: HttpClient) { }

  getCaMargesAnnCrntByRepresan(
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
      `${this.baseUrl}/search/getCaMargesAnnCrntByRepresan?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }
  getCaMargesAnne1ByRepresan(
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
      `${this.baseUrl}/search/getCaMargesAnne1ByRepresan?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }
  getCaMargesAnne2ByRepresan(
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
      `${this.baseUrl}/search/getCaMargesAnne2ByRepresan?dated=${dated}&datef=${datef}&codeClient=${codeClient}&codeVendeur=${codeVendeur}&codeArticle=${codeArticle}&codeFournisseur=${codeFournisseur}&codeFamille=${codeFamille}&codeSfamille=${codeSfamille}&codeZone=${codeZone}&codeSecteur=${codeSecteur}&codeRepresant=${codeRepresant}&codetypoClient=${codetypoClient}&codeTypecomm=${codeTypecomm}&codeGroupe=${codeGroupe}`
    );
  }


createRepresan(represan: Represan): Observable<Represan> {
    return this.http.post<Represan>(`${this.baseUrl}`, represan);
}
  getRepresansList(): Observable<Represan[]> {
   return this.http.get<Represan[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }

  getRepresansListOrderByDeno(): Observable<Represan[]> {
    return this.http.get<Represan[]>(`${this.baseUrl}/search/findByOrderByDeno`);
   }


  updateRepresan(id: string, deno: string) {

    return this.http.get(`${this.baseUrl}/search/update?id=${id}&&deno=${deno}`);
  }
update(represan: Represan): Observable<any> {
   return this.http.put<Represan>(`${this.baseUrl}/${represan.id}`, represan);
  }
  updatee(represan: Represan): Observable<any> {
    console.log(represan);
    return this.http.put<Represan>(`${this.baseUrl}/${represan.id}`, represan);
  }
deleteRepresan(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteRepresan?id=${id}`);
  }
existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }
  searchRepresanByDenoStartsWith(deno: string) {
    return this.http.get<Represan>(`${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`);
  }


 findByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/findByCode?code=${code}`);
  }
}
