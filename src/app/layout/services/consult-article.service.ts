import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { globals } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConsultArticleService {

  private baseUrl = globals.apiBaseUrl + 'consultArticle';
  constructor(private http: HttpClient) { }

}
