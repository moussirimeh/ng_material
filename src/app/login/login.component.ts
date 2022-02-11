import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { SteService } from '../layout/services/ste.service';
import { MatInput } from '@angular/material';
import { Compiler } from '@angular/core';
import { Ste } from '../layout/services/ste';
import { globals } from '../../environments/environment';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  imgSrc = 'assets/images/MAGASIN.png';
  constructor(
    private router: Router,
    private steService: SteService,
    private loginService: LoginService,
    private _compiler: Compiler
  ) {}
  util;
  nom;
  mdp;
  existe;
  ste: Ste;
  public msgs: any[] = [];

  @ViewChild('nomInput')
  public nomInput: MatInput;

  async ngOnInit() {
    // this._compiler.clearCache();

    // for build
    // localStorage.setItem('api', 'http://192.168.2.16:8080/rest/rest/');
    // localStorage.setItem('apiUrl', 'http://192.168.2.16:8080/');
    // localStorage.setItem('smsApi', 'http://192.168.2.16:8080/rest');
    // localStorage.setItem('api', 'http://' + params.serverip + '/rest/rest/');

    // build  For server test
    // localStorage.setItem('api', 'http://192.168.2.16:8080/automotive/rest/');
    localStorage.setItem('apiUrl', 'http://192.168.2.16:8080/');
    // localStorage.setItem('smsApi', 'http://192.168.2.16:8080/automotive');

    // for dev
    // localStorage.setItem('api', 'http://localhost:8200/rest/');
    // localStorage.setItem('apiUrl', 'http://localhost:8200/');
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste[0];
        console.log('societe', this.ste.societe);
      });
    // localStorage.setItem("api" + this.ste.societe, "http://localhost:8200/rest/");
    // localStorage.setItem("apiUrl", "http://localhost:8200/");
    // localStorage.setItem('societe', this.ste.societe);
    globals.societe = this.ste.societe;
    // localStorage.setItem('adresse', this.ste.adresse);
    globals.adresse = this.ste.adresse;
    localStorage.setItem('ligneImpot', this.ste.ligneImpot);
    // globals.ligneImpot = this.ste.ligneImpot;
    if (this.ste.societe === 'CHAMAM DIVISION GROS') {
      this.imgSrc = 'assets/images/CDG.png';
    }
    if (this.ste.societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
      this.imgSrc = 'assets/images/EQM.png';
    }
    if (this.ste.societe === 'SMD (STE MODERNE DISTRIBUTION)') {
      this.imgSrc = 'assets/images/SMD.png';
    }
    if (this.ste.societe === 'EQUIPEMENT MODERNE HARDWARE') {
      this.imgSrc = 'assets/images/HARDWARE.png';
    }
    if (this.ste.societe === 'EQUIPEMENT MODERNE AUTOMOTIVE') {
      this.imgSrc = 'assets/images/AUTOMOTIVE.png';
    }
    document.getElementById('util').focus();
    console.log(globals.apiBaseUrl);
  }
  showErrorpwd() {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Mot de passe invalide' });
  }
  showErrorcode() {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Code utilisateur invalide' });
  }
  clear() {
    this.msgs = [];
    this.util = '';
    this.nom = '';
    this.mdp = '';
    this.ste = new Ste();
  }
  clearMDP() {
    this.msgs = [];
  }

  createAuthorizationHeader(headers: Headers) {
    const sessionID = JSON.parse(localStorage.getItem('user-data')).JSESSIONID;
    headers.append('JSESSIONID', sessionID);
  }

  async onLoginUtil() {
    console.log(this.util);
    await this.loginService
      .existsByLogin(this.util)
      .toPromise()
      .then(async (value) => {
        if (!value) {
          this.showErrorcode();
        } else {
          await this.loginService
            .getLoginName(this.util)
            .toPromise()
            .then((data) => {
              this.nom = data['_embedded'].users[0].nPUtil;
              document.getElementById('mdp').focus();
            });
        }
      });
  }
  async onLogin() {
    console.log(this.util);
    console.log(this.mdp);
    this.loginService
      .procedureStocke(this.util, 'ENTREE')
      .toPromise()
      .then((data) => {
        console.log(data);
      });
    let allowLogin = false;
    await this.loginService
      .existsByLoginPwd(this.util, this.mdp)
      .toPromise()
      .then(async (value) => {
        if (!value) {
          this.showErrorpwd();
          this.existe = false;
        } else {
          await this.steService
            .getSte()
            .toPromise()
            .then((data) => {
              this.ste = data['_embedded'].ste[0];
              console.log('societe', this.ste.societe);
            });
          allowLogin = true;
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem('login', this.util);
          localStorage.setItem('nomUtil', this.nom);
          localStorage.setItem('mdp', this.mdp);
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
