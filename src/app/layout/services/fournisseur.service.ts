import { Injectable, NgZone } from '@angular/core';
import { Fournisseur } from './fournisseur';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { dataBound } from '@syncfusion/ej2-grids';
import { waitForMap } from '@angular/router/src/utils/collection';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FournisseurService {
  private baseUrl = globals.apiBaseUrl + 'fournisseurs';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  getCaMargesAnnCrntByFournisseur(
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
      `${this.baseUrl}/search/getCaMargesAnnCrntByFournisseur`,  {params}
    );
  }
  getCaMargesAnne1ByFournisseur(
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
      `${this.baseUrl}/search/getCaMargesAnne1ByFournisseur`, {params}
    );
  }
  getCaMargesAnne2ByFournisseur(
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
      `${this.baseUrl}/search/getCaMargesAnne2ByFournisseur`, {params}
    );
  }



  createFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(`${this.baseUrl}`, fournisseur);
  }
  getFourListe(deno: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`
    );
  }
  getFourList(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByOrderByCode`
    );
  }
  getFourListByDeno(deno: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByDenoStartsWith?deno=${deno}`
    );
  }

  findByOrderByDeno(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByOrderByDeno`
    );
  }
  getFournisseurListByOrderByDeno(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByOrderByDeno`
    );
  }
  getFourByCode(code: string): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }
  getFournisseursReleve(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByCodeLessThanOrCodeGreaterThanOrderByDeno?codeLess=418&codeGreater=7`
    );
  }
  getFournisseursListByTerme(terme: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByTerme?terme=${terme}`
    );
  }
  update(id: string, deno: string) {
    return this.http.get(
      `${this.baseUrl}/search/update?id=${id}&&deno=${deno}`
    );
  }
  updateFournisseur(fournisseur: Fournisseur): Observable<any> {
    return this.http.put<Fournisseur>(
      `${this.baseUrl}/${fournisseur.id}`,
      fournisseur
    );
  }
  updatee(fournisseur: Fournisseur): Observable<any> {
    console.log(fournisseur);
    return this.http.put<Fournisseur>(
      `${this.baseUrl}/${fournisseur.id}`,
      fournisseur
    );
  }
  delete(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteFournisseur?id=${id}`);
  }
  deleteFournisseur(fournisseur: Fournisseur) {
    return this.http.delete<Fournisseur>(`${this.baseUrl}/${fournisseur.id}`);
  }

  existsByCode(code: string) {
    return this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`);
  }

  existsByCode1(code: string): Observable<any> {
    let res;
    const req = new HttpRequest(
      'GET',
      `${this.baseUrl}/search/existsByCode?code=${code}`,
      { reportProgress: true }
    );
    this.http.request(req).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Requête envoyée');
          break;
        case HttpEventType.ResponseHeader:
          console.log('La réponse à été reçue !');
          break;
        case HttpEventType.DownloadProgress:
          const kbLoaded = Math.round(event.loaded / 1024);
          console.log(
            'Téléchargement en cours ! ' + kbLoaded + 'Kb téléchargé'
          );
          break;
        case HttpEventType.Response: {
          console.log('Requête terminée', event.body);
          res = this.http.get(
            `${this.baseUrl}/search/existsByCode?code=${code}`
          );
        }
      }
    });
    return res;
  }
  existsByCod(code: string) {
    this.http.get(`${this.baseUrl}/search/existsByCode?code=${code}`).pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }
  exists(code: string): any {
    this.http
      .get(`${this.baseUrl}/search/existsByCode?code=${code}`)
      .subscribe((data) => {
        this.ngZone.run(() => {
          return data;
        });
      });
  }
  getTotalQuestions(): Observable<any> {
    let totalQuestions: any;
    const subject = new Subject<string>();
    this.getFourList().subscribe((items) => {
      totalQuestions = items['_embedded'].fournisseurs;
      console.log(totalQuestions);
      subject.next(totalQuestions);
    });
    return subject.asObservable();
  }
  getDeno(code: string) {
    return this.http.get(`${this.baseUrl}/search/deno?code=${code}`);
  }
  FourByDeno(deno: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByDeno?deno=${deno}`
    );
  }
  FourByCode(code: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }
  FourList(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(
      `${this.baseUrl}/search/findByOrderByDeno`
    );
  }

  searchFournisseurByDenoStartsWith(deno: string) {
    return this.http.get<Fournisseur>(
      `${this.baseUrl}/search/findTop100ByDenoStartsWith?deno=${deno}`
    );
  }
  verifyToDelete(codeFour: string) {
    return this.http.get(
      `${this.baseUrl}/search/verifyToDelete?codeFour=${codeFour}`
    );
  }
}
