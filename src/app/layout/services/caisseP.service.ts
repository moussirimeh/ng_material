import { Injectable, NgZone } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { CaisseP } from './caisseP';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaissePService {
  private baseUrl = globals.apiBaseUrl + 'caisseP';

  constructor(private http: HttpClient, private ngZone: NgZone) {}

/*insertCaisseP(@Param("pie") String pie,
			          @Param("cmp") String cmp,
			          @Param("mt") String mt,
			          @Param("dte") String dte,
			          @Param("nm") String nm,
			          @Param("observat") String observat);*/

 insertCaisseP(pie: string, cmp: string, mt: string, dte: string, nm: string, observat: string) {
     return this.http.get(`${this.baseUrl}/search/insertCaisseP?pie=${pie}&cmp=${cmp}&mt=${mt}&dte=${dte}&nm=${nm}&observat=${observat}`);
          }
/*int insertCaisseP14(@Param("dt") String dt,
			          @Param("mnt") String mnt,
			          @Param("chq") String chq,
			          @Param("bnq") String bnq);*/
insertCaisseP14(dt: string, mnt: string, chq: string, bnq: string) {
                  return this.http.get(`${this.baseUrl}/search/insertCaisseP14?dt=${dt}&mnt=${mnt}&chq=${chq}&bnq=${bnq}`);
                       }
/*updateTresorerie(@Param("et") String et,
																										@Param("dt") String dt,
																										@Param("bv") String bv,
																										@Param("bqm") String bqm,
																										@Param("vid") String vid,
																										@Param("cs") String cs);

                                                    */
updateTresorerie(et: string, dt: string, bv: string, bqm: string, vid: string, cs: string) {
           return this.http.get(`${this.baseUrl}/search/updateTresorerie?et=${et}&dt=${dt}&bv=${bv}&bqm=${bqm}&vid=${vid}&cs=${cs}`);
   }
/*updateTresorerie8(@Param("et") String et,
																										@Param("dt") String dt,
																										@Param("be") String be,
																										@Param("vid") String vid,
																										@Param("cs") String cs);
	*/
updateTresorerie8(et: string, dt: string, be: string,  vid: string, cs: string) {
    return this.http.get(`${this.baseUrl}/search/updateTresorerie8?et=${et}&dt=${dt}&be=${be}&vid=${vid}&cs=${cs}`);
}
/*updateTresorerieRetourAttente(@Param("num") String num,
																										      @Param("vid") String vid,
																										      @Param("cs") String cs);
	*/
updateTresorerieRetourAttente(num: string, vid: string, cs: string) {
    return this.http.get(`${this.baseUrl}/search/updateTresorerieRetourAttente?et=${num}&vid=${vid}&cs=${cs}`);
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

// tslint:disable-next-line:max-line-length
getEtatParametreNonApure( from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
        // tslint:disable-next-line:max-line-length
        return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametreNonApure?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
    }

    // tslint:disable-next-line:max-line-length
getEtatParametreApure( from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametreApure?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
}

getEtatParametreTop500( from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
  // tslint:disable-next-line:max-line-length
  return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametreTop500?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
}

    // tslint:disable-next-line:max-line-length
getEtatParametre( from: string, to: string, codevend: string, piece: string, piece1: string, piece2: string): Observable<any[]> {
      // tslint:disable-next-line:max-line-length
      return this.http.get<any[]>(`${this.baseUrl}/search/findEtatParametre?from=${from}&to=${to}&codevend=${codevend}&piece=${piece}&piece1=${piece1}&piece2=${piece2}`);
    }


createCaisse(caisse: CaisseP): Observable<CaisseP> {
    return this.http.post<CaisseP>(`${this.baseUrl}`, caisse);
  }

  updateput(caisseP: CaisseP): Observable<any> {
    console.log('param' + caisseP);
    return this.http.put<CaisseP>(`${this.baseUrl}/${caisseP.id}`, caisseP);
  }
  updateApp(maxapp1: string, id: string) {
    return this.http.get(`${this.baseUrl}/search/updateApp?maxapp1=${maxapp1}&&id=${id}`);
  }
  getMaxAppurement() {
    return this.http.get(`${this.baseUrl}/search/getMaxAppurementCP`);
  }
  deleteCaisse(id: string): Observable<{}> {
    return this.http.delete<CaisseP>(`${this.baseUrl}/${id}`);
  }
  recetteCheque(date: string): Observable<CaisseP[]> {
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/recetteCheque?date=${date}`);
  }
  recetteEspece(date: string): Observable<CaisseP[]> {
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/recetteEspece?date=${date}`);
  }
   depenseCheque(date: string): Observable<CaisseP[]> {
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/depenseCheque?date=${date}`);
  }
  depenseEspece(date: string): Observable<CaisseP[]> {
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/depenseEspece?date=${date}`);
  }
  reglementTermeEspece(date: string): Observable<CaisseP[]> {
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/RegTermesEspece?date=${date}`);
  }
   reglementTermeCheque(date: string): Observable<CaisseP[]> {
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/RegTermesCheque?date=${date}`);
  }
  mouvementD(operateur: string): Observable<CaisseP[]> {
    console.log('param ' + operateur);

    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/caissePdebit?operateur=${operateur}`);
  }
  mouvementC(operateur: string): Observable<CaisseP[]> {
    console.log('param ' + operateur);

    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/caissePcredit?operateur=${operateur}`);
  }
  reglement(operateur: string, mode: string, from: string, to: string): Observable<CaisseP[]> {
    console.log('param ' + operateur);
    console.log('param ' + from);
    console.log('param ' + mode);

    return this.http.get<CaisseP[]>(
      // tslint:disable-next-line:max-line-length
      `${this.baseUrl}/search/findByOperateurAndModeContainingAndDateBetweenAndApurementIsNotNull?operateur=${operateur}&mode=${mode}&from=${from}&to=${to}`
    );
  }
  resulat1( operateur: string, apurement: string): Observable<CaisseP[]> {
    console.log('param ' + apurement);
    console.log('param ' + operateur);
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/result1?operateur=${operateur}&apurement=${apurement}`);
  }
  resulat2( operateur: string, apurement: string): Observable<CaisseP[]> {
    console.log('param ' + apurement);
    console.log('param ' + operateur);
    return this.http.get<CaisseP[]>(`${this.baseUrl}/search/result2?operateur=${operateur}&apurement=${apurement}`);
  }
  annulerApp(apurement: string) {
    console.log('param ' + apurement);
    return this.http.get(`${this.baseUrl}/search/annulerAppurement?apurement=${apurement}`);
  }


  annulerTitreCaisse(op: string  , pc: string , nm: string , mnt:  string
    , caisse: string , id: string , dt: string , dt1: string , ap: string , rg: string ) {
    return this.http.get(`${this.baseUrl}/search/annulerTitreCaisse?op=${op}&pc=${pc}&nm=${nm}&mnt=${mnt}&caisse=${caisse}&id=${id}
    &dt=${dt}&dt1=${dt1}&ap=${ap}&rg=${rg}`);
  }

  RemplacerTitreCaisse(op: string  , pc2: string , nm2: string , mnt2:  string
    , dt1: string , dt2: string , ap: string , rg: string , bnq: string , tire: string ) {
    return this.http.get(`${this.baseUrl}/search/RemplacerTitreCaisse?op=${op}&pc2=${pc2}&nm2=${nm2}&mnt2=${mnt2}
    &dt1=${dt1}&dt2=${dt2}&ap=${ap}&rg=${rg}&bnq=${bnq}&tire=${tire}`);
  }
}
