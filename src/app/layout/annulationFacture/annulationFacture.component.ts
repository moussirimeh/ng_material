import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { L10n, setCulture } from '@syncfusion/ej2-base';
// import { Facture } from '../services/facture';
import { FactureService } from '../services/facture.service';
import { TermeService } from '../services/terme.service';
// import { AnnulationFacture } from '../services/annulationFacture';
import { AnnulationFactureService } from '../services/annulationFacture.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { LoginService } from 'src/app/login/login.service';
import { ConfirmationService } from 'primeng/api';
import { globals } from 'src/environments/environment';
setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' ',
    },
  },
});

@Component({
  selector: 'app-annulationFacture',
  templateUrl: './annulationFacture.component.html',
  styleUrls: ['./annulationFacture.component.scss'],
  providers: [DatePipe, ConfirmationService],
})
export class AnnulationFactureComponent implements OnInit {
  date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
  tn;
  numero = '';
  client: Client;
  factures;
  @ViewChild('gridFact')
  public grid: GridComponent;
  totalTtc;
  elemVisibles = false;
  blockDocument = false;
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
    private datePipe: DatePipe,
    private factureService: FactureService,
    private annulationFactureService: AnnulationFactureService,
    private clientService: ClientService,
    private termeService: TermeService,
    private loginService: LoginService,
    private confirmationService: ConfirmationService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
      dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
      monthNames: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Decembre',
      ],
      monthNamesShort: [
        'Jan',
        'Fev',
        'Mar',
        'Avr',
        'Mai',
        'Jun',
        'Jul',
        'Aou',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
    this.intialiserClient();
    this.factures = [
      // { piece: 'AVOIR 00226', date: '05/01/2019', vendeur: 'MED ALI CHAABA 50501346', ref: '/FN°6543/18', remise: '1.386', net: '9.346' }
    ];
    this.totalTtc = '';
    document.getElementById('num').focus();
  }
  intialiserClient() {
    this.client = {
      id: null,
      code: null,
      deno: null,
      adresse: null,
      ville: null,
      post: null,
      respon: null,
      tel: null,
      agence: null,
      banque: null,
      telex: null,
      fax: null,
      cadnat: null,
      compte: null,
      edition: null,
      exonor: null,
      duree: null,
      reg: null,
      terme: null,
      marque: null,
      plafond: null,
      zone: null,
      comm: null,
      assujet: null,
      codeTva: null,
      timbre: null,
      ech: null,
      bloc: null,
      datBlc: null,
      typeC: null,
      regle: null,
      lettre: null,
      codeC: null,
      autor: null,
      eMail: null,
      typeComm: null,
      rec: null,
      vend: null,
      represant: null,
      secteur: null,
      objectif: null,
      nature: null,
      datCreat: null,
      mag: null,
      respons2: null,
      adresseusine: null,
      adressesiege: null,
      gsm1: null,
      gsm2: null,
      nouvMag: null,
      ca123: null,
      respons3: null,
      fonction1: null,
      fonction2: null,
      fonction3: null,
      eMail1: null,
      eMail2: null,
      eMail3: null,
      tel2: null,
      tel3: null,
      gsm3: null,
      codGroupe: null,
      modeReg: null,
      plafondEncours: null,
      indic: null,
      bcExige: null,
    };
  }
  async afficher(e) {
    this.blockDocument = true;
    this.wasInside = true;
    this.ov.hide();
    if (this.numero.length < 1) {
      this.msgs = 'Veillez saisir le numéro !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    } else {
      if (Number(this.numero) !== 0) {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero.length; i++) {
          tmp = tmp + '0';
        }
        this.numero = tmp + this.numero;
      }
      let numTmp = null;
      let factTmp = [];
      let facts = [];
      const annee = String(new Date().getFullYear());
      await this.factureService
        .getFactureByNumero(this.numero)
        .toPromise()
        .then((data) => {
          factTmp = data['_embedded'].factures;
        });
      await this.annulationFactureService
        .getFacture(this.numero)
        .toPromise()
        .then((data) => {
          facts = data['_embedded'].annulationFacture;
        });
      await this.annulationFactureService
        .getNumero(this.numero, annee)
        .toPromise()
        .then((data) => {
          numTmp = data;
        });
      let testContAvEtBl: any = null;
      await this.annulationFactureService
        .contientAvoirEtBl(this.numero)
        .toPromise()
        .then((data) => (testContAvEtBl = data));
        /*console.log(factTmp.length,
          facts.length ,
          numTmp.length ,
          testContAvEtBl.length);*/
      if (
        factTmp.length !== 1 ||
        facts.length < 1 ||
        numTmp.length !== 1 ||
        testContAvEtBl.length !== 1
      ) {
        this.msgs = 'Facture inéxistante ou apurée ou vide ou avc avoir';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num').focus();
        this.ov.show(e, document.getElementById('num'));
      } else {
        this.factures = facts;
        this.elemVisibles = true;
        await this.clientService
          .getClientByCode(factTmp[0].operateur)
          .toPromise()
          .then((data) => {
            if (data['_embedded'].clients.length > 0) {
              this.client = data['_embedded'].clients[0];
            } else {
              this.intialiserClient();
            }
          });
        this.date = factTmp[0].date;
        this.totalTtc = Number(factTmp[0].net)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      }
    }
    this.blockDocument = false;
  }
  nvlSaisie() {
    this.elemVisibles = false;
    this.totalTtc = '';
    this.factures = [];
    this.intialiserClient();
    this.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.numero = '';
  }
  annuler() {
    this.nvlSaisie();
  }
  confirmSuppr() {
    this.confirmationService.confirm({
      message:
        'Voulez-vous confirmer la suppression de la facture ' +
        this.numero +
        ' ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Oui',
      rejectLabel: 'Non',
      accept: async () => {
        await this.supprimer();
      },
    });
  }
  async supprimer() {
    this.blockDocument = true;
    const annee = String(new Date().getFullYear());
    //////////// delete from BROU
    await this.annulationFactureService
      .deleteFromBrou(this.numero, annee)
      .toPromise()
      .then((data) => {
        console.log('brou delete success');
      })
      .catch((error) => {
        console.log('brou delete error');
      });
    ////// delete from FACTURE
    await this.annulationFactureService
      .deleteFromFacture(this.numero, annee)
      .toPromise()
      .then((data) => {
        console.log('facture delete success');
      })
      .catch((error) => {
        console.log('facture delete error');
      });
    ////// modify RECETTES
    await this.annulationFactureService
      .modifyRecettes(this.numero)
      .toPromise()
      .then((data) => {
        console.log('recettes modify success');
      })
      .catch((error) => {
        console.log('recettes modify error');
      });
    ////// delete from TERME
    await this.termeService
      .deleteTermeByCombine(this.numero)
      .toPromise()
      .then((data) => {
        console.log('terme delete success');
      })
      .catch((error) => {
        console.log('terme delete error');
      });
    ////// journalisation
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.numero + ' Clt ' + this.client.code
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });

    this.nvlSaisie();
    this.blockDocument = false;
  }
}
