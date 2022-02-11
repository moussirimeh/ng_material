import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MouveinventService {
  private baseUrl = globals.apiBaseUrl + 'mouvesinvent';
  constructor(private http: HttpClient, private ngZone: NgZone) {}
  findByCombine(combine: string) {
    return this.http.get(
      `${this.baseUrl}/search/findByCombine?combine=${combine}`
    );
  }

  getlistStockinv() {
    return this.http.get(`${this.baseUrl}/search/getlistStockinv`);
  }

  getInvCode(coderef: string, invent: string) {
    const params = new HttpParams()
      .set('coderef', coderef)
      .set('invent', invent);
    return this.http.get(`${this.baseUrl}/search/getInvCode`, { params });
  }

  getInvCombine(coderef: string, invent: string) {
    const params = new HttpParams()
      .set('coderef', coderef)
      .set('invent', invent);
    return this.http.get(`${this.baseUrl}/search/getInvCombine`, { params });
  }

  insertMouveInvent(
    c1: string,
    c2: string,
    c3: string,
    c4: string,
    c5: string,
    c6: string
  ) {
    const params = new HttpParams()
      .set('c1', c1)
      .set('c2', c2)
      .set('c3', c3)
      .set('c4', c4)
      .set('c5', c5)
      .set('c6', c6);
      console.log(params);

    return this.http.get(
      `${this.baseUrl}/search/insertMouveInvent`, {params}
    );
  }

  getMaxrang(combine: string) {
    return this.http.get(
      `${this.baseUrl}/search/getMaxrang?combine=${combine}`
    );
  }

  updateChangementINV(qte: string, id: string) {
    return this.http.get(
      `${this.baseUrl}/search/updateChangementINV?qte=${qte}&id=${id}`
    );
  }

  // service du mise a jour BD inventaire
  updateemplacement(emp: string, cod: string) {
    const params = new HttpParams().set('emp', emp).set('cod', cod);
    return this.http.get(`${this.baseUrl}/search/updateemplacement`, {
      params,
    });
  }
  getlisteem(cd: string) {
    return this.http.get(`${this.baseUrl}/search/getlisteem?cd=${cd}`);
  }

  getlistemp() {
    return this.http.get(`${this.baseUrl}/search/getlistemp`);
  }

  updatemplacement() {
    // ?invent=${invent}       invent: string
    return this.http.get(`${this.baseUrl}/search/updatemplacement`);
  }
  getEmlacementInvt(combine: string) {
    return this.http.get(
      `${this.baseUrl}/search/getEmlacementInvt?combine=${combine}`
    );
  }
  // service etat inv with four
  getlistwithfour(four: string) {
    return this.http.get(`${this.baseUrl}/search/getlistwithfour?four=${four}`);
  }

  getlistwithfourQteDiff(four: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourQteDiff?four=${four}`
    );
  }
  getlistwithfourQteEgal(four: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourQteEgal?four=${four}`
    );
  }
  getlistwithfourNotInvnt(four: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourNotInvnt?four=${four}&invent=${invent}`
    );
  }
  getlistwithfourNotInvntQteDiff(four: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourNotInvntQteDiff?four=${four}&invent=${invent}`
    );
  }

  getlistwithfourNotInvntQteEgal(four: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourNotInvntQteEgal?four=${four}&invent=${invent}`
    );
  }
  getlistwithfourInvnt(four: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourInvnt?four=${four}&invent=${invent}`
    );
  }
  getlistwithfourInvntQteDiff(four: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourInvntQteDiff?four=${four}&invent=${invent}`
    );
  }
  getlistwithfourInvntQteEgal(four: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithfourInvntQteEgal?four=${four}&invent=${invent}`
    );
  }
  // service etat inv with Emp

  getlistwithEmpQteDiff(Emp: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpQteDiff?Emp=${Emp}`
    );
  }

  getlistwithEmpInvntQteDiff(Emp: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpInvntQteDiff?Emp=${Emp}&invent=${invent}`
    );
  }

  getlistwithEmpNotInvntQteDiff(Emp: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpNotInvntQteDiff?Emp=${Emp}&invent=${invent}`
    );
  }

  getlistwithEmpInvntQteEgal(Emp: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpInvntQteEgal?Emp=${Emp}&invent=${invent}`
    );
  }

  getlistwithEmpQteEgal(Emp: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpQteEgal?Emp=${Emp}`
    );
  }

  getlistwithEmpNotInvntQteEgal(Emp: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpNotInvntQteEgal?Emp=${Emp}&invent=${invent}`
    );
  }
  getlistwithEmp(Emp: string) {
    return this.http.get(`${this.baseUrl}/search/getlistwithEmp?Emp=${Emp}`);
  }
  getlistwithEmpNotInvnt(Emp: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpNotInvnt?Emp=${Emp}&invent=${invent}`
    );
  }

  getlistwithEmpInvnt(Emp: string, invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistwithEmpInvnt?Emp=${Emp}&invent=${invent}`
    );
  }

  getlistQteDiff() {
    return this.http.get(`${this.baseUrl}/search/getlistQteDiff`);
  }
  getlistQteEgal() {
    return this.http.get(`${this.baseUrl}/search/getlistQteEgal`);
  }

  getlistetatinventaire() {
    return this.http.get(`${this.baseUrl}/search/getlistetatinventaire`);
  }
  getlistNotInventQteDiff(invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistNotInventQteDiff?invent=${invent}`
    );
  }
  getlistInventQteDiff(invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistInventQteDiff?invent=${invent}`
    );
  }
  getlistNotInventQteEgal(invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistNotInventQteEgal?invent=${invent}`
    );
  }
  getlistInventQteEgal(invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistInventQteEgal?invent=${invent}`
    );
  }
  getlistInvent(invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistInvent?invent=${invent}`
    );
  }
  getlistNotInvent(invent: string) {
    return this.http.get(
      `${this.baseUrl}/search/getlistNotInvent?invent=${invent}`
    );
  }
  getsumInv() {
    return this.http.get(`${this.baseUrl}/search/getsumInv`);
  }
  getlistValeurAchat() {
    return this.http.get(`${this.baseUrl}/search/getlistValeurAchat`);
  }
  getListeArticlesInvent(code: string) {
    const params = new HttpParams().set('code', code);
    return this.http.get(`${this.baseUrl}/search/getListeArticlesInvent`, {
      params,
    });
  }
  createMouveInvent(mouveInvent: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, mouveInvent);
}
}
