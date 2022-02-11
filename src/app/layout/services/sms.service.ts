import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { globals } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SmsService {
  // Build
  private baseUrl = globals.smsApi + 'orange' ;
  // dev
  // private baseUrl = 'http://localhost:8080/orange';
  private options: HttpHeaders['headers'] = { responseType: 'text' };
  constructor(private http: HttpClient) {}

  sendSms(MessageModel): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/sendSMS`,
      MessageModel,
      this.options
    );
  }

  getAccessToken(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/getAccessToken`,
      {},
      this.options
    );
  }
}
