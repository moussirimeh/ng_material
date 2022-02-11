import { Injectable } from '@angular/core';
import { CaRepresFour } from './caRepresFour';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaRepresFourService {
  private baseUrl = globals.apiBaseUrl + 'caRepresFour';

  constructor(private http: HttpClient) {}

  getCaRepresFour(fours: string[], codeRep: string): Observable<CaRepresFour[]> {
    return this.http.get<CaRepresFour[]>(
      `${this.baseUrl}/search/getCaRepresFour?four1=${fours[0]}
      &four2=${fours[2]}&four3=${fours[4]}&four4=${fours[6]}&four5=${fours[8]}
      &four6=${fours[10]}&four7=${fours[12]}&four8=${fours[14]}&four9=${fours[16]}
      &four10=${fours[18]}&codeRep=${codeRep}`
    );
  }
  getFournisseurs(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/search/getFournisseurs`);
   }
}
