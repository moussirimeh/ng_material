import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { Login } from './login';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './User';
import { TMouchar } from '../layout/services/tMouchar';
import { formatDate } from '@angular/common';
import { globals } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  // for build
  // private baseUrl = 'http://192.168.2.16:8080/rest/rest/users';
  // private baseUrlTmouchar = 'http://192.168.2.16:8080/rest/rest/tmouchar';

  // build  For server test
  // private baseUrl = 'http://192.168.2.16:8080/automotive/rest/users';
  // private baseUrlTmouchar = 'http://192.168.2.16:8080/automotive/rest/tmouchar';

  // for dev
  // private baseUrl = 'http://localhost:8200/rest/users';
  // private baseUrlTmouchar = 'http://localhost:8200/rest/tmouchar';
  private baseUrl = globals.apiBaseUrl + 'users';
  private baseUrlTmouchar = globals.apiBaseUrl + 'tmouchar';

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) private locale: string
  ) {}

  getLoginsList(): Observable<Login[]> {
    return this.http.get<Login[]>(`${this.baseUrl}/search/findByOrderByCode`);
  }
  getLoginsListByOrder(): Observable<Login[]> {
    return this.http.get<Login[]>(
      `${this.baseUrl}/search/findByOrderByCodeUtil`
    );
  }
  getLoginName(login: string): Observable<Login[]> {
    return this.http.get<Login[]>(
      `${this.baseUrl}/search/findByCodeUtil?codeUtil=${login}`
    );
  }
  existsByLogin(login: string) {
    return this.http.get(
      `${this.baseUrl}/search/existsByCodeUtil?codeUtil=${login}`
    );
  }
  existsByLoginPwd(login: string, pwd: string) {
    return this.http.get(
      `${this.baseUrl}/search/existsByCodeUtilAndMPUtil?codeUtil=${login}&mPUtil=${pwd}`
    );
  }
  getUserByCodeUtil(CodeUtil: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.baseUrl}/search/findByCodeUtilStartsWith?CodeUtil=${CodeUtil}`
    );
  }
  procedureStockee(
    codeUtil: string,
    dateSys: string,
    codeOp: string,
    mParam: string
  ): void {
    // return this.http.get<User[]>(`${this.baseUrl}/search/findByCodeUtilStartsWith?CodeUtil=${CodeUtil}`);
  }
  getUserByCode(CodeUtil: string): Observable<Login[]> {
    return this.http.get<Login[]>(
      `${this.baseUrl}/search/findByCodeUtilStartsWith?CodeUtil=${CodeUtil}`
    );
  }
  getUserListByOrderByCode(): Observable<Login[]> {
    return this.http.get<Login[]>(
      `${this.baseUrl}/search/findByOrderByCodeUtil`
    );
  }
  procedureStocke(CodeUtil: string, paramB: String): Observable<any> {
    /*return this.http.get(
      `${this.baseUrl}/search/procedureStocke?a=${CodeUtil}&b=${paramB}&c=MOHAMEDPC`
    );*/
    const dateSys = new Date();
    const tmouchar: TMouchar = {
      id: null,
      mCodeUt: CodeUtil,
      /*mDateTemp:
        dateSys.toLocaleDateString('en-GB') + ' ' + dateSys.toLocaleTimeString(),*/
      mDateTemp: formatDate(dateSys, 'dd/MM/yyyy HH:mm:ss.SSS', this.locale),
      mCodeOp: String(paramB),
      mParam: 'MOHAMED PC',
    };
    console.log(tmouchar);

    return this.http.post<TMouchar>(`${this.baseUrlTmouchar}`, tmouchar);
  }
  /*procedureStockeModule(
    CodeUtil: string,
    paramB: String,
    paramC: String
  ): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/search/procedureStocke?a=${CodeUtil}&b=${paramB}&c=${paramC}`
    );
  }*/
  procedureStockeModule(
    CodeUtil: string,
    paramB: String,
    paramC: String
  ): Observable<TMouchar> {
    const dateSys = new Date();
    const tmouchar: TMouchar = {
      id: null,
      mCodeUt: String(CodeUtil).substring(0, 10),
      /*mDateTemp:
      dateSys.toLocaleDateString('en-GB') + ' ' + dateSys.toLocaleTimeString(),*/
      mDateTemp: formatDate(dateSys, 'dd/MM/yyyy HH:mm:ss.SSS', this.locale),
      mCodeOp: String(paramB).substring(0, 40),
      mParam: String(paramC).substring(0, 50),
    };

    console.log(tmouchar);

    return this.http.post<TMouchar>(`${this.baseUrlTmouchar}`, tmouchar);
  }
}
