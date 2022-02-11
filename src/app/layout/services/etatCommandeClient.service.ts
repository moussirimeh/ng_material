import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EtatCommandeClient } from './etatCommandeClient';
import { SuivicmdsClient } from './suivicmdclient';
import { SuivicmdsRep } from './SuivicmdsRep';
import { SuivicmdsArticles } from './SuivicmdsArticles';
import { globals } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EtatCommandeClientService {
    private baseUrl = globals.apiBaseUrl + 'etatCommandeClient';

    constructor(private http: HttpClient) { }

      RechCmd(
        date_debut: string,
        date_fin: string,
        cmd_clt: string,
        cmd_eqm: string,
        code_clt: string,
        code_rep: string,
        selectedradiobtcmdQPES: string,
        selectedradiobtcmd: string,
        code_art: string,
        selectedradiobtart: string,
        code_frn: string,
        selectedradiobtfrn: string): Observable<EtatCommandeClient[]> {
          const params = new HttpParams()
          .set('date_debut', date_debut)
          .set('date_fin', date_fin)
          .set('cmd_clt', cmd_clt)
          .set('cmd_eqm', cmd_eqm)
          .set('code_clt', code_clt)
          .set('code_rep', code_rep)
          .set('selectedradiobtcmdQPES', selectedradiobtcmdQPES)
          .set('selectedradiobtcmd', selectedradiobtcmd)
          .set('code_art', code_art)
          .set('selectedradiobtart', selectedradiobtart)
          .set('code_frn', code_frn)
          .set('selectedradiobtfrn', selectedradiobtfrn);

        return this.http.get<EtatCommandeClient[]>(
        `${this.baseUrl}/search/RechCmd`, {params}); }


        GetSuivicmdsRep( date_debut: string, date_fin: string, code_rep: string): Observable<SuivicmdsRep[]> {
          return this.http.get<SuivicmdsRep[]>(
          `${this.baseUrl}/search/GetSuivicmdsRep?date_debut=${date_debut}&date_fin=${date_fin}
         &code_rep=${code_rep}
        `); }


        GetSuivicmdsClient( date_debut: string, date_fin: string, code_clt: string): Observable<SuivicmdsClient[]> {
          return this.http.get<SuivicmdsClient[]>(
          `${this.baseUrl}/search/GetSuivicmdsClient?date_debut=${date_debut}&date_fin=${date_fin}
         &code_clt=${code_clt}
        `); }


      GetSuivicmdArticle( numCmdEqm: string): Observable<SuivicmdsArticles[]> {
       return this.http.get<SuivicmdsArticles[]>(
       `${this.baseUrl}/search/GetSuivicmdArticle?numCmdEqm=${numCmdEqm}
      `); }


        deletecommande() {
          return this.http.get(`${this.baseUrl}/search/deletecommande`);
         }

         deletecomm() {
          return this.http.get(`${this.baseUrl}/search/deletecommande`);
         }
}
