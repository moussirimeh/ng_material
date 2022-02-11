import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recettes } from './recettes';
import {ModifBSortie } from './ModifBSortie';
import { RecettelivrObservat } from './RecettelivrObserv';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecettesService {
  recettes: Recettes[] = [];
  private baseUrl = globals.apiBaseUrl + 'recettes';
  constructor(private http: HttpClient) {}
  getRecettesByCombine(combine: string): Observable<Recettes> {
    return this.http.get<Recettes>(`${this.baseUrl}/search/findByCombine?combine=${combine}`);
  }
  getRecettesListByOrderByCombine(): Observable<Recettes[]> {
    return this.http.get<Recettes[]>(`${this.baseUrl}/search/findByOrderByCombine`);
  }
  getReclivraisonByCombine(combine: string): Observable<Recettes> {
    return this.http.get<Recettes>(`${this.baseUrl}/search/getReclivraisonByCombine?combine=${combine}`);
  }
  getReclivraison(): Observable<Recettes> {
    return this.http.get<Recettes>(`${this.baseUrl}/search/getReclivraison`);
  }

  getRecettes(): Observable<Recettes[]> {
    return this.http.get<Recettes[]>(`${this.baseUrl}`);
  }

  createRecettes(recettes: Recettes): Observable<Recettes> {
    return this.http.post<Recettes>(`${this.baseUrl}`, recettes);
  }

  updateRecettes(recette: Recettes): Observable<Recettes> {
    return this.http.put<Recettes>(`${this.baseUrl}/${recette.id}`, recette);
  }



  deleteRecettes(code: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${code}`, { responseType: 'text' });
  }
 // services Bons de sortie et livraison

  getRecBonSortie(bonsort: string): Observable<ModifBSortie[]> {
    return this.http.get<ModifBSortie[]>(`${this.baseUrl}/search/getRecBonSortie?bonSort=${bonsort}`);
  }

  getRecBonSortieOuvert(bonsort: string): Observable<ModifBSortie[]> {
    return this.http.get<ModifBSortie[]>(`${this.baseUrl}/search/getRecBonSortieOuvert?bonSort=${bonsort}`);
  }
  duplicataBS(bonsort: string): Observable<ModifBSortie[]> {
    return this.http.get<ModifBSortie[]>(`${this.baseUrl}/search/duplicataBS?bonSort=${bonsort}`);
  }

  deleteBSRecettes(bonsort: string, id: string): Observable<any> {
    return this.http.get<string>(`${this.baseUrl}/search/DeleteBonSortie?bonSort=${bonsort}&id=${id}`);
  }
  deleteAllBSRecettes(bonsort: string): Observable<any> {
    return this.http.get<string>(`${this.baseUrl}/search/annulerBS?bonSort=${bonsort}`);
}
  rechercheRecettes(from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/rechercheAvoirComptantCaisse?from=${from}&to=${to}`);
  }

  modifLivrObservatBS(lo: string, bonSort: string, comb: string): Observable<any> {
    return this.http.get<string>(`${this.baseUrl}/search/modifLivrObservatBS?livrObservat=${lo}&bonSort=${bonSort}&combine=${comb}`);
  }

  modifLivrObservat(lo: string, comb: string): Observable<any> {
    return this.http.get<string>(`${this.baseUrl}/search/modifLivrObservat?livrObservat=${lo}&combine=${comb}`);
  }
  // services rapport livraison

getRecRapLivraisonLivrTout(d1: string, d2: string, op: string , v: string, c: string, zn: string, livr: string   ): Observable<any> {
            return this.http.get<Recettes []>
            (`${this.baseUrl}/search/getRecRapLivraisonLivrTout?d1=${d1}&d2=${d2}&op=${op}&v=${v}&c=${c}&zn=${zn}&livr=${livr}`);
          }

getRecRapLivraisonNonLivr(d1: string, d2: string, op: string , v: string, c: string, zn: string, livr: string   ): Observable<any> {
            return this.http.get<Recettes []>
            (`${this.baseUrl}/search/getRecRapLivraisonNonLivr?d1=${d1}&d2=${d2}&op=${op}&v=${v}&c=${c}&zn=${zn}&livr=${livr}`);
          }
// Details  BL EN COURS
getblEnCoursByCombine(d1: string): Observable<any> {
            return this.http.get<any>
            (`${this.baseUrl}/search/findblEnCoursByCombine?combine=${d1}`);
          }
// BL EN COURS
getblEnCours(d1: string, d2: string, d3: string , d4: string, d5: string, d6: string): Observable<any> {
            return this.http.get<any>
            (`${this.baseUrl}/search/findblEnCours?d1=${d1}&d2=${d2}&d3=${d3}&d4=${d4}&d5=${d5}&d6=${d6}`);
          }

// services analyse chiffre d'affaires des ventes
getRecAnalyseCAVend(vend: string, date1: string, date2: string ) {
  console.log(`${this.baseUrl}/search/getRecAnalyseCAVend?vend=${vend}&date1=${date1}&date2=${date2}`);

        return this.http.get
        (`${this.baseUrl}/search/getRecAnalyseCAVend?vend=${vend}&date1=${date1}&date2=${date2}`);
      }
// services wiem  liste 1 Reception BL
updatelivrObserv(recette: RecettelivrObservat): Observable<Recettes> {
  return this.http.patch<Recettes>(`${this.baseUrl}/${recette.id}`, recette);
}
getBLAVOIRNonRecu( date1: String, date2: String) {
  return this.http.get
        (`${this.baseUrl}/search/getBLAVOIRNonRecu?date1=${date1}&date2=${date2}`);
}
getBLAVOIRNonRecuFA( date1: String, date2: String) {
  return this.http.get
        (`${this.baseUrl}/search/getBLAVOIRNonRecuFA?date1=${date1}&date2=${date2}`);
}
//// service liste 2 Reception Bl

getBLAvoir( date1: String, date2: String) {
  return this.http.get
        (`${this.baseUrl}/search/getBLAvoir?date1=${date1}&date2=${date2}`);
}
getBLAvoirFA( date1: String, date2: String) {
  return this.http.get
        (`${this.baseUrl}/search/getBLAvoirFA?date1=${date1}&date2=${date2}`);
}
/// service lista 3 Bl AVOIR Recus non Fact
getBLAvoirRecuNonFact( date1: String, date2: String) {
  return this.http.get
        (`${this.baseUrl}/search/getBLAvoirRecuNonFact?date1=${date1}&date2=${date2}`); }

SommeFactVendeur(vend: string, date1: string, date2: string ): Observable<any> {
  /*
  console.log('serv somme fact ', this.http.get<any>
  (`${this.baseUrl}/search/SommeFactVendeur?vend=${vend}&date1=${date1}&date2=${date2}`));*/

        return this.http.get<any>
        (`${this.baseUrl}/search/SommeFactVendeur?vend=${vend}&Date1=${date1}&Date2=${date2}`);

      }
SommeAVOIRpi3Vendeur(vend: string, date1: string, date2: string ): Observable<any> {
        return this.http.get<any>
        (`${this.baseUrl}/search/SommeAVOIRpi3Vendeur?vend=${vend}&Date1=${date1}&Date2=${date2}`);
      }
SommeAVOIRVendeur(vend: string, date1: string, date2: string ): Observable<any> {
        return this.http.get<any>
        (`${this.baseUrl}/search/SommeAVOIRVendeur?vend=${vend}&Date1=${date1}&Date2=${date2}`);
      }
SommeBLVendeur(vend: string, date1: string, date2: string ): Observable<any> {
        return this.http.get<any>
        (`${this.baseUrl}/search/SommeBLVendeur?vend=${vend}&date1=${date1}&date2=${date2}`);
      }
getNumberOfBlsPortail(codeClient: string, etat: string) {
    return this.http.get<Recettes>(
      `${this.baseUrl}/search/getNumberOfBlsPortail?codeClient=${codeClient}&etat=${etat}`
    );
  }
rechercheAvoirsComptant(from: string , to: string) {
    return this.http.get(`${this.baseUrl}/search/rechercheAvoirComptant?from=${from}&to=${to}`);
  }
  deleteRecetteByCombine(combine: string) {
    return this.http.get(`${this.baseUrl}/search/deleteByCombine?combine=${combine}`);
  }
  deleteBL(bl: string) {
    return this.http.get(`${this.baseUrl}/search/deleteBL?bl=${bl}`);
  }
  getRecettesForCs(): Observable<Recettes> {
    return this.http.get<Recettes>(`${this.baseUrl}/search/getRecettesForCs`);
  }
}
