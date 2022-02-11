import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ddevis } from './ddevis';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DdevisService {
  private baseUrl = globals.apiBaseUrl + 'ddevis';

  constructor(private http: HttpClient) {}
  findByCombine(combine: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
  }
  findByCombineOrderByRang(combine: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByCombineOrderByRang?combine=${combine}`);
  }
  getDdevisByNumDev(combine: string): Observable<any[]> {
    console.log(`${this.baseUrl}/search/getDdevisByNumDev?combine=${combine}`);
    return this.http.get<any[]>(`${this.baseUrl}/search/getDdevisByNumDev?combine=${combine}`);
  }

 updateQteSatisf(p1: string, cbn: string, cd: string): Observable<any[]> {
  const params = new HttpParams()
  .set('p1', p1).set('cbn', cbn).set('cd', cd);
  return this.http.get<any[]>(`${this.baseUrl}/search/updateQtSatisf`, {params});
  }

getDdevisByNumDevAndCode(combine: string, code: string): Observable<any[]> {
  const params = new HttpParams()
  .set('combine', combine).set('p_cd', code);
  return this.http.get<any[]>(`${this.baseUrl}/search/getDdevisByCombineAndCode`, {params});
}

  updateFusion(code1: string, code2: string) {
    /*let ref1 = '';
    if (code1 != null) {
      ref1 = code1.replace(' ', '%20');
    }
    let ref2 = '';
    if (code2 != null) {
      ref2 = code2.replace(' ', '%20');
    }*/
    const params = new HttpParams()
  .set('code1', code2).set('code2', code1);
    return this.http.get(
      `${this.baseUrl}/search/updateFusion`, {params}
    );
  }
  listOffresArticle() {
    return this.http.get<any>(`${this.baseUrl}/search/listOffresArticle`);
  }
  getDdevisByCombineCodeArtc(combine: string, code: string) {
    const params = new HttpParams()
  .set('combine', combine).set('article', code);
    return this.http.get<any>(
      `${this.baseUrl}/search/getDdevisByCombineCodeArtc`, {params}
    );
  }
  listOffresArticleFiltreDate(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codeArticle: string,
    from: string,
    to: string,
  ) {
    const params = new HttpParams()
  .set('codeOp', codefour).set('codeFam', codefamille)
  .set('codeSfam', codesfamille).set('codeArticle', codeArticle)
  .set('from', from).set('to', to);
    return this.http.get<any>(
      `${this.baseUrl}/search/listOffresArticleFiltreDate`, {params}
    );
  }
  listOffresFournisseur() {
    return this.http.get<any>(`${this.baseUrl}/search/listOffresFournisseur`);
  }
  getDdevisByCombineFour(combine: string, fournisseur: string) {
    return this.http.get<any>(`${this.baseUrl}/search/getDdevisByCombineFour?combine=${combine}&fournisseur=${fournisseur}`);
  }

  getDdevisByCodeArtAndCodeClt(codeArt: string, codeClt: string) {
    const params = new HttpParams()
  .set('codeArt', codeArt).set('codeClt', codeClt);
    return this.http.get<any>(`${this.baseUrl}/search/getDdevisByCodeArtAndCodeClt`, {params}); }

  createDdevis(ddevis: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, ddevis);
  }
  nbrArtHorsStk(numDevis: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/nbrArtHorsStk?numDevis=${numDevis}`);
  }
  coutOffreTotal(numDevis: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/coutOffreTotal?numDevis=${numDevis}`);
  }
  coutAchatTotal(numDevis: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/coutAchatTotal?numDevis=${numDevis}`);
  }
  getArticlesOffre(numDevis: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/getArticlesOffre?numDevis=${numDevis}`);
  }
  updateCoutVenteMin(coutVenteMin: string, numDevis: string, codeArticle: string): Observable<any[]> {
    const params = new HttpParams()
  .set('coutVenteMin', coutVenteMin).set('numDevis', numDevis).set('codeArticle', codeArticle);
    return this.http.get<any[]>
    (`${this.baseUrl}/search/updateCoutVenteMin`, {params});
  }
  updateDdevis(ddevis: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${ddevis.id}`, ddevis);
  }
  deleteDdevisEtatOffreEnv() {
    return this.http.get<any>(`${this.baseUrl}/search/deleteDdevis`);
  }

  getDdevisByeCombineCodeInEdevis(mvcod: string , numcl: string , date1: string ) {
    const params = new HttpParams()
  .set('mvcod', mvcod).set('numcl', numcl).set('date1', date1);
    return this.http.get<any>(`${this.baseUrl}/search/getDdevisByeCombineCodeInEdevis`, {params});
  }

  updateQtSatisfbyrang(p1: string , cbn: string , cd: string , rg: string ) {
    const params = new HttpParams()
  .set('p1', p1).set('cbn', cbn).set('cd', cd).set('rg', rg);
    return this.http.get<any>(`${this.baseUrl}/search/updateQtSatisfbyrang`, {params}); }

  deleteDdevis(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  /*findByCombineOrderByRang(combine: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByCombineOrderByRang?combine=${combine}`);
  }*/
  getDdevisByClientCodeArticle(client: string, code: string) {
    const params = new HttpParams()
  .set('client', client).set('code', code);
    return this.http.get<any>(`${this.baseUrl}/search/getDdevisByClientCodeArticle`, {params});
  }
  deleteDdevisByCombine(combine: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/deleteByCombine?combine=${combine}`);
  }
}
