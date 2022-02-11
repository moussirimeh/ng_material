import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { DemandeService } from '../services/demande.service';
import { Demande } from '../services/demande';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-annulation-proforma',
  templateUrl: './annulation-proforma.component.html',
  styleUrls: ['./annulation-proforma.component.scss'],
})
export class AnnulationProformaComponent implements OnInit {
  @ViewChild('gridProforma')
  public gridProforma: GridComponent;
  four: Fournisseur[] = [];
  demande = [];
  deno = '';
  adresse = '';
  ville = '';
  date;
  code = '';
  codeFour = '';
  champDisabled = false;
  rechercheDisable = false;
  cardShow = false;
  rang = 0;
  existe: boolean;
  combine;
  numero = '';
  result: boolean;
  demandeProforma: Demande = {
    id: null,
    combine: '',
    code: '',
    quantite: '',
    date: '',
    operateur: '',
    prProp: '',
    design: '',
    unite: '',
    rang: '',
  };
  blockedDocument = false;
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7',
  };
  styleOvPanel = {};
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private fourService: FournisseurService,
    private demandeService: DemandeService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    document.getElementById('num').focus();
  }
  async valid_prof_num(e) {
    this.blockedDocument = true;
    this.wasInside = true;
    this.ov.hide();
    if (this.numero.length > 0) {
      if (Number(this.numero) !== 0) {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero.length; i++) {
          tmp = tmp + '0';
        }
        this.numero = tmp + this.numero;
      }
      this.rang = 0;
      this.combine = 'PROFORMA ' + this.numero;

      await this.demandeService
        .existsByCombine(this.combine)
        .toPromise()
        .then((value) => {
          if (!value) {
            this.result = false;
            this.msgs = 'DEMANDE PROFORMA inéxistant !';
            this.styleOvPanel = this.styleOvPanelError;
            document.getElementById('num').focus();
            this.ov.show(e, document.getElementById('num'));
          } else {
            this.result = true;
          }
        });
      if (this.result === true) {
        await this.demandeService
          .findByCombine(this.combine)
          .toPromise()
          .then((data) => {
            this.demande = data['_embedded'].demandes;
          });
        let j;
        for (j = 0; j <= this.demande.length - 1; j++) {
          this.rang = this.rang + 1;
          this.demande[j].rang = this.rang;
        }
        this.date = this.demande[0].date;
        if (
          this.demande[0].operateur !== null &&
          this.demande[0].operateur !== ''
        ) {
          this.codeFour = this.demande[0].operateur;

          await this.fourService
            .FourByCode(this.codeFour)
            .toPromise()
            .then((data) => {
              this.four = data['_embedded'].fournisseurs;
            });

          this.deno = this.four[0].deno;
          this.ville = this.four[0].ville;
          this.adresse = this.four[0].adresse;
        }
        this.champDisabled = true;
        this.cardShow = true;
        this.rechercheDisable = false;
      }
    } else {
      this.msgs = 'Veillez saisir le numéro !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    }
    this.blockedDocument = false;
  }
  async confirmer() {
    this.blockedDocument = true;
    await this.demandeService.removeByCombine(this.combine).toPromise().then();
    this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.numero
      )
      .subscribe((data) => {

      });
    this.numero = null;
    this.cardShow = false;
    this.date = null;
    this.codeFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.rang = 0;
    this.demande = [];
    this.blockedDocument = false;
  }
  onBackspaceKeydown() {
    this.date = null;
    this.codeFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.rang = 0;
    this.demande = [];
    this.cardShow = false;
  }
}
