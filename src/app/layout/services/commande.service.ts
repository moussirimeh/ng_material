import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from './commande';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommandeService {
  private baseUrl = globals.apiBaseUrl + 'commandes';

  constructor(private http: HttpClient) {}

  createCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(`${this.baseUrl}`, commande);
  }
  updateFusion(code1: string, code2: string) {
    const params = new HttpParams()
    .set('code1', code2).set('code2', code1);
    return this.http.get(
      `${this.baseUrl}/search/updateFusion`, {params}
    );
  }
  getByArtCmd(article: string) {
    console.log(
      'getByArtCmd hhhhhh ',
      this.http.get(`${this.baseUrl}/search/findByArtCmd?artCmd=${article}`)
    );
    const params = new HttpParams()
    .set('artCmd', article);
    return this.http.get(`${this.baseUrl}/search/findByArtCmd`, {params});
  }

  qteCommandeEnCoursByArticle(article: string) {
    const params = new HttpParams().set('article', article);
    return this.http.get(`${this.baseUrl}/search/qteCommandeEnCoursByArticle`, {params});
  }
  getLivCmdByFrsAndArt(codeArt: string, four: string) {
    const params = new HttpParams().set('codeArt', codeArt).set('four', four);
    return this.http.get(
      `${this.baseUrl}/search/getListeLivraisonByArtandFrs`,
      { params }
    );
  }
  getCommandeByFrsAndArt(codeArt: string, four: string) {
    const params = new HttpParams().set('code', codeArt).set('four', four);
    return this.http.get(`${this.baseUrl}/search/getListeCommandeByArtandFrs`, {params});
  }

  articleCommande(article: string) {
    const params = new HttpParams().set('article', article);
    return this.http.get(`${this.baseUrl}/search/articleCommande`, { params });
  }
  removeByNumCmd(numero: string) {
    return this.http.get(
      `${this.baseUrl}/search/removeByNumCmd?numero=${numero}`
    );
  }
  updateQuantiteCmdAchat(
    quantite: string,
    prix: string,
    numCmd: string,
    codeArt: string
  ) {
    const params = new HttpParams()
    .set('quantite', quantite)
    .set('prix', prix)
    .set('numCmd', numCmd)
    .set('codeArt', codeArt);
    return this.http.get(
      `${this.baseUrl}/search/modifyQuantiteCmndAchat`, { params });
  }
  // modifyQuantiteCmndAvoir
  updateQuantiteCmdAvoir(quantite: string, numCmd: string, codeArt: string) {
    const params = new HttpParams()
    .set('quantite', quantite)
    .set('numCmd', numCmd)
    .set('codeArt', codeArt);
    return this.http.get(
      `${this.baseUrl}/search/modifyQuantiteCmndAvoir`, { params }
    );
  }

  getListeCommandeByNumCmdAchat(numCmd: String) {
    return this.http.get(
      `${this.baseUrl}/search/getListeCommandeByNumCmdAchat?numCmd=${numCmd}`
    );
  }

  quantiteCommande(artcmd: string) {
    const params = new HttpParams().set('artcmd', artcmd);
    return this.http.get(`${this.baseUrl}/search/quantiteCommande`, { params });
  }
  getListeCmdFrsNonSoldee(
    datedebut: string,
    datefin: string,
    codefrs: string,
    codeart: string,
    typef: string,
    numcmd: string,
    typerech: string
  ) {
    const params = new HttpParams()
      .set('datedebut', datedebut)
      .set('datefin', datefin)
      .set('codefrs', codefrs)
      .set('codeart', codeart)
      .set('typef', typef)
      .set('numcmd', numcmd)
      .set('typerech', typerech);
    return this.http
      .get(`${this.baseUrl}/search/getListeCmdFrsNonSoldee`, { params });
  }

  getListeDetailCmdFrs(numcmd: string) {
    return this.http.get(
      `${this.baseUrl}/search/getListeDetailCmdFrs?numcmd=${numcmd}`
    );
  }
}
