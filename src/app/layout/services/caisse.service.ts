import { Injectable, NgZone } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { Caisse } from './caisse';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaisseService {
  private baseUrl = globals.apiBaseUrl + 'caisses';

  
  constructor(private http: HttpClient, private ngZone: NgZone) {}

  getEtatToutApurRegClt(ap: Number, op: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatToutApurRegCltCompt?ap=${ap}&op=${op}&date1=${from}&date2=${to}`);
  }
  getEtatToutApurRegClt500(ap: Number, op: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findEtatToutApurRegCltCompt500?ap=${ap}&op=${op}&date1=${from}&date2=${to}`);
  }
  getEtatSommeDCApurRegCltCompt(ap: Number, op: string, from: string, to: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findSommeEtatApurRegCltComp?ap=${ap}&op=${op}&date1=${from}&date2=${to}`);
  }

  createCaisse(caisse: Caisse): Observable<Caisse> {
    return this.http.post<Caisse>(`${this.baseUrl}`, caisse);
  }

  updateput(caisse: Caisse): Observable<any> {
    console.log(Caisse);
    return this.http.put<Caisse>(`${this.baseUrl}/${caisse.id}`, caisse);
  }
  getMaxAppurement() {
    console.log('testt');
    return this.http.get(`${this.baseUrl}/search/getMaxAppurement`);

  }
  updateApp(maxapp1: string, id: string) {
    return this.http.get(`${this.baseUrl}/search/updateApp?maxapp1=${maxapp1}&&id=${id}`);
  }
  deleteCaisse(id: string): Observable<{}> {
    return this.http.delete<Caisse>(`${this.baseUrl}/${id}`);
  }
  // totalRecettesCheque
  getTotalRecettesCheque(date1: string, date2: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/totalRecettesCheque?date1=${date1}&date2=${date2}`);
  }

  getTotalRecettesEspece(date1: string, date2: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/totalRecettesEspece?date1=${date1}&date2=${date2}`);
  }
  getTotalRecettes(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/TotalRecettes?date=${date}`);
  }
  getTotalDepenses(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/TotalDepenses?date=${date}`);
  }
  reglementTerme(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/RegTermes?date=${date}`);
  }
  reglementTermeEspece(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/RegTermesEspece?date=${date}`);
  }
   reglementTermeCheque(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/RegTermesCheque?date=${date}`);
  }
  recetteCheque(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/recetteCheque?date=${date}`);
  }
  recetteEspece(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/recetteEspece?date=${date}`);
  }
   depenseCheque(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/depenseCheque?date=${date}`);
  }
  depenseEspece(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/depenseEspece?date=${date}`);
  }
  receptionCheque(date: string, mode: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/findByDateAndMode?date=${date}&mode=${mode}`);
  }
  RegComptR(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/RegCmptR?date=${date}`);
  }
  RegComptD(date: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/RegCmptD?date=${date}`);
  }
  mouvementD(operateur: string): Observable<Caisse[]> {
    console.log('param ' + operateur);

    return this.http.get<Caisse[]>(`${this.baseUrl}/search/caisseDebit?operateur=${operateur}`);
  }
  mouvementC(operateur: string): Observable<Caisse[]> {
    console.log('param ' + operateur);

    return this.http.get<Caisse[]>(`${this.baseUrl}/search/caisseCredit?operateur=${operateur}`);
  }
  reglement(operateur: string, mode: string, from: string, to: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/findByOperateurAndModeContainingAndDateBetweenAndApurementIsNotNull?operateur=${operateur}&mode=${mode}&from=${from}&to=${to}`
    );
  }
  resulat1( operateur: string, apurement: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/result1?operateur=${operateur}&apurement=${apurement}`);
  }
  resulat2( operateur: string, apurement: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/result2?operateur=${operateur}&apurement=${apurement}`);
  }
  annulerApp(apurement: string) {
    return this.http.get(`${this.baseUrl}/search/annulerAppurement?apurement=${apurement}`);
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


  echeanceCheque(date1: string, date2: string): Observable<Caisse[]> {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/echeanceCheque?from=${date1}&to=${date2}`);
  }


  getListbytitre(datevalp: String , datevals: String , d1: String , d2: String , pc: String , op: String  ) {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/getListbytitre?datevalp=${datevalp}
    &datevals=${datevals}&d1=${d1}&d2=${d2}&pc=${pc}&op=${op}`);
  }
  getListbytitrebyClient(datevalp: String , datevals: String , d1: String , d2: String , pc: String , op: String  ) {
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/getListbytitrebyClient?datevalp=${datevalp}
    &datevals=${datevals}&d1=${d1}&d2=${d2}&pc=${pc}&op=${op}`);
  }

  updtaEtatCaisse(op: String , pc: String , nm: String , caisse: String  , id: String , dt: String ): Observable<Caisse[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Caisse[]>(`${this.baseUrl}/search/updtaEtatCaisse?op=${op}&pc=${pc}&nm=${nm}&caisse=${caisse}&id=${id}&dt=${dt}`); }


reImpressionBord( b_v: string, b_e: string, b_r: string): Observable<any[]> {
   return this.http.get<any[]>(`${this.baseUrl}/search/reImpressionBord?b_v=${b_v}&b_e=${b_e}&b_r=${b_r}`);
 }



  getListeCaiseTresorerie(d1: string, d2: string, pc: string, et: string, bqm: string,
     op: string,  b_v: string, b_e: string, b_r: string, mnt: string, ech1: string, ech2: string): Observable<any[]> {
    return this.http.get<any[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/findListeCaisseTresorerie?d1=${d1}&d2=${d2}&pc=${pc}&et=${et}&bqm=${bqm}&op=${op}&b_v=${b_v}&b_e=${b_e}&b_r=${b_r}&mnt=${mnt}&ech1=${ech1}&ech2=${ech2}`
     // `${this.baseUrl}/search/findListeCaisseTresorerie?d1=01/04/2021&d2=16/04/2021&pc&et=&bqm=&op=&pech=&b_v=&b_e=&b_r=`
      );
  }


  getListeCaiseTresorerie800(d1: string, d2: string, pc: string, et: string, bqm: string,
    op: string,  b_v: string, b_e: string, b_r: string, mnt: string, ech1: string, ech2: string ): Observable<any[]> {
   return this.http.get<any[]>(
     // tslint:disable-next-line:max-line-length
     `${this.baseUrl}/search/findListeCaisseTresorerieTop800?d1=${d1}&d2=${d2}&pc=${pc}&et=${et}&bqm=${bqm}&op=${op}&b_v=${b_v}&b_e=${b_e}&b_r=${b_r}&mnt=${mnt}&ech1=${ech1}&ech2=${ech2}`
    // `${this.baseUrl}/search/findListeCaisseTresorerie?d1=01/04/2021&d2=16/04/2021&pc&et=&bqm=&op=&pech=&b_v=&b_e=&b_r=`
     );
 }

}
