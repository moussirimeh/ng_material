import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { BrouService } from '../services/brou.service';
import { ClientService } from '../services/client.service';
import { Client } from '../services/client';
import { Ste } from '../services/ste';
import {
  GridComponent,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';
import { SelectItem } from 'primeng/api';
import { ReglementClientService } from '../services/reglementClient.service';
import { ReglementClient } from '../services/reglementClient';
import { SteService } from '../services/ste.service';
import { DatePipe } from '@angular/common';
import { AppurementReglementComponent } from '../appurement-reglement/appurement-reglement.component';
import { setCurrencyCode } from '@syncfusion/ej2-base';
import { L10n } from '@syncfusion/ej2-base';
import { setCulture } from '@syncfusion/ej2-base';
import { InputMask, OverlayPanel } from 'primeng/primeng';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { ClientContService } from '../services/clientCont.service';
import { BrouContService } from '../services/brouCont.service';
import { ReglementClientContService } from '../services/reglementClientCont.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';

setCulture('en-US');
setCurrencyCode('QAR');
L10n.load({
  'en-US': {
    grid: {
      EmptyRecord: [],
    },
  },
});

@Component({
  selector: 'app-reglementclient',
  templateUrl: './reglementClient.component.html',
  styleUrls: ['./reglementClient.component.scss'],
  providers: [DatePipe],
})
export class ReglementClientComponent implements OnInit {
  @ViewChild(AppurementReglementComponent) Appurement;
  public mode: string;
  @ViewChild('gridCredit')
  public gridCredit: GridComponent;
  @ViewChild('gridDebit')
  public gridDebit: GridComponent;
  display = false;
  selectedrowindex: any;
  selectedrecordsD: any;
  selectedrecordsC: any;
  hiddenNouvSaisie = false;
  maxDate: Date;
  minDate: Date;

  date: any;
  echeance: any;
  ngselectDisabled = false;
  clients: Client[] = [];
  ste: Ste[];
  apurementshow = false;
  totalDebit = '0.000';
  totalCredit = '0.000';
  allowSelection = true;
  maxid;
  maxIdPlus1 = null;
  histNombreIMP = '0';
  histTotalIMP = '0.000';
  nombreIMP = '0';
  totalIMP = '0.000';
  solde = '0.000';
  credit: number;
  debit: number;
  bd;
  validershow = false;
  ajouterDisabled = true;
  supprimerDisabled = true;
  modifierDisabled = true;
  champDisabled = true;
  brouDebit: ReglementClient[] = [];
  brouCredit: ReglementClient[] = [];
  selectedClient: Client = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    respon: '',
    tel: '',
    agence: '',
    banque: '',
    telex: '',
    fax: '',
    cadnat: '',
    compte: '',
    edition: '',
    exonor: '',
    duree: '',
    reg: '',
    terme: '',
    marque: '',
    plafond: '',
    zone: '',
    comm: '',
    assujet: '',
    codeTva: '',
    timbre: '',
    ech: '',
    bloc: '',
    datBlc: '',
    typeC: '',
    regle: '',
    lettre: '',
    codeC: '',
    autor: '',
    eMail: '',
    typeComm: '',
    rec: '',
    vend: '',
    represant: '',
    secteur: '',
    objectif: '',
    nature: '',
    datCreat: '',
    mag: '',
    respons2: '',
    adresseusine: '',
    adressesiege: '',
    gsm1: '',
    gsm2: '',
    nouvMag: '',
    ca123: '',
    respons3: '',
    fonction1: '',
    fonction2: '',
    fonction3: '',
    eMail1: '',
    eMail2: '',
    eMail3: '',
    tel2: '',
    tel3: '',
    gsm3: '',
    codGroupe: '',
    modeReg: '',
    plafondEncours: '',
    indic: '',
    bcExige: '',
  };
  selectedrecords;
  valueMontant;
  dateCaisse;
  selected;
  hiddenAjouter = false;
  selectedBrou: any = {
    id: null,
    code: '',
    compte: '',
    nature: '',
    piece: '',
    montant: '',
    libelle: '',
    sens: '',
    date: '',
    regle: '',
    numero: '',
    num: '',
    cle: '',
    op1: '',
    operateur: '',
    echeance: '',
    lig: '',
    apurement: '',
    dateApur: '',
    datVer: '',
    datRec: '',
    etat: '',
    etat2: '',
    banqEqm: '',
    borVer: '',
    borEnc: '',
    tire: '',
    banque: '',
    borRtr: '',
    numPiece: '',
  };
  sensDebit = 'D';
  sensCredit = 'C';

  afficherShow = false;
  ajouterClicked = false;
  modifierClicked = false;

  piece: SelectItem[];
  deno;
  autoriseModif = false;
  autoriseSupp = false;

  codeClient = '';
  showCard1 = false;
  showCard2 = false;
  showNvSaisie = false;
  typeClt = 'N';
  @ViewChild('ngSelectPiece') ngSelectPiece: NgSelectComponent;
  @ViewChild('inputMaskEcheance') inputMaskEcheance: InputMask;
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
    private steService: SteService,
    private brouService: BrouService,
    private brouContService: BrouContService,
    private reglementService: ReglementClientService,
    private reglementContService: ReglementClientContService,
    private clientService: ClientService,
    private clientContService: ClientContService,
    private loginService: LoginService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = '';
    this.config.clearAllText = 'Supprimer tous';

    this.piece = [
      { label: '', value: null },
      { label: 'TRAITE', value: 'TRAITE' },
      { label: 'CHEQUE', value: 'CHEQUE' },
      { label: 'ESPECE', value: 'ESPECE' },
      { label: 'VIR.BNQ', value: 'VIR.BNQ' },
      { label: 'DIFF+', value: 'DIFF+' },
      { label: 'DIFF-', value: 'DIFF-' },
      { label: 'RS', value: 'RS' },
      { label: 'RTVA', value: 'RTVA' },
    ];
  }

  async ngOnInit() {
    document.getElementById('codeClt').focus();
    // module reglement client
    if (globals.selectedMenu === 'Reglement Client') {
      this.autoriseModif = false;
      this.autoriseSupp = false;
      this.typeClt = 'N';
    }
    // module reglement client contentieux
    if (globals.selectedMenu === 'Reglement Client Cont') {
      this.autoriseModif = false;
      this.autoriseSupp = false;
      this.typeClt = 'C';
    }
    // module reglement client  avec modifier et supprimer
    if (
      globals.selectedMenu === 'Reglement Client avec Mod Sup'
    ) {
      this.autoriseModif = true;
      this.autoriseSupp = true;
      this.typeClt = 'N';
    }
    // module reglement client cont  avec modifier et supprimer
    if (
      globals.selectedMenu ===
      'Reglement Clients Cont avec Mod Sup'
    ) {
      this.autoriseModif = true;
      this.autoriseSupp = true;
      this.typeClt = 'C';
    }

    console.log(this.typeClt);
    if (this.typeClt === 'N') {
      await this.clientService
        .getClientsByTermeOrderByDeno('O')
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clients;
        });
    } else {
      await this.clientContService
        .getClientContList()
        .toPromise()
        .then((data) => {
          this.clients = data['_embedded'].clientsCont;
        });
    }
    this.intialiserSelectedClient();

    await this.getDatecaisse();
    await this.reloadDataste();

    // this.reloadDataClient();
    this.maxDate = new Date();
    this.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.echeance = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
  }

  async getDeno() {
    if (this.typeClt === 'N') {
      await this.clientService
        .getDeno(this.selectedClient.code)
        .toPromise()
        .then((value) => {
          this.deno = value;
        });
    } else {
      await this.clientContService
        .getDeno(this.selectedClient.code)
        .toPromise()
        .then((value) => {
          this.deno = value;
        });
    }
  }

  async reloadDataste() {
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
  }
  async getDatecaisse() {
    await this.steService
      .getDateCaisse()
      .toPromise()
      .then((value) => {
        this.dateCaisse = value;
      });
  }
  /* async reloadDataBrou() {
    await this.brouService
      .getBrouList()
      .toPromise()
      .then((data) => {
        this.brouDebit = data["_embedded"].brous;
      });
  }*/
  async ListBrou() {
    this.maxIdPlus1 = null;
    await this.reglementService
      .ListByDebit(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.brouDebit = data['_embedded'].ReglementClients;
      });
    await this.reglementService
      .ListByCredit(this.selectedClient.code)
      .toPromise()
      .then((dataa) => {
        this.brouCredit = dataa['_embedded'].ReglementClients;
        for (this.bd of this.brouDebit) {
          this.brouCredit.push(this.bd);
        }
      });
    if (this.brouCredit.length === 0) {
      this.apurementshow = false;
      this.supprimerDisabled = true;
      this.modifierDisabled = true;
    } else {
      this.apurementshow = true;
      this.brouCredit = this.brouCredit.sort(function (a, b) {
        if (a.date != null && b.date != null) {
          if (
            new Date(
              +a.date.split('/')[2],
              +a.date.split('/')[1] - 1,
              +a.date.split('/')[0]
            ) <
            new Date(
              +b.date.split('/')[2],
              +b.date.split('/')[1] - 1,
              +b.date.split('/')[0]
            )
          ) {
            return -1;
          }
          if (
            new Date(
              +a.date.split('/')[2],
              +a.date.split('/')[1] - 1,
              +a.date.split('/')[0]
            ) >
            new Date(
              +b.date.split('/')[2],
              +b.date.split('/')[1] - 1,
              +b.date.split('/')[0]
            )
          ) {
            return 1;
          }
          return 0;
        }
        return 0;
      });
    }
    await this.brouService
      .getHistNombreIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.histNombreIMP = Number(value).toFixed();
      });
    await this.brouService
      .getHistTotalIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.histTotalIMP = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      });

    await this.brouService
      .getNombreIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.nombreIMP = Number(value).toFixed();
      });
    await this.brouService
      .getTotalIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalIMP = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      });

    await this.brouService
      .getTotalCredit(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalCredit = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.credit = +Number(value).toFixed(3);
      });
    await this.brouService
      .getTotalDebit(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalDebit = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.debit = +Number(value).toFixed(3);
      });
    this.solde = Number(this.debit - this.credit)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
  }
  async ListBrouCont() {
    this.maxIdPlus1 = null;
    await this.reglementContService
      .ListByDebit(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.brouDebit = data['_embedded'].reglementClientCont;
        console.log(data);
      });
    await this.reglementContService
      .ListByCredit(this.selectedClient.code)
      .toPromise()
      .then((data) => {
        this.brouCredit = data['_embedded'].reglementClientCont;
        console.log(data);
        for (const b of this.brouDebit) {
          this.brouCredit.push(b);
        }
      });
    if (this.brouCredit.length === 0) {
      this.apurementshow = false;
      this.supprimerDisabled = true;
      this.modifierDisabled = true;
    } else {
      this.apurementshow = true;
      this.brouCredit = this.brouCredit.sort(function (a, b) {
        if (a.date != null && b.date != null) {
          if (
            new Date(
              +a.date.split('/')[2],
              +a.date.split('/')[1] - 1,
              +a.date.split('/')[0]
            ) <
            new Date(
              +b.date.split('/')[2],
              +b.date.split('/')[1] - 1,
              +b.date.split('/')[0]
            )
          ) {
            return -1;
          }
          if (
            new Date(
              +a.date.split('/')[2],
              +a.date.split('/')[1] - 1,
              +a.date.split('/')[0]
            ) >
            new Date(
              +b.date.split('/')[2],
              +b.date.split('/')[1] - 1,
              +b.date.split('/')[0]
            )
          ) {
            return 1;
          }
          return 0;
        }
        return 0;
      });
    }
    await this.brouContService
      .getHistNombreIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.histNombreIMP = Number(value).toFixed();
      });
    await this.brouContService
      .getHistTotalIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.histTotalIMP = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      });

    await this.brouContService
      .getNombreIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.nombreIMP = Number(value).toFixed();
      });
    await this.brouContService
      .getTotalIMP(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalIMP = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
      });

    await this.brouContService
      .getTotalCredit(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalCredit = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.credit = +Number(value).toFixed(3);
      });
    await this.brouContService
      .getTotalDebit(this.selectedClient.code)
      .toPromise()
      .then((value) => {
        this.totalDebit = Number(value)
          .toFixed(3)
          .replace(/\d(?=(\d{3})+\.)/g, '$& ');
        this.debit = +Number(value).toFixed(3);
      });
    this.solde = Number(this.debit - this.credit)
      .toFixed(3)
      .replace(/\d(?=(\d{3})+\.)/g, '$& ');
    console.log(this.brouCredit);
  }

  async afficher() {
    this.minDate = new Date(this.dateCaisse);
    this.minDate.setDate(this.minDate.getDate() + 1);
    if (this.typeClt === 'N') {
      await this.ListBrou();
    } else {
      await this.ListBrouCont();
    }
    await this.getDeno();
    this.ajouterDisabled = false;
    this.ngselectDisabled = true;
    this.afficherShow = false;
    this.showCard1 = true;
    this.showNvSaisie = true;
  }
  async create() {
    this.selectedBrou.date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
    this.selectedBrou.echeance = this.echeance;
    if (this.selectedBrou.piece === 'VIR.BNQ') {
      this.selectedBrou.echeance = null;
    }
    if (this.selectedBrou.piece === 'DIFF-') {
      this.selectedBrou.sens = 'D';
    }
    console.log(this.selectedBrou);

    if (this.typeClt === 'N') {
      await this.brouService
        .createBrou(this.selectedBrou)
        .toPromise()
        .then(
          (data) => {
            this.ListBrou();
          },

          (error) => {}
        );
    } else {
      await this.brouContService
        .createBrouCont(this.selectedBrou)
        .toPromise()
        .then(async (data) => {
          await this.ListBrouCont();
        });
    }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        'AJ ' +
          String(this.selectedBrou.piece).substr(0, 3) +
          ' N° ' +
          this.selectedBrou.numero +
          ' CL ' +
          this.selectedBrou.compte +
          ' MT ' +
          this.selectedBrou.montant
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }
  async ajouter() {
    /*  await this.brouService
      .getMaxId()
      .toPromise()
      .then((value) => {
        this.maxid = value;
        this.maxIdPlus1 = +this.maxid + 1;
      });
*/
    this.selectedBrou = {
      id: null,
      code: null,
      compte: this.selectedClient.code,
      nature: null,
      piece: null,
      montant: null,
      libelle: null,
      sens: 'C',
      date: this.date,
      regle: null,
      numero: null,
      num: null,
      cle: null,
      op1: null,
      operateur: null,
      echeance: this.echeance,
      lig: null,
      apurement: null,
      dateApur: null,
      datVer: null,
      datRec: null,
      etat: null,
      etat2: null,
      banqEqm: null,
      borVer: null,
      borEnc: null,
      tire: String(this.deno).substr(0, 25),
      banque: null,
      borRtr: null,
      numPiece: null,
    };

    this.ajouterClicked = true;
    this.modifierClicked = false;
    this.ajouterDisabled = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.allowSelection = false;
    this.champDisabled = false;
    this.validershow = true;
    this.date = new Date();
    this.echeance = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.showCard2 = true;
    this.showNvSaisie = false;
    setTimeout(() => this.ngSelectPiece.focus(), 1);
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.ajouterClicked === true) {
      if (this.selectedBrou.piece !== null) {
        if (
          this.selectedBrou.montant !== null &&
          this.selectedBrou.montant !== ''
        ) {
          if (
            this.selectedBrou.piece === 'TRAITE' ||
            this.selectedBrou.piece === 'CHEQUE' ||
            this.selectedBrou.piece === 'VIR.BNQ'
          ) {
            if (
              this.selectedBrou.banque !== null &&
              this.selectedBrou.banque !== ''
            ) {
              if (
                this.selectedBrou.numero !== null &&
                this.selectedBrou.numero !== ''
              ) {
                if (
                  this.selectedBrou.tire !== null &&
                  this.selectedBrou.tire !== ''
                ) {
                  await this.create();
                  this.showCard2 = false;
                  this.showNvSaisie = true;
                  this.ajouterClicked = false;
                  this.allowSelection = true;
                  this.ajouterDisabled = false;
                  this.validershow = false;
                  this.champDisabled = true;
                  this.selectedBrou = {};
                } else {
                  this.msgs = 'Veuillez saisir le tire !';
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById('tire').focus();
                  this.ov.show(e, document.getElementById('tire'));
                }
              } else {
                this.msgs = 'Veuillez saisir le numero !';
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById('numero').focus();
                this.ov.show(e, document.getElementById('numero'));
              }
            } else {
              this.msgs = 'Veuillez saisir la banque !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('banque').focus();
              this.ov.show(e, document.getElementById('banque'));
            }
          } else {
            await this.create();
            this.showCard2 = false;
            this.showNvSaisie = true;
            this.ajouterClicked = false;
            this.allowSelection = true;
            this.ajouterDisabled = false;
            this.validershow = false;
            this.champDisabled = true;
            this.selectedBrou = {};
          }
        } else {
          this.msgs = 'Veuillez saisir le montant !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('montant').focus();
          this.ov.show(e, document.getElementById('montant'));
        }
      } else {
        this.msgs = 'Veuillez selectionner une piece !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('piece').focus();
        this.ov.show(e, document.getElementById('piece'));
      }
      /*
      if (this.selectedBrou.piece === null) {
        this.msgs = 'Veuillez selectionner une piece !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('brouPiece').focus();
        this.ov.show(e, document.getElementById('brouPiece'));
      } else if (
        this.selectedBrou.piece === 'TRAITE' ||
        this.selectedBrou.piece === 'CHEQUE' ||
        this.selectedBrou.piece === 'VIR.BNQ'
      ) {
        if (
          this.selectedBrou.montant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== '' &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== '' &&
          this.selectedBrou.tire !== '' &&
          this.selectedBrou.tire.length <= '25'
        ) {
          this.create();
          this.showCard2 = false;
          this.showNvSaisie = true;
          this.ajouterClicked = false;
          this.allowSelection = true;
          this.ajouterDisabled = false;
          this.validershow = false;
          this.champDisabled = true;
          this.selectedBrou = {};
        } else if (
          this.selectedBrou.montant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== '' &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== '' &&
          this.selectedBrou.tire.length > '25'
        ) {
          this.msgs = 'Le nombre de caractères maximal est 25 !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('brouTire').focus();
          this.ov.show(e, document.getElementById('brouTire'));
        } else {
          this.msgs = 'Remplir tout les champs !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        }
      } else if (
        this.selectedBrou.piece !== null &&
        this.selectedBrou.montant !== null
      ) {
        this.selectedBrou.tire = null;
        this.selectedBrou.echeance = null;
        await this.create();
        this.showCard2 = false;
        this.showNvSaisie = true;
        this.allowSelection = true;
        this.champDisabled = true;
        this.ajouterDisabled = false;
        this.validershow = false;
        this.ajouterClicked = false;
        this.selectedBrou = {};
      } else {
        this.msgs = 'Remplir tout les champs !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }*/
    } else if (this.modifierClicked === true) {
      if (this.selectedBrou.piece !== null) {
        if (
          this.selectedBrou.montant !== null &&
          this.selectedBrou.montant !== ''
        ) {
          if (
            this.selectedBrou.piece === 'TRAITE' ||
            this.selectedBrou.piece === 'CHEQUE' ||
            this.selectedBrou.piece === 'VIR.BNQ'
          ) {
            if (
              this.selectedBrou.banque !== null &&
              this.selectedBrou.banque !== ''
            ) {
              if (
                this.selectedBrou.numero !== null &&
                this.selectedBrou.numero !== ''
              ) {
                if (
                  this.selectedBrou.tire !== null &&
                  this.selectedBrou.tire !== ''
                ) {
                  await this.modifierBrou();
                  this.showCard2 = false;
                  this.showNvSaisie = true;
                  this.ajouterClicked = false;
                  this.allowSelection = true;
                  this.ajouterDisabled = false;
                  this.validershow = false;
                  this.champDisabled = true;
                  this.selectedBrou = {};
                } else {
                  this.msgs = 'Veuillez saisir le tire !';
                  this.styleOvPanel = this.styleOvPanelError;
                  document.getElementById('tire').focus();
                  this.ov.show(e, document.getElementById('tire'));
                }
              } else {
                this.msgs = 'Veuillez saisir le numero !';
                this.styleOvPanel = this.styleOvPanelError;
                document.getElementById('numero').focus();
                this.ov.show(e, document.getElementById('numero'));
              }
            } else {
              this.msgs = 'Veuillez saisir la banque !';
              this.styleOvPanel = this.styleOvPanelError;
              document.getElementById('banque').focus();
              this.ov.show(e, document.getElementById('banque'));
            }
          } else {
            await this.modifierBrou();
            this.showCard2 = false;
            this.showNvSaisie = true;
            this.ajouterClicked = false;
            this.allowSelection = true;
            this.ajouterDisabled = false;
            this.validershow = false;
            this.champDisabled = true;
            this.selectedBrou = {};
          }
        } else {
          this.msgs = 'Veuillez saisir le montant !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('montant').focus();
          this.ov.show(e, document.getElementById('montant'));
        }
      } else {
        this.msgs = 'Veuillez selectionner une piece !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('brouPiece').focus();
        this.ov.show(e, document.getElementById('brouPiece'));
      }
      /*
      if (this.selectedBrou.piece === null) {
        this.msgs = "Veuillez selectionner une piece !";
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById("brouPiece").focus();
        this.ov.show(e, document.getElementById("brouPiece"));
      } else if (
        this.selectedBrou.piece === "TRAITE" ||
        this.selectedBrou.piece === "CHEQUE" ||
        this.selectedBrou.piece === "VIR.BNQ"
      ) {
        if (
          this.valueMontant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== "" &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== "" &&
          this.echeance !== null &&
          this.selectedBrou.tire !== "" &&
          this.selectedBrou.tire.length <= "25"
        ) {
          await this.modifierBrou();
          this.showCard2 = false;
          this.showNvSaisie = true;
          this.allowSelection = true;
          this.champDisabled = true;
          this.validershow = false;
          this.ajouterClicked = false;
          this.ajouterDisabled = false;

          this.selectedBrou = {};
        } else if (
          this.valueMontant !== null &&
          this.selectedBrou.banque !== null &&
          this.selectedBrou.banque !== "" &&
          this.selectedBrou.numero !== null &&
          this.selectedBrou.numero !== "" &&
          this.selectedBrou.echeance !== null &&
          this.selectedBrou.tire.length > "25"
        ) {
          this.msgs = "Le nombre de caractères maximal est 25 !";
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById("brouTire").focus();
          this.ov.show(e, document.getElementById("brouTire"));
        } else {
          this.msgs = "Remplir tout les champs !";
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById("btValider"));
        }
      } else if (
        this.selectedBrou.piece !== null &&
        this.valueMontant !== null
      ) {
        this.selectedBrou.tire = null;
        this.selectedBrou.echeance = null;
        this.selectedBrou.numero = null;
        this.selectedBrou.banque = null;

        await this.modifierBrou();
        this.showCard2 = false;
        this.showNvSaisie = true;
        this.allowSelection = true;
        this.champDisabled = true;
        this.validershow = false;
        // this.afficherShow = true;
        this.modifierClicked = false;
        this.ajouterDisabled = false;
        this.selectedBrou = {};
      } else {
        this.msgs = "Remplir tout les champs !";
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById("btValider"));
      }
    */
    }
  }
  async apurement() {
    this.Appurement.clients = this.clients;
    if (this.typeClt === 'N') {
      this.Appurement.var = 1;
    } else {
      this.Appurement.var = 2;
    }
    this.Appurement.selectedDebit = null;
    this.Appurement.selectedCredit = null;
    this.Appurement.selectedClient = this.selectedClient;
    this.Appurement.codeClient = this.selectedClient.code;
    this.Appurement.sensCredit = 'C';
    this.Appurement.sensDebit = 'D';
    this.Appurement.fromOutside = true;
    await this.Appurement.afficher();
    this.display = true;
    this.Appurement.hiddenNouSais = true;
  }
  async close() {
    if (this.typeClt === 'N') {
      await this.ListBrou();
    } else {
      await this.ListBrouCont();
    }
  }
  nouveau(): void {
    this.brouDebit = [];
    this.brouCredit = [];
    this.totalCredit = null;
    this.totalDebit = null;
    this.solde = null;
    this.histNombreIMP = null;
    this.histTotalIMP = null;
    this.nombreIMP = null;
    this.totalIMP = null;
    // this.selectedClient = null;
    this.intialiserSelectedClient();
    this.ajouterDisabled = true;
    this.modifierDisabled = true;
    this.supprimerDisabled = true;
    this.ngselectDisabled = false;
    this.validershow = false;
    this.champDisabled = true;
    this.ajouterClicked = false;
    this.apurementshow = false;
    this.modifierClicked = false;
    this.allowSelection = true;
    this.selectedBrou = {};
    this.date = new Date();
    this.echeance = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.codeClient = '';
    this.afficherShow = false;
    this.showCard1 = false;
    setTimeout(() => document.getElementById('codeClt').focus(), 10);
  }
  annuler(): void {
    this.ajouterDisabled = false;
    this.validershow = false;
    this.maxIdPlus1 = null;
    this.champDisabled = true;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.allowSelection = true;
    this.selectedBrou = {};
    this.echeance = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    this.showCard2 = false;
    this.showNvSaisie = true;
  }
  async supprimerBrou() {
    if (this.typeClt === 'N') {
      await this.brouService
        .deleteBrou(this.selectedBrou.id)
        .toPromise()
        .then(
          (data) => {},
          (error) => console.log('There was an error: ', error)
        );
      await this.ListBrou();
    } else {
      await this.brouContService
        .deleteBrou(this.selectedBrou.id)
        .toPromise()
        .then((data) => {});
      await this.ListBrouCont();
    }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        'SP ' +
          String(this.selectedBrou.piece).substr(0, 3) +
          ' N° ' +
          this.selectedBrou.numero +
          ' CL ' +
          this.selectedBrou.compte +
          ' MT ' +
          this.selectedBrou.montant
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }
  async modifierBrou() {
    if (this.selectedBrou.piece === 'VIR.BNQ') {
      this.selectedBrou.echeance = null;
    }
    if (this.selectedBrou.piece === 'DIFF-') {
      this.selectedBrou.sens = 'D';
    } else {
      this.selectedBrou.sens = 'C';
    }
    if (this.typeClt === 'N') {
      await this.brouService
        .updateput(this.selectedBrou)
        .toPromise()
        .then(
          async (data) => {
            await this.ListBrou();
          },
          (error) => console.log('There was an error: ', error)
        );
    } else {
      await this.brouContService
        .updateput(this.selectedBrou)
        .toPromise()
        .then(async (data) => {
          await this.ListBrouCont();
        });
    }
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        'MD ' +
          String(this.selectedBrou.piece).substr(0, 3) +
          ' N° ' +
          this.selectedBrou.numero +
          ' CL ' +
          this.selectedBrou.compte +
          ' MT ' +
          this.selectedBrou.montant
      )
      .toPromise()
      .then((data) => {
        console.log(data);
      });
  }

  async supprimer(e) {
    this.wasInside = true;
    this.ov.hide();
    const d = this.date.split('/');
    const d1 = new Date(+d[2], +d[1] - 1, +d[0]);
    const d2 = new Date(this.dateCaisse);

    if (d1 <= d2) {
      this.msgs = 'La suppression de cette ligne n\'est pas possible';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btSupprimer'));
    } else {
      await this.supprimerBrou();

      this.allowSelection = true;
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
      this.selectedBrou = {};
      this.date = new Date();
      this.echeance = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    }
  }
  modifier(e) {
    this.wasInside = true;
    this.ov.hide();
    const d = this.date.split('/');
    const d1 = new Date(+d[2], +d[1] - 1, +d[0]);
    const d2 = new Date(this.dateCaisse);
    if (
      d1 <= d2 ||
      this.selected.piece === 'FACTURE' ||
      this.selected.piece === 'AVOIR'
    ) {
      this.msgs = 'La modification de cette ligne n\'est pas possible';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btModifier'));
      this.allowSelection = true;
    } else {
      this.allowSelection = false;
      this.champDisabled = false;
      this.ajouterClicked = false;
      this.modifierClicked = true;
      this.modifierDisabled = true;
      this.supprimerDisabled = true;
      this.ajouterDisabled = true;
      this.validershow = true;
      setTimeout(() => this.ngSelectPiece.focus(), 1);
    }
    this.showCard2 = true;
    this.showNvSaisie = false;
  }

  rowSelected(args: RowSelectEventArgs) {
    if (this.gridCredit.getSelectedRecords().length > 0) {
      this.modifierDisabled = false;
      this.supprimerDisabled = false;
      this.selected = this.gridCredit.getSelectedRecords()[0];

      if (
        this.selected.piece === 'CHEQUE' ||
        this.selected.piece === 'TRAITE' ||
        this.selected.piece === 'AVOIR' ||
        this.selected.piece === 'RS' ||
        this.selected.piece === 'VIR.BNQ' ||
        this.selected.piece === 'DIFF+' ||
        this.selected.piece === 'ESPECE'
      ) {
        this.selectedBrou.montant = this.selected.credit;
      } else {
        this.selectedBrou.montant = this.selected.debit;
      }
      this.selectedBrou.piece = this.selected.piece;
      this.selectedBrou.numero = this.selected.numero;
      this.selectedBrou.libelle = this.selected.libelle;
      this.date = this.selected.date;
      this.echeance = this.selected.echeance;
      this.selectedBrou.date = this.selected.date;
      this.selectedBrou.echeance = this.selected.echeance;
      this.selectedBrou.tire = this.selected.tire;
      this.selectedBrou.banque = this.selected.banque;
      this.selectedBrou.id = this.selected.id;
      this.selectedBrou.code = this.selected.code;
      this.selectedBrou.compte = this.selected.compte;
      this.selectedBrou.nature = this.selected.nature;
      this.selectedBrou.sens = this.selected.sens;
      this.selectedBrou.regle = this.selected.regle;
      this.selectedBrou.num = this.selected.num;
      this.selectedBrou.cle = this.selected.cle;
      this.selectedBrou.op1 = this.selected.op1;
      this.selectedBrou.operateur = this.selected.operateur;
      this.selectedBrou.lig = this.selected.lig;
      this.selectedBrou.apurement = this.selected.apurement;
      this.selectedBrou.dateApur = this.selected.dateApur;
      this.selectedBrou.datVer = this.selected.datVer;
      this.selectedBrou.datRec = this.selected.datRec;
      this.selectedBrou.etat = this.selected.etat;
      this.selectedBrou.etat2 = this.selected.etat2;
      this.selectedBrou.banqEqm = this.selected.banqEqm;
      this.selectedBrou.borVer = this.selected.borVer;
      this.selectedBrou.borEnc = this.selected.borEnc;
      this.selectedBrou.borRtr = this.selected.borRtr;
      this.selectedBrou.numPiece = this.selected.numPiece;
    }
  }

  setTire() {
    if (
      this.modifierClicked &&
      (this.selectedBrou.piece === 'CHEQUE' ||
        this.selectedBrou.piece === 'TRAITE' ||
        this.selectedBrou.piece === 'VIR.BNQ')
    ) {
      this.selectedBrou.tire = String(this.deno).substr(0, 25);
      this.echeance = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.selectedBrou.echeance = this.echeance;
    }
    if (this.selectedBrou.piece !== '' && this.selectedBrou.piece !== null) {
      setTimeout(() => document.getElementById('montant').focus(), 1);
    }
  }
  onselect(event) {
    this.selectedBrou.date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
  }
  onselectEch(event: string) {
    this.selectedBrou.echeance = this.datePipe.transform(
      this.echeance,
      'dd/MM/yyyy'
    );
  }
  intialiserSelectedClient() {
    // console.log('ok');
    this.selectedClient = {
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
  /*
  async applyFilterClientParCode(e) {
    let filteredElements = [];
    await this.clientService
      .getClientByCode(e.target.value)
      .toPromise()
      .then((data) => {
        filteredElements = data["_embedded"].clients;
      });
    if (filteredElements.length > 0) {
      this.selectedClient = filteredElements[0];
      this.afficherShow = true;
    } else {
      this.afficherShow = false;
      this.msgs = "Code Client Inexistant !";
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById("codeClt").focus();
      this.ov.show(e, document.getElementById("codeClt"));
    }
  }*/
  async updateOnSelect() {
    if (!this.ngselectDisabled) {
      if (this.selectedClient !== null) {
        if (this.selectedClient.id !== null) {
          this.codeClient = this.selectedClient.code;
          this.afficherShow = true;
        } else {
          this.codeClient = '';
          this.afficherShow = false;
        }
      } else {
        this.codeClient = '';
        this.afficherShow = false;
      }
    }
  }
  /*async applyFilterClientParDeno(filtredValue: string) {
    await this.clientService
      .getClientsTop100ByDenoStartsWith(filtredValue)
      .toPromise()
      .then((data) => {
        this.clients = data["_embedded"].clients;
      });
  }*/
  annulerSelection(): void {
    if (!this.ajouterClicked) {
      if (this.gridCredit.getSelectedRowIndexes()[0] >= 0) {
        this.modifierDisabled = true;
        this.supprimerDisabled = true;
        this.gridCredit.selectRows([]);
        this.selectedBrou = {};
      }
    }
  }
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async apercu() {
    this.wasInside = true;
    this.ov.hide();
    let sste: any;
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        sste = data['_embedded'].ste[0];
      });
    // const displayDate = new Date().toLocaleDateString('en-GB');
    // const displayTime = new Date().toLocaleTimeString();
    const doc1 = new jspdf();
    // page a4 (210 x 297 mm)
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text('SOCIETE  :   ' + sste.societe, 10, 10);
    /*doc1.text("ADRESSE :   " + this.ste.adresse, 14, 15);
    doc1.text("VILLE       :   " + this.ste.ville, 14, 20);
    doc1.text("TEL           :   " + this.ste.tel, 14, 25);
    doc1.text("FAX          :   " + this.ste.fax, 14, 30);
    doc1.text("E-mail       :   " + this.ste.email, 14, 35);

    doc1.text(
      "Tunis le : " +
        this.tn.dayNames[new Date().getDay() - 1] +
        " " +
        displayDate +
        " à " +
        displayTime,
      147,
      35
    );*/

    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Règlements des Clients', 80, 20);

    doc1.setFontSize(10);

    doc1.text('Code Client : ' + this.selectedClient.code, 10, 30);
    doc1.text('Raison Sociale : ' + this.selectedClient.deno, 60, 30);

    doc1.setFontStyle('bold');
    doc1.line(10, 35, 200, 35);
    // ligne Horizontal doc1.line(x1,y1,x2,y2)

    doc1.text('Code', 10, 39);
    doc1.text('Pièce', 40, 39);
    doc1.text('Numéro', 70, 39);
    doc1.text('Mnt Débit', 100, 39);
    doc1.text('Mnt Crédit', 130, 39);
    doc1.text('Libelle', 160, 39);
    doc1.line(10, 42, 200, 42);
    doc1.setFontStyle('normal');
    let y = 47;
    const total = 0;
    for (const br of this.brouCredit) {
      doc1.text(br.date, 10, y);
      doc1.text(br.piece, 40, y);
      if (br.numero !== null) {
        doc1.text(br.numero, 72, y);
      } else {
        doc1.text('', 72, y);
      }
      doc1.text(br.debit, 115, y, 'right');
      doc1.text(br.credit, 147, y, 'right');
      if (br.libelle !== null) {
        doc1.text(br.libelle, 160, y);
      } else {
        doc1.text('', 160, y);
      }
      y = y + 7;
      if (y > 277) {
        doc1.line(10, y - 3, 200, y - 3, 'FD');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        doc1.setFontStyle('bold');
        doc1.line(10, 20, 200, 20);
        // ligne Horizontal doc1.line(x1,y1,x2,y2)

        doc1.text('Code', 10, 24);
        doc1.text('Libellé', 40, 24);
        doc1.text('Numéro', 70, 24);
        doc1.text('Mnt Débit', 100, 24);
        doc1.text('Mnt Crédit', 130, 24);
        doc1.text('Libelle', 160, 24);

        doc1.line(10, 27, 200, 27);
        doc1.setFontStyle('normal');
        y = 32;
      }
    }
    doc1.line(10, y - 3, 200, y - 3, 'FD');
    doc1.setFontStyle('bold');
    doc1.text('Totaux : ', 60, y + 3);
    doc1.text(this.totalDebit, 115, y + 3, 'right');
    doc1.text(this.totalCredit, 147, y + 3, 'right');
    doc1.text('Solde :', 165, y + 3);
    doc1.text(this.solde, 200, y + 3, 'right');
    doc1.setFontStyle('normal');
    doc1.text('Page ' + numPage.toFixed(0), 100, 289);
    window.open(doc1.output('bloburl'), '_blank');
  }
  formatMontant() {
    if (String(Number(this.selectedBrou.montant)) !== 'NaN') {
      if (Number(this.selectedBrou.montant).toFixed(3).length < 11) {
        this.selectedBrou.montant = Number(this.selectedBrou.montant).toFixed(
          3
        );
      } else {
        this.selectedBrou.montant = '';
      }
    } else {
      this.selectedBrou.montant = '';
    }
  }
  async applyFilterClientParCode(e) {
    /*let filteredElements = [];
    await this.clientService
      .getClientByCode(e.target.value)
      .toPromise()
      .then((data) => {
        filteredElements = data['_embedded'].clients;
      });
    if (filteredElements.length > 0) {
      this.selectedClient = filteredElements[0];*/
    const result = this.clients.find(({ code }) => code === this.codeClient);
    if (String(result) !== 'undefined') {
      this.selectedClient = result;
      this.afficherShow = true;
      setTimeout(() => document.getElementById('btAfficher').focus(), 10);
    } else {
      this.afficherShow = false;
      this.selectedClient = null;
      this.msgs = 'Code Client Inexistant !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('codeClt').focus();
      this.ov.show(e, document.getElementById('codeClt'));
    }
  }
  public onSearchPiece(word: string, item: any): boolean {
    return item.label.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  moveToNextInput(e, index: number) {
    console.log(index);

    if (index === 0) {
      if (
        this.selectedBrou.montant !== '' &&
        this.selectedBrou.montant !== null
      ) {
        this.formatMontant();
        if (this.selectedBrou.montant !== '0.000') {
          if (
            this.selectedBrou.piece === 'CHEQUE' ||
            this.selectedBrou.piece === 'TRAITE' ||
            this.selectedBrou.piece === 'VIR.BNQ'
          ) {
          document.getElementById('numero').focus();
        } else {
          document.getElementById('observation').focus();
        }
        }
      }
    }
    if (index === 1) {
      if (
        this.selectedBrou.numero !== '' &&
        this.selectedBrou.numero !== null
      ) {
        if (this.selectedBrou.piece === 'VIR.BNQ') {
          document.getElementById('observation').focus();
        } else {
          setTimeout(() => this.inputMaskEcheance.focus(), 1);
        }
      }
    }
    if (index === 2) {
      let echeance = 0;
      const parts = this.echeance.split('/');
      echeance = Date.parse(parts[1] + '/' + parts[0] + '/' + parts[2]);
      console.log(parts[1] + '/' + parts[0] + '/' + parts[2]);
      if (isNaN(echeance)) {
        this.msgs = 'Date Incorrecte !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('echeance').focus();
        this.ov.show(e, document.getElementById('echeance'));
        this.echeance = '';
      } else {
        if (new Date(echeance) < this.minDate) {
          this.msgs = 'Date Incorrecte !';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('echeance').focus();
          this.ov.show(e, document.getElementById('echeance'));
          this.echeance = '';
        } else {
          document.getElementById('banque').focus();
        }
      }
    }
    if (index === 3) {
      if (
        this.selectedBrou.banque !== '' &&
        this.selectedBrou.banque !== null
      ) {
        document.getElementById('observation').focus();
      }
    }
    if (index === 4) {
      document.getElementById('tire').focus();
    }
    if (index === 5) {
      if (
        this.selectedBrou.tire !== '' &&
        this.selectedBrou.tire !== null
      ) {
        setTimeout(() => document.getElementById('btValider').focus(), 1);
      }
    }
  }
}
