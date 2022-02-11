
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Rapportfacturesum } from './rapportfacturesum';
import { rapDetailFacts } from './RapDetailFact';
import { rapportFactureClts } from './rapportfactureclt';
import { globals } from '../../../environments/environment';



@Injectable({
    providedIn: 'root'
})
export class RapportfacturecltService {
    private baseUrl = globals.apiBaseUrl + 'rapportFactureClts';

    constructor(private http: HttpClient) { }


    GetfactureClttout( datedebut: string, datefin: string): Observable<rapportFactureClts[]> {
        return this.http.get<rapportFactureClts[]>(
        `${this.baseUrl}/search/GetfactureClttout?datedebut=${datedebut}&datefin=${datefin}
      `); }

      GetfactureClt( datedebut: string, datefin: string, codeclt: string): Observable<rapportFactureClts[]> {
        return this.http.get<rapportFactureClts[]>(
        `${this.baseUrl}/search/GetfactureClt?datedebut=${datedebut}&datefin=${datefin}&codeclt=${codeclt}
      `); }
      GetSumTotalSensC( datedebut: string, datefin: string): Observable<Rapportfacturesum> {
        return this.http.get<Rapportfacturesum>(
        `${this.baseUrl}/search/GetSumTotalSensC?datedebut=${datedebut}&datefin=${datefin}
      `); }
      GetSumTotalSensD( datedebut: string, datefin: string): Observable<Rapportfacturesum> {
        return this.http.get<Rapportfacturesum>(
        `${this.baseUrl}/search/GetSumTotalSensD?datedebut=${datedebut}&datefin=${datefin}
      `); }


      GetSumTotalselectSensC( datedebut: string, datefin: string, codeclt: string): Observable<Rapportfacturesum> {
        return this.http.get<Rapportfacturesum>(
        `${this.baseUrl}/search/GetSumTotalselectSensC?datedebut=${datedebut}&datefin=${datefin}&codeclt=${codeclt}
      `); }

      GetSumTotalselectSensD( datedebut: string, datefin: string, codeclt: string): Observable<Rapportfacturesum> {
        return this.http.get<Rapportfacturesum>(
        `${this.baseUrl}/search/GetSumTotalselectSensD?datedebut=${datedebut}&datefin=${datefin}&codeclt=${codeclt}
      `); }

      GetSumTotalDetail( datedebut: string, datefin: string, combine: string): Observable<Rapportfacturesum> {
        return this.http.get<Rapportfacturesum>(
        `${this.baseUrl}/search/GetSumTotalDetail?datedebut=${datedebut}&datefin=${datefin}&combine=${combine}
      `); }

      GetDetailFact( datedebut: string, datefin: string, numero: string): Observable<rapDetailFacts[]> {
        return this.http.get<rapDetailFacts[]>(
        `${this.baseUrl}/search/GetDetailFact?datedebut=${datedebut}&datefin=${datefin}&numero=${numero}
      `); }

}
