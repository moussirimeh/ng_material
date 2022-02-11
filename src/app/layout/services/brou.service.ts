import { Injectable, NgZone } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Brou } from './brou';
import { SoldeClient } from './soldeClient';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BrouService {
  private baseUrl = globals.apiBaseUrl + 'brous';
  private baseUrlAutomotive = localStorage.getItem('apiUrl') + 'automotive/rest/brous';
  private baseUrlHardware = localStorage.getItem('apiUrl') + 'hardware/rest/brous';

  constructor(private http: HttpClient, private ngZone: NgZone) {}


insertBrou(pie: string, cmp: string , mt: string, dte: string, nm: string, observat: string) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(`${this.baseUrl}/search/insertBrou?pie=${pie}&cmp=${cmp}&mt=${mt}&dte=${dte}&nm=${nm}&observat=${observat}`);
         }


// tslint:disable-next-line:max-line-length
getEtatParametres(Date1: string, Date2: string, typclt: string,
  codevend: string, piece: string, piece1: string, piece2: string , ap: string): Observable<any[]> {
  return this.http.get<any[]>
  // tslint:disable-next-line:max-line-length
  (`${this.baseUrl}/search/findEtatParametres?Date1=${Date1}&Date2=${Date2}&typclt=${typclt}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}&ap=${ap}`);
}


getEtatParametresTop600(Date1: string, Date2: string, typclt: string,
  codevend: string, piece: string, piece1: string, piece2: string , ap: string): Observable<any[]> {
  return this.http.get<any[]>
  // tslint:disable-next-line:max-line-length
  (`${this.baseUrl}/search/findEtatParametresTop600?Date1=${Date1}&Date2=${Date2}&typclt=${typclt}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}&ap=${ap}`);
}

// tslint:disable-next-line:max-line-length
getEtatParametre(from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametre?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
}


// tslint:disable-next-line:max-line-length
getEtatParametreNonApure(from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametreNonApure?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
}

// tslint:disable-next-line:max-line-length
getEtatParametreApure(from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
// tslint:disable-next-line:max-line-length
return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametreApure?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
}





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

  getEtatApurRegByPieces (compte: string, from: string, to: string, ap: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltByPiece?compte=${compte}&from=${from}&to=${to}&ap=${ap}`);
  }



  getEtatRegByPiece (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltByPiece?compte=${compte}&from=${from}&to=${to}`);
  }
  getEtatRegByPieceEtatRegClt (compte: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatRegCltByPieces?compte=${compte}&from=${from}&to=${to}`);
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

// findHistoriqueRegCltNonApure
getHistoriqueRegCltNonApure (compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findHistoriqueRegCltNonApure?compte=${compte}&from=${from}&to=${to}`);
}

getHistoriqueRegCltApure (compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findHistoriqueRegCltApure?compte=${compte}&from=${from}&to=${to}`);
}
getHistoriqueRegClt (compte: string, from: string, to: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/findHistoriqueRegClt?compte=${compte}&from=${from}&to=${to}`);
}


  getBrouList(): Observable<Brou[]> {
    return this.http.get<Brou[]>(`${this.baseUrl}/search/findByOrderByCompte`);
  }
  createBrou(brou: Brou): Observable<Brou> {
    console.log(brou);
    return this.http.post<Brou>(`${this.baseUrl}`, brou);
  }
  updateReglement(
    id: string,
    date: string,
    piece: string,
    montant: string,
    libelle: string,
    echeance: string,
    banque: string,
    numero: string,
    tire: string
  ) {
    return this.http.get(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/updatereglement?id=${id}&&date=${date}&&piece=${piece}&&montant=${montant}&&libelle=${libelle}&&echeance=${echeance}&&banque=${banque}&&numero=${numero}&&tire=${tire}`
    );
  }


  getCreanceClient(
    dat: string, zone: string, division: string, type: string, recouvreur: string, cd_gr: string, mode: string
    , vend: string, represen: string): Observable<any> {
    return this.http.get<any>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/creanceClient?dat=${dat}&zone=${zone}&division=${division}&type=${type}&recouvreur=${recouvreur}&cd_gr=${cd_gr}&mode=${mode}&vend=${vend}&represen=${represen}`
    );
  }


  getBatchClient(Date1: string, Date2: string, z: string, y: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/batchClient?Date1=${Date1}&Date2=${Date2}&z=${z}&y=${y}`);
  }

  // batchClientCont
  getBatchClientCont(Date1: string, Date2: string, z: string, y: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/batchClientCont?Date1=${Date1}&Date2=${Date2}&z=${z}&y=${y}`);
  }

  // batchClientCont
  /*getBatchClientCont(
    Date1: string,
    Date2: string,
    z: string,
    y: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search/batchClientCont?Date1=${Date1}&Date2=${Date2}&z=${z}&y=${y}`
    );
  }*/

  getTotalBatchClient(Date1: string, Date2: string, z: string, y: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/totalBatchClient?Date1=${Date1}&Date2=${Date2}&z=${z}&y=${y}`);
  }

  getTotalBatchClientCont(Date1: string, Date2: string, z: string, y: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/totalBatchClientCont?Date1=${Date1}&Date2=${Date2}&z=${z}&y=${y}`);
  }

  updateput(brou: Brou): Observable<any> {
    console.log(Brou);
    return this.http.put<Brou>(`${this.baseUrl}/${brou.id}`, brou);
  }
  delete(idd: string): Observable<{}> {
    return this.http.delete<Brou>(`${this.baseUrl}/${idd}`);
  }
  deleteBrou(id: string) {
    return this.http.get(`${this.baseUrl}/search/removeById?id=${id}`);
  }
  getMaxAppurement() {
    return this.http.get(`${this.baseUrl}/search/getMaxAppurement`);
  }
  getMaxId() {
    return this.http.get(`${this.baseUrl}/search/getMaxId`);
  }
  getHistTotalIMP(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/HistTotalIMP?compte=${compte}`
    );
  }
  getHistNombreIMP(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/HistNombreIMP?compte=${compte}`
    );
  }
  getTotalDebit(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/TotalDebit?compte=${compte}`
    );
  }
  getTotalCredit(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/TotalCredit?compte=${compte}`
    );
  }

  mouvement(compte: string, sens: string): Observable<Brou[]> {
    console.log('param ' + compte);
    console.log('param ' + sens);
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/findByCompteAndSensIsAndApurementIsNull?compte=${compte}&sens=${sens}`
    );
  }

  getMaxMorVer(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/maxMorVer`);
  }
  getMaxBorEnc(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/maxBorEnc`);
  }
  getMaxborRtr(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/maxborRtr`);
  }



  resulat(apurement: string, sens: string): Observable<Brou[]> {
    console.log('param ' + apurement);
    console.log('param ' + sens);
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/findByApurementAndSens?apurement=${apurement}&sens=${sens}`
    );
  }
  updateApp(maxapp1: string, id: string) {
    return this.http.get(
      `${this.baseUrl}/search/updateBrou?maxapp1=${maxapp1}&id=${id}`
    );
  }
  annulerApp(apurement: string) {
    console.log('param ' + apurement);
    return this.http.get(
      `${this.baseUrl}/search/annulerAppurement?apurement=${apurement}`
    );
  }
  reglement(
    compte: string,
    piece: string,
    from: string,
    to: string
  ): Observable<Brou[]> {
    console.log('param ' + compte);
    console.log('param ' + from);
    console.log('param ' + piece);

    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/findByCompteAndPieceAndDateBetween?compte=${compte}&piece=${piece}&from=${from}&to=${to}`
    );
  }
  getBrousDeblc2(cmpt: string, echean: string): Observable<any> {
    return this.http.get<Brou>(
      `${this.baseUrl}/search/findBrousDeblc2?cmpt=${cmpt}&echean=${echean}`
    );
  }
  mtchC(date: string): Observable<any> {
    return this.http.get<Brou>(`${this.baseUrl}/search/mtchC?date=${date}`);
  }
  mtchD(date: string): Observable<any> {
    return this.http.get<Brou>(`${this.baseUrl}/search/mtchD?date=${date}`);
  }
  mteC(date: string): Observable<any> {
    return this.http.get<Brou>(`${this.baseUrl}/search/mteC?date=${date}`);
  }
  mteD(date: string): Observable<any> {
    return this.http.get<Brou>(`${this.baseUrl}/search/mteD?date=${date}`);
  }
  getNumberOfFactsPortail(codeClient: string, lig: string) {
    return this.http.get<Brou>(
      `${this.baseUrl}/search/getNumberOfFactsPortail?codeClient=${codeClient}&lig=${lig}`
    );
  }
  getBrouByCompte(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/findByCompte?compte=${compte}`
    );
  }
  deleteBrouMultipe(idd: string[]): Observable<{}> {
    return this.http.delete(`${this.baseUrl}/${idd}`);
  }
  deleteByCompte(compte: string): Observable<{}> {
    return this.http.get(
      `${this.baseUrl}/search/deleteByCompte?compte=${compte}`
    );
  }
  getTotalIMP(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/TotalIMP?compte=${compte}`
    );
  }
  getNombreIMP(compte: string): Observable<Brou[]> {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/NombreIMP?compte=${compte}`
    );
  }
  transfertAuContentieux(compte: string) {
    return this.http.get(
      `${this.baseUrl}/search/transfertAuContentieux?compte=${compte}`);
  }
  controleClient(compte: string): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/search/controleClient?compte=${compte}`
    );
  }
  getSoldeClientForVente(
    codeClient: string,
    echeance: string
  ): Observable<SoldeClient[]> {
    // console.log(`${this.baseUrl}/search/getSoldeClientForVente?codeClient=${codeClient}&echeance=${echeance}`);
    return this.http.get<SoldeClient[]>(
      `${this.baseUrl}/search/getSoldeClientForVente?codeClient=${codeClient}&echeance=${echeance}`
    );
  }
  getSoldeClientForVenteAutomotive(
    codeClient: string,
    echeance: string
  ): Observable<SoldeClient[]> {
    return this.http.get<SoldeClient[]>(
      `${this.baseUrlAutomotive}/search/getSoldeClientForVente?codeClient=${codeClient}&echeance=${echeance}`
    );
  }
  getSoldeClientForVenteHardware(
    codeClient: string,
    echeance: string
  ): Observable<SoldeClient[]> {
    return this.http.get<SoldeClient[]>(
      `${this.baseUrlHardware}/search/getSoldeClientForVente?codeClient=${codeClient}&echeance=${echeance}`
    );
  }
  annulerTitreBrou(op: string , pc: string , nm: string
    , mnt: string  , id: string , dt: string , dt1: string  , ap: string , rg: string) {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/annulerTitreBrou?op=${op}&pc=${pc}&nm=${nm}&mnt=${mnt}&id=${id}&dt=${dt}&dt1=${dt1}&ap=${ap}&rg=${rg}`
    );
  }
  /**(obj.client , obj.piece
              , obj.numero, obj.montant, obj.id
              , obj.date, this.DateSys.toLocaleDateString('en-GB'), '0'
              , obj.regle) */


  RemplacerTitreBrou(op: string , pc2: string , nm2: string
    , mnt2: string  , dt1: string , dt2: string  , ap: string , rg: string , bnq: string , tire: string) {
    return this.http.get<Brou[]>(
      `${this.baseUrl}/search/RemplacerTitreBrou?op=${op}&pc2=${pc2}&nm2=${nm2}&mnt2=${mnt2}&dt1=${dt1}&dt2=${dt2}&ap=${ap}&rg=${rg}&bnq=${bnq}&tire=${tire}`
    );
  }

}
