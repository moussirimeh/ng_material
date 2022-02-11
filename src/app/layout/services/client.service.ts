import { Injectable, NgZone } from '@angular/core';
import { Client } from './client';
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
export class ClientService {
  private baseUrl = globals.apiBaseUrl + 'clients';

  constructor(private http: HttpClient, private ngZone: NgZone) {}
  // tslint:disable-next-line:max-line-length
  getCaMargesAnne1ByClient(
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
  ): Observable<Client[]> {

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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnne1ByClient`, {params}); }


  getCaMargesAnne2ByClient(
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
  ): Observable<Client[]> {

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

    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnne2ByClient`, {params}); }

  getCaMargesByClient(
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
  ): Observable<Client[]> {
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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesByClient`, {params});
  }



  getCaMargesAnnCrntByMagClt(
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
  ): Observable<Client[]> {


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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnnCrntByMagClt`, {params});
  }
  // tslint:disable-next-line:max-line-length
  getCaMargesAnne1ByMagClt(
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
  ): Observable<Client[]> {
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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnne1ByMagClt`, {params});
  }
  getCaMargesAnne2ByMagClt(
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
  ): Observable<Client[]> {

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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnne2ByMagClt`, {params});

  }


  getCaMargesAnnCrntBytypeCommClt(
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
  ): Observable<Client[]> {

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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnnCrntBytypeCommClt`, {params});
  }
  // tslint:disable-next-line:max-line-length
  getCaMargesAnne1BytypeCommClt(
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
  ): Observable<Client[]> {

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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnne1BytypeCommClt`, {params});
  }
  getCaMargesAnne2BytypeCommClt(
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
  ): Observable<Client[]> {

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
    return this.http.get<Client[]>(`${this.baseUrl}/search/getCaMargesAnne2BytypeCommClt`, {params});
  }









  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}`, client);
  }
  getClientsList(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }


  getClientsComptants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findCltComptants`);
  }

  getClientsTermes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findCltTermes`);
  }


  getClientsListByOrderByDeno(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByOrderByDeno`);
  }

  getClientTerme() {
    return this.http.get(`${this.baseUrl}/search/listClientActRecouv`);
  }
  getClientsTop100ByDenoStartsWith(deno: string): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/findTop100ByDenoStartsWith?deno=${deno}`
    );
  }
  getClientsReleve(): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/findByCodeLessThanOrCodeGreaterThanOrderByDeno?codeLess=418&codeGreater=7`
    );
  }
  listClientActRecMult(): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/listClientActRecMult`
    );
  }
  getClientsListByTerme(terme: string): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/findByTerme?terme=${terme}`
    );
  }
  update(id: string, deno: string) {
    return this.http.get(
      `${this.baseUrl}/search/update?id=${id}&&deno=${deno}`
    );
  }
  updateClient(client: Client): Observable<any> {
    return this.http.put<Client>(`${this.baseUrl}/${client.id}`, client);
  }
  updatee(client: Client): Observable<any> {
    console.log(client);
    return this.http.put<Client>(`${this.baseUrl}/${client.id}`, client);
  }
  delete(id: string) {
    return this.http.get(`${this.baseUrl}/search/deleteClient?id=${id}`);
  }
  deleteClient(client: Client) {
    return this.http.delete<Client>(`${this.baseUrl}/${client.id}`);
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
    this.getClientsList().subscribe((items) => {
      totalQuestions = items['_embedded'].clients;
      console.log(totalQuestions);
      subject.next(totalQuestions);
    });
    return subject.asObservable();
  }
  getDeno(code: string) {
    return this.http.get(`${this.baseUrl}/search/deno?code=${code}`);
  }
  getClientByCode(code: string): Observable<Client> {
    return this.http.get<Client>(
      `${this.baseUrl}/search/findByCode?code=${code}`
    );
  }
  getClientList(deno: String) {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/findTop100ByDenoStartsWith?deno=${deno}`
    );
  }
  getClientListOrdinairesOrderByDeno() {
    return this.http.get<Client[]>(`${this.baseUrl}/search/findCltOrdinairesOrderByDeno`);
  }
  getClientListByCode(code: String) {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/findTop100ByCodeStartsWith?code=${code}`
    );
  }
  getClientsBydeno(deno: string) {
    return this.http.get(
      `${this.baseUrl}/search/findTop100ByDeno?deno=${deno}`
    );
  }
  getClientsListOrdByDeno(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search/findByOrderByDeno`);
  }
  getClientsListOrdByCode(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  rechercherClient(
    zone: string,
    division: string,
    secteur: string,
    typeComm: string,
    nature: string,
    vendeur: string,
    code_groupe: string
  ) {
    return this.http
      .get(`${this.baseUrl}/search/rechercherClient?zone=${zone}&division=${division}
    &secteur=${secteur}&typeComm=${typeComm}&nature=${nature}&vendeur=${vendeur}&code_groupe=${code_groupe}`);
  }
  searchClientByDenoStartsWith(deno: string) {
    return this.http.get<Client>(
      `${this.baseUrl}/search/findTop100ByDenoStartsWith?deno=${deno}`
    );
  }
  listOffreClient() {
    return this.http.get<any>(`${this.baseUrl}/search/listOffresClient`);
  }
  listClientsFournisseur(fournisseur: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/listClientsFournisseur?fournisseur=${fournisseur}`
    );
  }
  listClientsArticle(code: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/listClientsArticle?code=${code}`
    );
  }
  getClientsByTermeOrderByDeno(terme: string): Observable<Client[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/findByTermeOrderByDeno?terme=${terme}`
    );
  }
  getClientsTermeListByOrderByDeno(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search/clientsTermeList`);
  }
  getClientsComptantListByOrderByDeno(): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/clientsComptantList`
    );
  }

  // services determination typoClt
  findByOrderByCa123Desc(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/search/findByOrderByCa123Desc`
    );
  }
  updateClientsTypeI(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/updateClientsTypeI`);
  }

  updateNouvMagCa123(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/updateNouvMagCa123`);
  }
  updateMagClt(typeClt: string, cltcodes: string[]): Observable<any> {
    return this.http.get(
      `${
        this.baseUrl
      }/search/updateMagClt?typeClt=${typeClt}&cltcodes=${cltcodes.join(',')}`
    );
  }
  getClientsAffectationRecouvrementByOrderByDeno(): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/clientsAffectationRecouvrement`
    );
  }
  getClientsComptantListByOrderByDenoForVente(except: string): Observable<Client[]> {
    return this.http.get<Client[]>(
      `${this.baseUrl}/search/clientsComptantListVente?except=${except}`
    );
  }
  getClientsReservListByOrderByDeno(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search/clientsReservList`);
  }

  listeDetailClient( zone_client: string, code_client: string,  groupe_client ,
   tva_client: string, cin_gerant_client: string , nom_gerant_client: string ): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/search/listeDetailClient?zone_client=${zone_client}
    &code_client=${code_client}&groupe_client=${groupe_client}
    &tva_client=${tva_client}&cin_gerant_client=${cin_gerant_client}&nom_gerant_client=${nom_gerant_client}`);
  }
}
