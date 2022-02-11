import { Injectable } from '@angular/core';
import { Visite } from './visite';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisiteService {
  private baseUrl = globals.apiBaseUrl + 'visites';

  constructor(private http: HttpClient) {}
  createVisite(visite: Visite): Observable<Visite> {
    return this.http.post<Visite>(`${this.baseUrl}`, visite);
  }
  updateVisite(visite: Visite): Observable<any> {
    return this.http.put<Visite>(`${this.baseUrl}/${visite.numVisite}`, visite);
  }
  deleteVisite(visite: Visite) {
    return this.http.delete<Visite>(`${this.baseUrl}/${visite.numVisite}`);
  }
  deleteVisiteByCode(numVisite: string): Observable<{}> {
    return this.http.delete<Visite>(`${this.baseUrl}/${numVisite}`);
  }
  getVisiteByClt(codeClt: string): Observable<Visite[]> {
    return this.http.get<Visite[]>(`${this.baseUrl}/search/findByCodeClt?codeClt=${codeClt}`);
  }
  getVisiteByNumVisite(numVisite: string): Observable<Visite> {
    return this.http.get<Visite>(`${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`);
  }
  getSujetsVisite() {
    return this.http.get(`${this.baseUrl}/search/getSujetsVisite`);
  }
  supprimerVisite(numVisite: string) {
    return this.http.get(`${this.baseUrl}/search/supprimerVisite?numVisite=${numVisite}`);
  }
  enregDateReelleEtPresence(
    dateReelle: string,
    heureFinReelle: string,
    presencePart1: string,
    presencePart2: string,
    presencePart3: string,
    numVisite: string
  ) {
    return this.http.get(
      `${this.baseUrl}/search/enregDateReelleEtPresence?dateReelle=${dateReelle}&heureFinReelle=${heureFinReelle}&presencePart1=${presencePart1}&presencePart2=${presencePart2}&presencePart3=${presencePart3}&numVisite=${numVisite}`
    );
  }
  getMaxNumVisite() {
    return this.http.get(`${this.baseUrl}/search/findMaxNumVisite`);
  }
  getVisitesForEnregVisite(
    dateDebut: string,
    dateFin: string,
    numVisite: string,
    codeClt: string,
    codeProgrammeePar: string,
    codePart: string,
    etat: string
  ) {
    return this.http.get(
      `${this.baseUrl}/search/getVisitesForEnregVisite?dateDebut=${dateDebut}&dateFin=${dateFin}&numVisite=${numVisite}&codeClt=${codeClt}&codeProgrammeePar=${codeProgrammeePar}&codePart=${codePart}&etat=${etat}`
    );
  }
  getVisitesForConsultVisite(
    dateDebut: string,
    dateFin: string,
    numVisite: string,
    codeClt: string,
    codeProgrammeePar: string,
    codePart: string,
    etat: string,
    etat2: string
  ) {
    return this.http.get(
      `${this.baseUrl}/search/getVisitesForConsultVisite?dateDebut=${dateDebut}&dateFin=${dateFin}&numVisite=${numVisite}&codeClt=${codeClt}&codeProgrammeePar=${codeProgrammeePar}&codePart=${codePart}&etat=${etat}&etat2=${etat2}`
    );
  }
  rechercheVisite (codepersonne: string , from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/rechercheVisite?codepersonne=${codepersonne}&from=${from}&to=${to}`);

  }

  getVisitesNonEnregistres (codepersonne: string, codeClt: string) {
    return this.http.get(`${this.baseUrl}/search/getVisitesNonEnregistres?codepersonne=${codepersonne}&codeClt=${codeClt}`);

  }

}
