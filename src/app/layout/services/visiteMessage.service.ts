import { Injectable } from '@angular/core';
import { VisiteMessage } from './visiteMessage';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisiteMessageService {
  private baseUrl = globals.apiBaseUrl + 'visiteMessage';

  constructor(private http: HttpClient) {}
  createVisiteMessage(visiteMessage: VisiteMessage): Observable<VisiteMessage> {
    return this.http.post<VisiteMessage>(`${this.baseUrl}`, visiteMessage);
  }
  updateVisiteMessage(visiteMessage: VisiteMessage): Observable<any> {
    return this.http.put<VisiteMessage>(
      `${this.baseUrl}/${visiteMessage.id}`,
      visiteMessage
    );
  }
  deleteVisiteMessage(visiteMessage: VisiteMessage) {
    return this.http.delete<VisiteMessage>(
      `${this.baseUrl}/${visiteMessage.id}`
    );
  }
  getVisiteMessageByNumVisite(numVisite: string): Observable<VisiteMessage[]> {
    return this.http.get<VisiteMessage[]>(
      `${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`
    );
  }
  getVisiteMessageByNumVisiteAndRubrique(
    numVisite: string,
    rubrique: string
  ): Observable<VisiteMessage[]> {
    return this.http.get<VisiteMessage[]>(
      `${this.baseUrl}/search/findByNumVisiteAndRubrique?numVisite=${numVisite}&rubrique=${rubrique}`
    );
  }
  getMesMessagesEnvoyes(
    user: string,
    dateDebut: string,
    dateFin: string,
    envoyeA: string,
    numVisite: string,
    rubrique: string,
    codeClt: string,
    messageLu: string,
    reponseLu: string,
    arriveeReponse: string,
    depassementDelais: string
  ) {
    console.log(
`${this.baseUrl}/search/getMesMessagesEnvoyes?user=${user}&dateDebut=${dateDebut}&dateFin=${dateFin}&envoyeA=${envoyeA}&numVisite=${numVisite}&rubrique=${rubrique}&codeClt=${codeClt}&messageLu=${messageLu}&reponseLu=${reponseLu}&arriveeReponse=${arriveeReponse}&depassementDelais=${depassementDelais}`
    );

    return this.http.get<VisiteMessage[]>(
      `${this.baseUrl}/search/getMesMessagesEnvoyes?user=${user}&dateDebut=${dateDebut}&dateFin=${dateFin}&envoyeA=${envoyeA}&numVisite=${numVisite}&rubrique=${rubrique}&codeClt=${codeClt}&messageLu=${messageLu}&reponseLu=${reponseLu}&arriveeReponse=${arriveeReponse}&depassementDelais=${depassementDelais}`
    );
  }
  getVisiteMessageByNumVisiteAndRubriqueAndEnvoyeParAndEnvoyeA(
    numVisite: string,
    rubrique: string,
    envoyePar: string,
    envoyeA: string
  ): Observable<VisiteMessage[]> {
    return this.http.get<VisiteMessage[]>(
      `${this.baseUrl}/search/findByNumVisiteAndRubriqueAndEnvoyeParAndEnvoyeA?numVisite=${numVisite}&rubrique=${rubrique}&envoyePar=${envoyePar}&envoyeA=${envoyeA}`
    );
  }
}
