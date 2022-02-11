import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mouve } from './mouve';
import { LivraisonPiece } from './LivraisonPiece';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MouveService {
    private baseUrl = globals.apiBaseUrl + 'mouves';

  constructor(private http: HttpClient) { }

  getQteDS() {
    return this.http.get(`${this.baseUrl}/search/getQteCD`);

  }

  getAchatByCombine(combine: String) {
    return this.http.get(`${this.baseUrl}/search/getAchatByCombine?cbn=${combine}`);
  }
  getQteCDbyCode(code: string) {
    const params = new HttpParams()
    .set('code', code)
    ;
  return this.http
  .get(`${this.baseUrl}/search/getQteCDbyCode`, {params});
  }
  getInventaireByCode(coderef: string) {
    const params = new HttpParams()
    .set('coderef', coderef)
    ;
  return this.http
  .get(`${this.baseUrl}/search/getInventaireByCode`, {params});
  }
  getVentAuComptant(coderef: string) {
    const params = new HttpParams()
    .set('coderef', coderef)
    ;
    return this.http.get(`${this.baseUrl}/search/getVentAuComptant`, {params});
  }
  getVenteATerme(coderef: string) {
    const params = new HttpParams()
    .set('coderef', coderef)
    ;
    return this.http.get(`${this.baseUrl}/search/getVenteATerme`, {params});
  }
  getAchats(coderef: string) {
    const params = new HttpParams()
    .set('coderef', coderef)
    ;
    return this.http.get(`${this.baseUrl}/search/getAchats`, {params});
  }
  getAjustements(coderef: string) {
    const params = new HttpParams()
    .set('coderef', coderef)
    ;
    return this.http.get(`${this.baseUrl}/search/getAjustements`, {params});
  }
  getCaMrgTypoClt(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByTypoClt?d1=${d1}&d2=${d2}`);
  }

  getCaMrgRepresan(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByRepresan?d1=${d1}&d2=${d2}`);
  }
  getCaMrgSecteur(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffBySecteur?d1=${d1}&d2=${d2}`);
  }
  getCaMrgZone(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByZone?d1=${d1}&d2=${d2}`);
  }

  getCaMrgSfamille(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffBySfamille?d1=${d1}&d2=${d2}`);
  }

  getCaMrgFamille(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByFamille?d1=${d1}&d2=${d2}`);
  }
  getCaMrgVendeur(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByVendeur?d1=${d1}&d2=${d2}`);
  }
  getCaMrgFournisseur(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByFournisseur?d1=${d1}&d2=${d2}`);
  }

  getCaMrgStock(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByStock?d1=${d1}&d2=${d2}`);
  }

  getCaMrgClient(d1: String, d2: String) {
    return this.http.get(`${this.baseUrl}/search/findChiffAffByClient?d1=${d1}&d2=${d2}`);
  }



  updateQTE() {
    return this.http.get(`${this.baseUrl}/search/updateQTE`);
  }


  createMouve(mouve: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, mouve);
}

  updateFusion(code1: string, code2: string) {
    const params = new HttpParams()
    .set('code1', code1)
    .set('code2', code2);
    return this.http.get(`${this.baseUrl}/search/updateFusion`, {params});
}
getMouveByCode (code: string) {
  const params = new HttpParams()
  .set('code', code);
  return this.http.get(`${this.baseUrl}/search/findByCode`, {params});
}


getMouveBLEnCours (combine: String): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/search/findMouveBLEnCours?combine=${combine}`);
}

// getCaVendeurSecteur fiche vendeur
getCaVendeurSecteur (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurSecteur?d1=${d1}&d2=${d2}&vend=${vend}`);
}


// getCaVendeurZone fiche vendeur
getCaVendeurZone (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurZone?d1=${d1}&d2=${d2}&vend=${vend}`);
}

// getCaVendeurSfamillefiche vendeur
getCaVendeurSfamille (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurSfamille?d1=${d1}&d2=${d2}&vend=${vend}`);
}
// getCaVendeurMouve fiche vendeur
getCaVendeurMouve (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurMouve?d1=${d1}&d2=${d2}&vend=${vend}`);
}


// getCaVendeurFour fiche vendeur
getCaVendeurFour (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurFour?d1=${d1}&d2=${d2}&vend=${vend}`);
}


// getCaVendeurFamille fiche vendeur
getCaVendeurClient (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurClient?d1=${d1}&d2=${d2}&vend=${vend}`);
}



// getCaVendeurFamille fiche vendeur
getCaVendeurFamille (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurFamille?d1=${d1}&d2=${d2}&vend=${vend}`);
}



// getCaVendeurRepresan fiche vendeur
getCaVendeurRepresan (d1: String, d2: String, vend: String) {
  return this.http.get(`${this.baseUrl}/search/getCaVendeurRepresan?d1=${d1}&d2=${d2}&vend=${vend}`);
}



getMouveByCombine (combine: String) {
  return this.http.get(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
}
ConsulterReservation (operateur: String, code: String, numbc: String) {
  return this.http.get(`${this.baseUrl}/search/consulterReservation?operateur=${operateur}&code=${code}&numbc=${numbc}`);
}
deleteMouveById(id: string): Observable<{}> {
  return this.http.delete<Mouve>(`${this.baseUrl}/${id}`);
}
DeterminerMaxRang() {
  return this.http.get(`${this.baseUrl}/search/rang`);
}

getLivraisonPiece(combine: string): Observable<LivraisonPiece> {
  return this.http.get<LivraisonPiece>(`${this.baseUrl}/search/getLivraisonPiece?combine=${combine}`);
}
getRapportAchat1( datef: string, dated: string, codeArticle: string ) {
  const params = new HttpParams()
  .set('datef', datef)
  .set('dated', dated)
  .set('codeArticle', codeArticle);
  return this.http.get(`${this.baseUrl}/search/getRapportAchat1`, {params});
}
getRapportAchat2( datef: string, dated: string, codeFour: string ) {
  return this.http.get(`${this.baseUrl}/search/getRapportAchat2?datef=${datef}&dated=${dated}&codeFour=${codeFour}`);
}
getRapportAchat3( datef: string, dated: string, codeArticle: string, codeFour: string ) {
  const params = new HttpParams()
  .set('datef', datef)
  .set('dated', dated)
  .set('codeArticle', codeArticle)
  .set('codeFour', codeFour);
  return this.http.get(`${this.baseUrl}/search/getRapportAchat3`, {params});
}
getRapportAchat4( datef: string, dated: string ) {
  return this.http.get(`${this.baseUrl}/search/getRapportAchat4?datef=${datef}&dated=${dated}`);
}
getRapportVente1( datef: string, dated: string, codeArticle: string ) {
  const params = new HttpParams()
  .set('datef', datef)
  .set('dated', dated)
  .set('codeArticle', codeArticle);
  return this.http.get(`${this.baseUrl}/search/getRapportVente1`, {params});
}
getRapportVente2( datef: string, dated: string, codeClt: string ) {
  return this.http.get(`${this.baseUrl}/search/getRapportVente2?datef=${datef}&dated=${dated}&codeClt=${codeClt}`);
}
getRapportVente3( datef: string, dated: string, codeArticle: string, codeClt: string ) {
  const params = new HttpParams()
  .set('datef', datef)
  .set('dated', dated)
  .set('codeArticle', codeArticle)
  .set('codeClt', codeClt) ;
  return this.http.get(`${this.baseUrl}/search/getRapportVente3`, {params});
}
getRapportVente4( datef: string, dated: string ) {
  return this.http.get(`${this.baseUrl}/search/getRapportVente4?datef=${datef}&dated=${dated}`);
}
getRedictionAchats( numAchat: string ) {
  return this.http.get(`${this.baseUrl}/search/getReeditionRapportAchats?numAchat=${numAchat}`);
}
getMouveByCodeForConsultationRef(coderef: string) {
  const params = new HttpParams()
  .set('coderef', coderef);
  return this.http.get(`${this.baseUrl}/search/getMouveByCodeForConsultationRef`, {params});

}
rapportAjustements(date1: string, date2: string, coderef: string) {
  const params = new HttpParams()
  .set('date1', date1)
  .set('date2', date2)
  .set('coderef', coderef);
  return this.http.get(`${this.baseUrl}/search/rapportAjustements`, {params});
}
// rapportAPerte

rapportAPerte(date1: string, date2: string, pour: string, fourniss: string,
              famill: string, sfamill: string, codeArtic: string, codevend: string, coderepres: string) {
                const params = new HttpParams()
                .set('dateDebut', date1)
                .set('dateFin', date2)
                .set('pour', pour)
                .set('operateur', fourniss)
                .set('famille', famill)
                .set('sfamille', sfamill)
                .set('article', codeArtic)
                .set('vendeur', codevend)
                .set('representant', coderepres)
                ;
  return this.http
  .get(`${this.baseUrl}/search/venteAperte`, {params});
}


deleteMouveByCombine(combine: string) {
  return this.http.get(`${this.baseUrl}/search/deleteByCombine?combine=${combine}`);
}

getMouveWithDateSatisf() {
  return this.http.get(`${this.baseUrl}/search/getMouveWithDateSatisf`);
}

updateQtoffre(qteOffre: string , combine: string , code: string ) {
  const params = new HttpParams()
  .set('qteOffre', qteOffre)
  .set('combine', combine)
  .set('code', code)
  ;
return this.http
.get(`${this.baseUrl}/search/updateQtoffre`, {params});
}
getMouveByCombineOrderByRang (combine: String) {
  return this.http.get(`${this.baseUrl}/search/findByCombineOrderByRang?combine=${combine}`);
}
getArticlesForModifBl(combine: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/search/getArticlesForModifBl?combine=${combine}`);
}
}
