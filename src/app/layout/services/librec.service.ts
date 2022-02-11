import { Injectable } from '@angular/core';
import { Librec } from './librec';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibrecService {
  private baseUrl = globals.apiBaseUrl + 'librec';

  constructor(private http: HttpClient) {}

  createLibrec(librec: Librec): Observable<Librec> {
    return this.http.post<Librec>(`${this.baseUrl}`, librec);
  }

  getLibrecListOrderByLibelle(): Observable<Librec[]> {
    return this.http.get<Librec[]>(
      `${this.baseUrl}/search/findByOrderByLibelle`
    );
  }

  updateLibrec(librec: Librec): Observable<any> {
    return this.http.put<Librec>(`${this.baseUrl}/${librec.id}`, librec);
  }
  deleteLibrec(id: string): Observable<any> {
    return this.http.delete<Librec>(`${this.baseUrl}/${id}`);
  }
}
