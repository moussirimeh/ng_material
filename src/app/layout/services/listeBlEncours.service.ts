import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListeBlEncours } from './listeBlEncours';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListeBlEncoursService {
  private baseUrl = globals.apiBaseUrl + 'listeBlEncours';

  constructor(private http: HttpClient) {}

  getListeBlsEncours(
    dateDebut: string,
    dateFin: string,
    vendeur: string,
    zone: string,
    operateur: string,
    typeComm: string
  ): Observable<ListeBlEncours> {
    return this.http.get<ListeBlEncours>(
      `${this.baseUrl}/search/listeBlsEncours?dateDebut=${dateDebut}&dateFin=${dateFin}&vendeur=${vendeur}&zone=${zone}&operateur=${operateur}&typeComm=${typeComm}`
    );
  }
}
