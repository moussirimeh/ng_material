import { Injectable, NgZone } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BrouCont } from './brouCont';
import { HttpHeaders } from '@angular/common/http';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrouContService {
  private baseUrl = globals.apiBaseUrl + 'brouCont';




  getEtatApurRegCltCreditByPiece(compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatApurRegCltCreditByPiece?compte=${compte}&from=${from}&to=${to}`);
  }
  getEtatNonApurRegCltCreditByPiece(compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatNonApurRegCltCreditByPiece?compte=${compte}&from=${from}&to=${to}`);
  }

  getEtatApurRegCltDebitByPiece(compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatApurRegCltDebitByPiece?compte=${compte}&from=${from}&to=${to}`);
  }
  getEtatNonApurRegCltDebitByPiece(compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatNonApurRegCltDebitByPiece?compte=${compte}&from=${from}&to=${to}`);
  }


getEtatApurRegClt(compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatApurRegClt?compte=${compte}&from=${from}&to=${to}`);
}

getEtatApurRegClt500(compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatApurRegClt500?compte=${compte}&from=${from}&to=${to}`);
}

getEtatNonApurRegClt(compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatNonApurRegClt?compte=${compte}&from=${from}&to=${to}`);
}

getEtatNonApurRegClt500(compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatNonApurRegClt500?compte=${compte}&from=${from}&to=${to}`);
}

getEtatToutApurRegClt(compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatToutApurRegClt?compte=${compte}&from=${from}&to=${to}`);
}
getEtatToutApurRegClt500(compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatToutApurRegClt500?compte=${compte}&from=${from}&to=${to}`);
}





  // creanceClientCont

  getCreanceClientCont(
    dat: string, zone: string, division: string, type: string, recouvreur: string, cd_gr: string, mode: string
    , vend: string, represen: string): Observable<any> {
    return this.http.get<any>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/creanceClientCont?dat=${dat}&zone=${zone}&division=${division}&type=${type}&recouvreur=${recouvreur}&cd_gr=${cd_gr}&mode=${mode}&vend=${vend}&represen=${represen}`
    );
  }






  getEtatRegCltToutDebit (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltToutDebit?compte=${compte}&from=${from}&to=${to}`);
  }
  getEtatRegCltToutDebitCredit (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltToutDebitCredit?compte=${compte}&from=${from}&to=${to}`);
  }

  getEtatRegCltToutCredit (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltToutCredit?compte=${compte}&from=${from}&to=${to}`);
  }



  getEtatRegCltDebitByPiece (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltDebitByPiece?compte=${compte}&from=${from}&to=${to}`);
  }

  getEtatRegCltCreditByPiece (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltCreditByPiece?compte=${compte}&from=${from}&to=${to}`);
  }
  getEtatRegByPiece (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltByPiece?compte=${compte}&from=${from}&to=${to}`);
  }

  getEtatRegCltDebit (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltDebit?compte=${compte}&from=${from}&to=${to}`);
  }
  getEtatRegCltDebitCredit (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltDebitCredit?compte=${compte}&from=${from}&to=${to}`);
  }

  getEtatRegCltCredit (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltCredit?compte=${compte}&from=${from}&to=${to}`);
  }






  constructor(private http: HttpClient, private ngZone: NgZone) {}
  createBrouCont(brouCont: BrouCont): Observable<BrouCont> {
    return this.http.post<BrouCont>(`${this.baseUrl}`, brouCont);
  }
  updateput(brou: BrouCont): Observable<any> {
    return this.http.put<BrouCont>(`${this.baseUrl}/${brou.id}`, brou);
  }
  deleteBrou(id: string) {
    return this.http.get(`${this.baseUrl}/search/removeById?id=${id}`);
  }
  mtcc(date: string): Observable<any> {
    return this.http.get<BrouCont>(`${this.baseUrl}/search/mtcc?date=${date}`);
  }
  mtce(date: string): Observable<any> {
    return this.http.get<BrouCont>(`${this.baseUrl}/search/mtce?date=${date}`);
  }
  reglement(
    compte: string,
    piece: string,
    from: string,
    to: string
  ): Observable<BrouCont[]> {
    console.log('param ' + compte);
    console.log('param ' + from);
    console.log('param ' + piece);

    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/findByCompteAndPieceAndDateBetween?compte=${compte}&piece=${piece}&from=${from}&to=${to}`
    );
  }
  resulat(apurement: string, sens: string): Observable<BrouCont[]> {
    console.log('param ' + apurement);
    console.log('param ' + sens);
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/findByApurementAndSens?apurement=${apurement}&sens=${sens}`
    );
  }
  annulerApp(apurement: string) {
    console.log('param ' + apurement);
    return this.http.get(
      `${this.baseUrl}/search/annulerAppurement?apurement=${apurement}`
    );
  }
  mouvement(compte: string, sens: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/findByCompteAndSensAndApurementIsNull?compte=${compte}&sens=${sens}`
    );
  }
  updateApp(maxapp1: string, id: string) {
    return this.http.get(
      `${this.baseUrl}/search/updateBrou?maxapp1=${maxapp1}&id=${id}`
    );
  }
  getMaxAppurement() {
    return this.http.get(`${this.baseUrl}/search/getMaxAppurement`);
  }
  getHistTotalIMP(compte: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/HistTotalIMP?compte=${compte}`
    );
  }
  getHistNombreIMP(compte: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/HistNombreIMP?compte=${compte}`
    );
  }
  getTotalDebit(compte: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/TotalDebit?compte=${compte}`
    );
  }
  getTotalCredit(compte: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/TotalCredit?compte=${compte}`
    );
  }
  getMaxId() {
    return this.http.get(`${this.baseUrl}/search/getMaxId`);
  }
  private _getHeaders(): Headers {
    const header = new Headers({
      'Content-Type': 'application/json',
    });

    return header;
  }
  createBrouContMultiple(brouConts: any) {
    return this.http.post(`${this.baseUrl}`, brouConts);
  }
  getTotalIMP(compte: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/TotalIMP?compte=${compte}`
    );
  }
  getNombreIMP(compte: string): Observable<BrouCont[]> {
    return this.http.get<BrouCont[]>(
      `${this.baseUrl}/search/NombreIMP?compte=${compte}`
    );
  }
}
