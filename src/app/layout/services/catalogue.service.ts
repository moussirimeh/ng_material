import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalogue } from './catalogue';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {
  private baseUrl = globals.apiBaseUrl + 'catalogues';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  catalogueByCode(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${this.baseUrl}/search/catalogueByCode?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByDesign(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${this.baseUrl}/search/catalogueByDesign?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByCodeEnCommande(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignEnCommande(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeNonCommande(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignNonCommande(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockNull(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockNull?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockDispo(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockDispo?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockAlerte(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockAlerte?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockNegatif(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockNegatif?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockNull(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockNull?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockDispo(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param0 ' + codefour, 'param1 ' +  codefamille, 'param2 ' + codesfamille, 'param3 ' + codemarque);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockDispo?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockAlerte(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockAlerte?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockNegatif(codefour: string, codefamille: string, codesfamille: string, codemarque: string): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockNegatif?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockNullEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockNullEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockDispoEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockDispoEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockAlerteEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockAlerteEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockNegatifEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockNegatifEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockNullEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockNullEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockDispoEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockDispoEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByDesignStockAlerteEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockAlerteEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByDesignStockNegatifEnCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockNegatifEnCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockNullNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockNullNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockDispoNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockDispoNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
  catalogueByCodeStockAlerteNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockAlerteNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByCodeStockNegatifNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByCodeStockNegatifNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByDesignStockNullNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockNullNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByDesignStockDispoNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockDispoNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByDesignStockAlerteNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockAlerteNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }

  catalogueByDesignStockNegatifNonCommande(
    codefour: string,
    codefamille: string,
    codesfamille: string,
    codemarque: string
  ): Observable<Catalogue[]> {
    console.log('param ' + codefour);

    return this.http.get<Catalogue[]>(
      `${
        this.baseUrl
      }/search/catalogueByDesignStockNegatifNonCommande?codeOp=${codefour}&codeFam=${codefamille}&codeSfam=${codesfamille}&codeMarque=${codemarque}`
    );
  }
}
