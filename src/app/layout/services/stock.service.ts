import { Injectable, NgZone } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Stock } from "./stock";
import { Regulat } from "./regulat";
import { globals } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StockService {
  private baseUrl = globals.apiBaseUrl + "stocks";

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  getCaMargesAnneCrntByStock(
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
      .set("dated", dated)
      .set("datef", datef)
      .set("codeClient", codeClient)
      .set("codeVendeur", codeVendeur)
      .set("codeArticle", codeArticle)
      .set("codeFournisseur", codeFournisseur)
      .set("codeFamille", codeFamille)
      .set("codeSfamille", codeSfamille)
      .set("codeZone", codeZone)
      .set("codeSecteur", codeSecteur)
      .set("codeRepresant", codeRepresant)
      .set("codetypoClient", codetypoClient)
      .set("codeTypecomm", codeTypecomm)
      .set("codeGroupe", codeGroupe);
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnneCrntByStock`,
      { params }
    );
  }
  getCaMargesAnne1ByStock(
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
      .set("dated", dated)
      .set("datef", datef)
      .set("codeClient", codeClient)
      .set("codeVendeur", codeVendeur)
      .set("codeArticle", codeArticle)
      .set("codeFournisseur", codeFournisseur)
      .set("codeFamille", codeFamille)
      .set("codeSfamille", codeSfamille)
      .set("codeZone", codeZone)
      .set("codeSecteur", codeSecteur)
      .set("codeRepresant", codeRepresant)
      .set("codetypoClient", codetypoClient)
      .set("codeTypecomm", codeTypecomm)
      .set("codeGroupe", codeGroupe);
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnne1ByStock`,
      { params }
    );
  }
  getCaMargesAnne2ByStock(
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
      .set("dated", dated)
      .set("datef", datef)
      .set("codeClient", codeClient)
      .set("codeVendeur", codeVendeur)
      .set("codeArticle", codeArticle)
      .set("codeFournisseur", codeFournisseur)
      .set("codeFamille", codeFamille)
      .set("codeSfamille", codeSfamille)
      .set("codeZone", codeZone)
      .set("codeSecteur", codeSecteur)
      .set("codeRepresant", codeRepresant)
      .set("codetypoClient", codetypoClient)
      .set("codeTypecomm", codeTypecomm)
      .set("codeGroupe", codeGroupe);
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/getCaMargesAnne2ByStock`,
      { params }
    );
  }

  updateQuantiteStockAchat(
    qte: string,
    nouvPrixV: string,
    prixAch: string,
    devise: string,
    prix: string,
    dateAch: string,
    code: string
  ): Observable<any> {
    const params = new HttpParams()
      .set("qte", qte)
      .set("nouvPrixV", nouvPrixV)
      .set("prixAch", prixAch)
      .set("devise", devise)
      .set("prix", prix)
      .set("dateAch", dateAch)
      .set("code", code);
    return this.http.get<any>(
      `${this.baseUrl}/search/modifyQuantiteStockAchat`,
      { params }
    );
  }

  // modifyQuantiteStockAvoir
  updateQuantiteStockAvoir(
    qte: string,
    nouvPrixV: string,
    prixAch: string,
    devise: string,
    prix: string,
    dPachat: string,
    dateAch: string,
    code: string
  ): Observable<any> {
    const params = new HttpParams()
      .set("qte", qte)
      .set("nouvPrixV", nouvPrixV)
      .set("prixAch", prixAch)
      .set("devise", devise)
      .set("prix", prix)
      .set("dPachat", dPachat)
      .set("dateAch", dateAch)
      .set("code", code);
    return this.http.get<any>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/modifyQuantiteStockAvoir`,
      { params }
    );
  }
  updateStockProfiler(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/updateStockProfiler`);
  }

  udateStockStable(date: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search/updateStockStable?compta=${date}`
    );
  }

  UpdateStockProfilerCa(
    code_profiler: string,
    operateur: string
  ): Observable<any> {
    const params = new HttpParams()
      .set("code_profiler", code_profiler)
      .set("code", operateur);
    return this.http.get<any>(`${this.baseUrl}/search/UpdateStockProfilerCa`, {
      params,
    });
  }

  getCAStockByOp(operateur: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search/CAStockByOp?operateur=${operateur}`
    );
  }

  getCAStock(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/findCAStock`);
  }

  getStock(code: string): Observable<Stock> {
    const params = new HttpParams().set("code", code);
    return this.http.get<Stock>(`${this.baseUrl}/search/findByCode`, {
      params,
    });
  }
  getStockOrderByCode(): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  findByOrderByDesign(): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/search/findByOrderByDesign`);
  }
  getStockByCode(code: string): Observable<Stock> {
    const params = new HttpParams().set("code", code);
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findTop100ByCodeStartsWith`,
      { params }
    );
  }

  getStockByDes(design: string): Observable<Stock> {
    const params = new HttpParams().set("design", design);
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findTop50ByDesignStartsWith`,
      { params }
    );
  }
  getStockByOperateur(operateur: string): Observable<Stock> {
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findByOperateur?operateur=${operateur}`
    );
  }
  getTop50ByCodeStartsWith(code: string) {
    const params = new HttpParams().set("code", code);
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findTop50ByCodeStartsWith`,
      { params }
    );
  }
  getStockByDesign(designation: string): Observable<Stock> {
    const params = new HttpParams().set("design", designation);
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findTop50ByDesignStartsWith`,
      { params }
    );
  }
  getStockByCodeAndQte(code: string, quantite: string): Observable<Stock> {
    const params = new HttpParams().set("code", code).set("quantite", quantite);
    return this.http.get<Stock>(
      `${this.baseUrl}/search//findTop50ByCodeStartsWithAndQuantiteGreaterThan`,
      { params }
    );
  }
  getStockByDesignAndQte(
    designation: string,
    quantite: string
  ): Observable<Stock> {
    const params = new HttpParams()
      .set("design", designation)
      .set("quantite", quantite);
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findTop50ByDesignStartsWithAndQuantiteGreaterThan`,
      { params }
    );
  }

  createStock(stock: Stock): Observable<Stock> {
    return this.http.post<Stock>(`${this.baseUrl}`, stock);
  }
  /*
    updateStock(code: string, value: any): Observable<Object> {
      return this.http.put(`${this.baseUrl}/${code}`, value);
    }
  */
  updateStock(stock: Stock): Observable<Stock> {
    return this.http.put<Stock>(`${this.baseUrl}/${stock.id}`, stock);
  }

  deleteStock(code: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${code}`, {
      responseType: "text",
    });
  }

  getStockList(code: string): Observable<Stock[]> {
    const params = new HttpParams().set("code", code);
    return this.http.get<Stock[]>(
      `${this.baseUrl}/search/findTop100ByCodeStartsWith`,
      { params }
    );
  }
  getStocksListByOrderByCode(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }

  getStockListByEquiv(equiv: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(
      `${this.baseUrl}/search/findTop100ByEquivStartsWith?equiv=${equiv}`
    );
  }
  updateFusion(code1: string, code2: string) {
    const params = new HttpParams().set("code1", code2).set("code2", code1);
    return this.http.get(`${this.baseUrl}/search/updateFusion`, { params });
  }
  updateChangement(code1: string, code2: string) {
    const params = new HttpParams().set("code1", code2).set("code2", code1);
    return this.http.get(`${this.baseUrl}/search/updateChangement`, { params });
  }
  delete11(code: string) {
    /*let ref = '';
    if (code != null) {
      ref = code.replace(' ', '%20');
    }*/
    const params = new HttpParams().set("code", code);
    return this.http.get(`${this.baseUrl}/search/delete`, { params });
  }

  exists(code: string) {
    const params = new HttpParams().set("code", code);
    return this.http.get(`${this.baseUrl}/search/existsByCode`, { params });
  }
  getRegulats(): Observable<Regulat> {
    return this.http.get<Regulat>(`${this.baseUrl}/search/regulats`);
  }

  delete(id: string): Observable<Stock> {
    return this.http.delete<Stock>(`${this.baseUrl}/${id}`);
  }

  updateFamille(codefamille: string) {
    console.log("param " + codefamille);

    return this.http.get(
      `${this.baseUrl}/search/updateFamille?codeFamille=${codefamille}`
    );
  }
  getNumEquiv(code: string) {
    const params = new HttpParams().set("code", code);
    return this.http.get(`${this.baseUrl}/search/numEquiv`, { params });
  }
  containsdes(design: string) {
    const params = new HttpParams().set("design", design);
    return this.http.get(
      `${this.baseUrl}/search/findTop100ByDesignContaining`,
      { params }
    );
  }
  rechercherStockMort(p1: string) {
    const params = new HttpParams().set("p1", p1);
    return this.http.get(`${this.baseUrl}/search/Rechercher`, { params });
  }
  rechercheStockMort(opert: string) {
    const params = new HttpParams().set("opert", opert);
    return this.http.get(`${this.baseUrl}/search/RechercherStockMort`, {
      params,
    });
  }
  calculTotal(opert: String) {
    return this.http.get(
      `${this.baseUrl}/search/calculTotalStockMort?opert=${opert}`
    );
  }

  modifyQuantiteStock(quantite: string, code: string) {
    const params = new HttpParams().set("quantite", quantite).set("code", code);
    return this.http.get(`${this.baseUrl}/search/modifyQuantiteStock`, {
      params,
    });
  }
  modifyQuantiteStockENreserv(quantite: string, code: string) {
    const params = new HttpParams().set("quantite", quantite).set("code", code);
    return this.http.get(`${this.baseUrl}/search/modifyQuantiteStockENreserv`, {
      params,
    });
  }
  getMoreStocks(codeArt: string, quantite: string): Observable<Stock[]> {
    const params = new HttpParams()
      .set("codeArt", codeArt)
      .set("quantite", quantite);
    return this.http.get<Stock[]>(
      `${this.baseUrl}/search/findTop50ByCodeGreaterThanAndQuantiteGreaterThan`,
      { params }
    );
  }

  modifyTaxeStockNonStable() {
    return this.http.get(`${this.baseUrl}/search/modifyTaxeStockNonStable`);
  }
  modifyTaxeStockMort() {
    return this.http.get(`${this.baseUrl}/search/modifyTaxeStockStable`);
  }

  getStockByEquiv(equiv: string): Observable<Stock> {
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findByEquiv?equiv=${equiv}`
    );
  }
  getStockByFamille(famille: string): Observable<Stock> {
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findByFamille?famille=${famille}`
    );
  }
  getStockBySfamille(sfamille: string): Observable<Stock> {
    return this.http.get<Stock>(
      `${this.baseUrl}/search/findBySfamille?sfamille=${sfamille}`
    );
  }
  getQteComm(code: string): Observable<Stock> {
    const params = new HttpParams().set("code", code);
    return this.http.get<Stock>(`${this.baseUrl}/search/getQteComm`, {
      params,
    });
  }
  findStocksForVente(
    codeArticle: string,
    quantite: string,
    codeFournisseur: string,
    codeFamille: string,
    codeSousFamille: string,
    codeMarque: string
  ) {
    const params = new HttpParams()
      .set("codeArticle", codeArticle)
      .set("quantite", quantite)
      .set("codeFournisseur", codeFournisseur)
      .set("codeFamille", codeFamille)
      .set("codeSousFamille", codeSousFamille)
      .set("codeMarque", codeMarque);
    return this.http.get<Stock[]>(`${this.baseUrl}/search/findStocksForVente`, {
      params,
    });
  }

  getListArticleNonStf(
    art: string,
    four: string,
    datedeb: string,
    datefin: string,
    numdevis: string,
    cltdev: string,
    vendeur: string,
    zone: string,
    secteur: string,
    groupe: string,
    mag: string,
    tycom: string,
    mntmin: string,
    mntmax: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set("art", art)
      .set("four", four)
      .set("datedeb", datedeb)
      .set("datefin", datefin)
      .set("numdevis", numdevis)
      .set("cltdev", cltdev)
      .set("vendeur", vendeur)
      .set("zone", zone)
      .set("secteur", secteur)
      .set("groupe", groupe)
      .set("mag", mag)
      .set("tycom", tycom)
      .set("mntmin", mntmin)
      .set("mntmax", mntmax);
    return this.http.get<any[]>(`${this.baseUrl}/search/getListArticleNonStf`, {
      params,
    });
  }

  getListArticleNonStfSupZero(
    art: string,
    four: string,
    datedeb: string,
    datefin: string,
    numdevis: string,
    cltdev: string,
    vendeur: string,
    zone: string,
    secteur: string,
    groupe: string,
    mag: string,
    tycom: string,
    mntmin: string,
    mntmax: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set("art", art)
      .set("four", four)
      .set("datedeb", datedeb)
      .set("datefin", datefin)
      .set("numdevis", numdevis)
      .set("cltdev", cltdev)
      .set("vendeur", vendeur)
      .set("zone", zone)
      .set("secteur", secteur)
      .set("groupe", groupe)
      .set("mag", mag)
      .set("tycom", tycom)
      .set("mntmin", mntmin)
      .set("mntmax", mntmax);
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getListArticleNonStfSupZero`,
      { params }
    );
  }

  getListArticleNonStfEgalZero(
    art: string,
    four: string,
    datedeb: string,
    datefin: string,
    numdevis: string,
    cltdev: string,
    vendeur: string,
    zone: string,
    secteur: string,
    groupe: string,
    mag: string,
    tycom: string,
    mntmin: string,
    mntmax: string
  ): Observable<any[]> {
    const params = new HttpParams()
      .set("art", art)
      .set("four", four)
      .set("datedeb", datedeb)
      .set("datefin", datefin)
      .set("numdevis", numdevis)
      .set("cltdev", cltdev)
      .set("vendeur", vendeur)
      .set("zone", zone)
      .set("secteur", secteur)
      .set("groupe", groupe)
      .set("mag", mag)
      .set("tycom", tycom)
      .set("mntmin", mntmin)
      .set("mntmax", mntmax);
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getListArticleNonStfEgalZero`,
      { params }
    );
  }

  getlistValorisationStockAll(D1: string, D2: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getlistValorisationStockAll?D1=${D1}&D2=${D2}`
    );
  }
  getlistValorisationStock(
    D1: string,
    D2: string,
    FOUR: string,
    FAM: string,
    SFAM: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getlistValorisationStock?D1=${D1}&D2=${D2}&FOUR=${FOUR}&FAM=${FAM}&SFAM=${SFAM}`
    );
  }

  getTotvalorisationStock(
    D1: string,
    D2: string,
    FOUR: string,
    FAM: string,
    SFAM: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getTotvalorisationStock?D1=${D1}&D2=${D2}&FOUR=${FOUR}&FAM=${FAM}&SFAM=${SFAM}`
    );
  }

  getTotvalorisationStockAll(D1: string, D2: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getTotvalorisationStockAll?D1=${D1}&D2=${D2}`
    );
  }
  getListstock(
    D1: string,
    D2: string,
    FOUR: string,
    FAM: string
  ): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getListstock?D1=${D1}&D2=${D2}&FOUR=${FOUR}&FAM=${FAM}`
    );
  }

  getListstockStable(op: string, fam: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/findStockStable?op=${op}&fam=${fam}`
    );
  }

  getStockMouv(
    D1: string,
    D2: string,
    FOUR: string,
    FAM: string
  ): Observable<any[]> {
    console.log(
      `${this.baseUrl}/search/getStockMouv?D1=${D1}&D2=${D2}&FOUR=${FOUR}&FAM=${FAM}`
    );
    return this.http.get<any[]>(
      `${this.baseUrl}/search/getStockMouv?D1=${D1}&D2=${D2}&FOUR=${FOUR}&FAM=${FAM}`
    );
  }
  getStockByNumAchat(numAchat: string): Observable<Stock> {
    const params = new HttpParams().set("numAchat", numAchat);
    return this.http.get<Stock>(`${this.baseUrl}/search/findStockByNumAchat`, {
      params,
    });
  }
}
