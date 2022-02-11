import { Injectable } from "@angular/core";
import { Libdep } from "./libdep";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class LibdepService {
  private baseUrl = globals.apiBaseUrl + "libdep";

  constructor(private http: HttpClient) {}

  createLibdep(libdep: Libdep): Observable<Libdep> {
    return this.http.post<Libdep>(`${this.baseUrl}`, libdep);
  }

  getLibdepListOrderByLibelle(): Observable<Libdep[]> {
    return this.http.get<Libdep[]>(
      `${this.baseUrl}/search/findByOrderByLibelle`
    );
  }

  updateLibdep(libdep: Libdep): Observable<any> {
    return this.http.put<Libdep>(`${this.baseUrl}/${libdep.id}`, libdep);
  }
  deleteLibdep(id: string): Observable<any> {
    return this.http.delete<Libdep>(`${this.baseUrl}/${id}`);
  }
}
