import { Injectable } from "@angular/core";
import { AffectationRecouvrement } from "./affectationRecouvrement";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class AffectationRecouvrementService {
  private baseUrl = globals.apiBaseUrl + "affectationRecouvrement";

  constructor(private http: HttpClient) {}
  createAffectationRecouvrement(
    affectationRecouvrement: AffectationRecouvrement
  ): Observable<AffectationRecouvrement> {
    return this.http.post<AffectationRecouvrement>(
      `${this.baseUrl}`,
      affectationRecouvrement
    );
  }
  updateAffectationRecouvrement(
    affectationRecouvrement: AffectationRecouvrement
  ): Observable<any> {
    return this.http.put<AffectationRecouvrement>(
      `${this.baseUrl}/${affectationRecouvrement.numMission}`,
      affectationRecouvrement
    );
  }
  deleteAffectationRecouvrement(
    affectationRecouvrement: AffectationRecouvrement
  ) {
    return this.http.delete<AffectationRecouvrement>(
      `${this.baseUrl}/${affectationRecouvrement.numMission}`
    );
  }
  getAffectationRecouvrementByNumMission(
    numMission: string
  ): Observable<AffectationRecouvrement[]> {
    return this.http.get<AffectationRecouvrement[]>(
      `${this.baseUrl}/search/findByNumMission?numMission=${numMission}`
    );
  }
  getAffectationRecouvrementByCodeClt(
    codeClt: string
  ): Observable<AffectationRecouvrement[]> {
    return this.http.get<AffectationRecouvrement[]>(
      `${this.baseUrl}/search/findByCodeClt?codeClt=${codeClt}`
    );
  }
  getFirstAffectationRecouvrementByCodeCltAndCodeSituation(
    codeClt: string,
    codeSituation: string
  ): Observable<AffectationRecouvrement> {
    return this.http.get<AffectationRecouvrement>(
      `${this.baseUrl}/search/findFirst1ByCodeCltAndCodeSituation?codeClt=${codeClt}&codeSituation=${codeSituation}`
    );

  }
  getMissionsRecouv(
    codeClt: string,
    codeInitiateur: string,
    codeDestinataire: string,
    codeSituation: string,
    lue: string,
    dateFin: string
  ) {
    return this.http.get(
      `${this.baseUrl}/search/getMissionsRecouv?codeClt=${codeClt}&codeInitiateur=${codeInitiateur}&codeDestinataire=${codeDestinataire}&codeSituation=${codeSituation}&lue=${lue}&dateFin=${dateFin}`
    );
  }
}
