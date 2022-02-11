import { Injectable } from "@angular/core";
import { VisiteSujetTraite } from "./visiteSujetTraite";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class VisiteSujetTraiteService {
  private baseUrl = globals.apiBaseUrl + "visiteSujetTraite";

  constructor(private http: HttpClient) {}
  createVisiteSujetTraite(
    visiteSujetTraite: VisiteSujetTraite
  ): Observable<VisiteSujetTraite> {
    return this.http.post<VisiteSujetTraite>(
      `${this.baseUrl}`,
      visiteSujetTraite
    );
  }
  updateVisiteSujetTraite(
    visiteSujetTraite: VisiteSujetTraite
  ): Observable<any> {
    return this.http.put<VisiteSujetTraite>(
      `${this.baseUrl}/${visiteSujetTraite.id}`,
      visiteSujetTraite
    );
  }
  deleteVisiteSujetTraite(visiteSujetTraite: VisiteSujetTraite) {
    return this.http.delete<VisiteSujetTraite>(
      `${this.baseUrl}/${visiteSujetTraite.id}`
    );
  }
  getVisiteSujetTraiteByNumVisite(
    numVisite: string
  ): Observable<VisiteSujetTraite[]> {
    return this.http.get<VisiteSujetTraite[]>(
      `${this.baseUrl}/search/findByNumVisite?numVisite=${numVisite}`
    );
  }

  getVisiteSujetTraiteByNumVisiteAndRubrique(
    numVisite: string,
    rubrique: string
  ) {
    return this.http.get<VisiteSujetTraite[]>(
      `${this.baseUrl}/search/findByNumVisiteAndRubrique?numVisite=${numVisite}&rubrique=${rubrique}`
    );
  }
}
