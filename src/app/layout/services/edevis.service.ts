import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class EdevisService {
    private baseUrl = globals.apiBaseUrl + 'edevis';

  constructor(private http: HttpClient) { }

  listDetailOffreClient(client: string) {
    return this.http.get<any>(`${this.baseUrl}/search/listDetailOffreClient?client=${client}`);
  }
  listDetailOfrCltFour(client: string, fournisseur: string) {
    return this.http.get<any>(`${this.baseUrl}/search/listDetailOfrCltFour?client=${client}&fournisseur=${fournisseur}`);
  }
  listDetailOfrCltArticle(client: string, code: string) {
    const params = new HttpParams()
    .set('client', client)
    .set('code', code);
    return this.http.get<any>(`${this.baseUrl}/search/listDetailOfrCltArticle`, {params});
  }

  listeOffreClient(codeclt: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/search/findByCltDev?cltDev=${codeclt} `);
  }
  createEdevis(edevis: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, edevis);
  }
  evaluationClient(client: string) {
    return this.http.get<any>(`${this.baseUrl}/search/evaluationClient?client=${client}`);
  }
  findByNumDev(numDev: string) {
    return this.http.get<any>(`${this.baseUrl}/search/findByNumDev?numDev=${numDev}`);
  }
  updateEdevis(edevis: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${edevis.id}`, edevis);
  }

listeOffrebyNum(codeclt: string): Observable<any[]> {

  return this.http.get<any[]>(`${this.baseUrl}/search/findByCltDev?cltDev=${codeclt} `);
}
updateAgenda(agenda: string , numdev: string): Observable<any[]> {

  return this.http.get<any[]>(`${this.baseUrl}/search/updateAgenda?agenda=${agenda}&numdev=${numdev} `);
}

getListOffreEnvoyewitharticle(datedeb: string , datefin: string , codeart: string , dev: string , client: string , vendeur: string ,
 four: string , zone: string , secteur: string , groupe: string , represant: string , typol: string ,
 typcom: string , mntmin: string , mntmax: string ): Observable<any[]> {
  const params = new HttpParams()
  .set('datedeb', datedeb)
  .set('datefin', datefin)
  .set('codeart', codeart)
  .set('dev', dev)
  .set('client', client)
  .set('vendeur', vendeur)
  .set('four', four)
  .set('zone', zone)
  .set('secteur', secteur)
  .set('groupe', groupe)
  .set('represant', represant)
  .set('typol', typol)
  .set('typcom', typcom)
  .set('mntmin', mntmin)
  .set('mntmax', mntmax);
  return this.http.get<any[]>(`${this.baseUrl}/search/getListOffreEnvoyewitharticle `, {params});
}
getListOffreEnvoyewitharticleTop100(datedeb: string , datefin: string , codeart: string , dev: string , client: string , vendeur: string ,
  four: string , zone: string , secteur: string , groupe: string , represant: string , typol: string ,
  typcom: string , mntmin: string , mntmax: string ): Observable<any[]> {
   const params = new HttpParams()
   .set('datedeb', datedeb)
   .set('datefin', datefin)
   .set('codeart', codeart)
   .set('dev', dev)
   .set('client', client)
   .set('vendeur', vendeur)
   .set('four', four)
   .set('zone', zone)
   .set('secteur', secteur)
   .set('groupe', groupe)
   .set('represant', represant)
   .set('typol', typol)
   .set('typcom', typcom)
   .set('mntmin', mntmin)
   .set('mntmax', mntmax);
   return this.http.get<any[]>(`${this.baseUrl}/search/getListOffreEnvoyewitharticleTop100`, {params});
 }
 getTotauxOffreEnvoyewitharticle(datedeb: string , datefin: string , codeart: string , dev: string , client: string , vendeur: string ,
  four: string , zone: string , secteur: string , groupe: string , represant: string , typol: string ,
  typcom: string , mntmin: string , mntmax: string ): Observable<any[]> {
   const params = new HttpParams()
   .set('datedeb', datedeb)
   .set('datefin', datefin)
   .set('codeart', codeart)
   .set('dev', dev)
   .set('client', client)
   .set('vendeur', vendeur)
   .set('four', four)
   .set('zone', zone)
   .set('secteur', secteur)
   .set('groupe', groupe)
   .set('represant', represant)
   .set('typol', typol)
   .set('typcom', typcom)
   .set('mntmin', mntmin)
   .set('mntmax', mntmax);
   return this.http.get<any[]>(`${this.baseUrl}/search/getTotauxOffreEnvoyewitharticle`, {params});
 }
getListOffreEnvoyewithoutarticle(datedeb: string , datefin: string , dev: string , client: string , vendeur: string ,
  four: string , zone: string , secteur: string , groupe: string , represant: string , typol: string ,
  typcom: string , mntmin: string , mntmax: string ): Observable<any[]> {
   const params = new HttpParams()
   .set('datedeb', datedeb)
   .set('datefin', datefin)
   .set('dev', dev)
   .set('client', client)
   .set('vendeur', vendeur)
   .set('four', four)
   .set('zone', zone)
   .set('secteur', secteur)
   .set('groupe', groupe)
   .set('represant', represant)
   .set('typol', typol)
   .set('typcom', typcom)
   .set('mntmin', mntmin)
   .set('mntmax', mntmax);
   return this.http.get<any[]>(`${this.baseUrl}/search/getListOffreEnvoyewithoutarticle`, {params});
}
getListOffreEnvoyewithoutarticleTop100(datedeb: string , datefin: String , dev: String , client: String , vendeur: String ,
  four: String , zone: String , secteur: String , groupe: String , represant: String , typol: String ,
  typcom: String , mntmin: String , mntmax: String ): Observable<any[]> {
   return this.http.get<any[]>(`${this.baseUrl}/search/getListOffreEnvoyewithoutarticleTop100?datedeb=${datedeb}&datefin=${datefin}
   &dev=${dev}&client=${client}&vendeur=${vendeur}&four=${four}&zone=${zone}&secteur=${secteur}&groupe=${groupe}&represant=${represant}
   &typol=${typol}&typcom=${typcom}&mntmin=${mntmin}&mntmax=${mntmax} `);
}
getTotauxOffreEnvoyewithoutarticle(datedeb: string , datefin: String , dev: String , client: String , vendeur: String ,
  four: String , zone: String , secteur: String , groupe: String , represant: String , typol: String ,
  typcom: String , mntmin: String , mntmax: String ): Observable<any[]> {
   return this.http.get<any[]>(`${this.baseUrl}/search/getTotauxOffreEnvoyewithoutarticle?datedeb=${datedeb}&datefin=${datefin}
   &dev=${dev}&client=${client}&vendeur=${vendeur}&four=${four}&zone=${zone}&secteur=${secteur}&groupe=${groupe}&represant=${represant}
   &typol=${typol}&typcom=${typcom}&mntmin=${mntmin}&mntmax=${mntmax} `);
}

deleteEdevis() {
  return this.http.get<any>(`${this.baseUrl}/search/deleteEdevis`);
}

updateNumero(mtsatisf: string , numdev: string) {
  return this.http.get<any>(`${this.baseUrl}/search/updateNumero?mtsatisf=${mtsatisf}&numdev=${numdev}`);
}
getEdevisForAnnulationOffre(numDev: string) {
  return this.http.get<any>(`${this.baseUrl}/search/getEdevisForAnnulationOffre?numDev=${numDev}`);
}
deleteEdevisById(id: string): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/${id}`);
}
}
