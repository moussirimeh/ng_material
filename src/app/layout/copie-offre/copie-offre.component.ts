import { DatePipe } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewChecked,
} from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  SearchSettingsModel,
  ToolbarService,
  ResizeService,
} from '@syncfusion/ej2-angular-grids';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ClientService } from '../services/client.service';
import { StockService } from '../services/stock.service';
import { OverlayPanel, Dialog } from 'primeng/primeng';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { EdevisService } from '../services/edevis.service';
import { DdevisService } from '../services/ddevis.service';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { Table } from 'primeng/table';
import { CommandeService } from '../services/commande.service';
import { Devis } from '../services/devis';
import { DevisService } from '../services/devis.service';
import { BrouService } from '../services/brou.service';
import * as jspdf from 'jspdf';
import { NomClientOffreService } from '../services/nomClientOffre.service';
import { SteService } from '../services/ste.service';
import { ReleveClientComponent } from '../releveClient/releveClient.component';
import { CmdsFrsNonSoldeesComponent } from '../cmds-frs-non-soldees/cmds-frs-non-soldees.component';
import { ImpressionOffreService } from '../services/impression-offre.service';

@Component({
  selector: 'app-copie-offre',
  templateUrl: './copie-offre.component.html',
  styleUrls: ['./copie-offre.component.scss'],
  providers: [MessageService, ToolbarService, ResizeService, ConfirmationService, DatePipe, ImpressionOffreService],
  encapsulation: ViewEncapsulation.None,
})
export class CopieOffreComponent implements OnInit {
  @ViewChild(ReleveClientComponent) Releve;
  @ViewChild(CmdsFrsNonSoldeesComponent) cmdfrs;
  visible = false;
  visible2 = false;
  offreId: any;
  focusRemise: boolean;
  prixTot: number;
  calculTotPrix = false;
  affichValider = true;
  codeCmd: any;
  sommettc: any;
  totBrut: any;
  remise: any;
  s_base0: any;
  s_base10: any;
  s_base18: any;
  s_base29: any;
  totTTC: number;
  s_Total1: number;
  s_remise: any;
  s_net: any;
  s_ht: any;
  flag_timbre = false;
  flag_exonor = false;
  s_Total1CH: string;
  s_remisech: string;
  tva13: number;
  tva13ch: string;
  tva19: number;
  tva19ch: string;
  tva7: number;
  tva7ch: string;
  s_netch: string;
  tva: number;
  tvach: any;
  numOff: any;
  qteEncours: any;
  basDePage: any;
  caracters: any;
  readonlyBasDP = false;
  readonlyAgenda = false;
  nbrDesOffresTotals: any;
  mtTotalDesOffres: any;
  mtSatisfTotal: any;
  pourcSatisfTotal: any;
  evaluation: any;
  evalClient = false;
  controle: any;
  controleMsg: any;
  tRemise: any;
  V1: any;
  V2: string;
  societe: any;
  devis: Devis = {
    id: '',
    numero: '',
  };
  sortOptions = 'date';
  displayDevClt = false;
  entete = false;
  totaux = false;
  offreAutorisé = true;
  codedeno: any;
  currentAgenda = '';
  currentCode = '';
  blockDocument = false;
  constructor(
    private config: NgSelectConfig,
    private clientService: ClientService,
    private edevisService: EdevisService,
    private stockService: StockService,
    private vendeur1Service: Vendeur1Service,
    private ddevisService: DdevisService,
    private confirmationService: ConfirmationService,
    private datepipe: DatePipe,
    private nomClientOffreService: NomClientOffreService,
    private steService: SteService,
    private messageService: MessageService,
    private impressionOffreService: ImpressionOffreService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
    this.dated = new Date();
  }

  @ViewChild('dt')
  public table: Table;
  focusQte = true;

  public editSettings: EditSettingsModel;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridOffres')
  public gridOffres: GridComponent;

  ajout = false;
  @ViewChild('gridstock')
  public gridstock: GridComponent;

  @ViewChild('gridDetailsOffre')
  public gridDetailsOffre: GridComponent;

  @ViewChild('gridMouves')
  public gridMouves: GridComponent;

  @ViewChild('gridMouves1')
  public gridMouves1: GridComponent;

  @ViewChild('gridMouves2')
  public gridMouves2: GridComponent;

  @ViewChild('gridcmd')
  public gridcmd: GridComponent;

  @ViewChild('op')
  public op: OverlayPanel;
  readonly: boolean;
  tn;
  m;
  editrow = false;
  readonly1: boolean;
  dated: Date;
  adresse;
  codeTva;
  ville;
  tel;
  fax;
  mail;
  numDev;
  codeOffre;
  detailsOffre = new Array();
  etab_cmd: boolean;
  totalise: boolean;
  mySelection = [];

  wasInside: boolean;
  refCmd: string;
  RefDemPr: string;
  clients = [];
  selectedClient;
  codeClient: any;
  vendeurs: any;
  selectedVendeur: any;
  codeVendeur: any;
  listeOffres = new Array();
  afficherOffres: boolean;
  refArticle = '';
  refArticleRech = '';
  listeStocks: any[];
  selectedArticle: any;
  selectedArticleIndex = 0;
  mvtAnnCournte: any;
  equivalences: any;
  listeStockCMD = new Array();
  selectedStock = new Array();
  disable: boolean;
  msg: string;
  afficherNum_dev: boolean;
  responsable = 'Mr. ';
  remiseGlobale: any = 0;
  mouve: any;
  datePr: any;
  qteClient: any;
  qteComm = false;
  notreRef: string;
  dateOffre: any;

  public searchOptions: SearchSettingsModel;
  searchDetails: SearchSettingsModel;
  listesOffresload = new Array();
  selectedOff: any;
  selectedDetailsOffr: any;
  newArt: {
    id: any;
    prixInit: any;
    prix: any;
    code: any;
    design: any;
    quantite: any;
    qte: any;
    marge: any;
    tva: any;
    prixtot: any;
    numdev: any;
    agenda: any;
  };
  articleStck: any;
  v_marge: any;
  valide = false;
  offreCharge = false;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Set the new row in edit mode
    if (this.listeStockCMD.length > 3 && this.ajout === true) {
      this.table.handleVirtualScroll('click');
      event.preventDefault();
    }
  }

  annulerCMD(e) {
    this.visible = false;
    this.visible2 = false;
    this.offreCharge = false;
    this.V2 = null;
    this.m = null;
    this.listeOffres = new Array();
    this.listeStockCMD = new Array();
    this.selectedStock = new Array();
    this.selectedClient = null;
    this.selectedVendeur = null;
    this.qteEncours = null;
    this.adresse = null;
    this.codeTva = null;
    this.ville = null;
    this.tel = null;
    this.fax = null;
    this.mail = null;
    this.refCmd = null;
    this.RefDemPr = null;
    this.codeClient = null;
    this.codeVendeur = null;
    this.etab_cmd = false;
    this.totalise = false;
    this.refArticle = null;
    this.refArticleRech = null;
    this.listeStocks = new Array();
    this.codeOffre = null;
    this.detailsOffre = new Array();
    this.evalClient = false;
    this.valide = false;
    this.qteComm = false;

    this.s_Total1CH = null;
    this.s_remisech = null;
    this.tva13 = null;
    this.tva13ch = null;
    this.tva19 = null;
    this.tva19ch = null;
    this.tva7 = null;
    this.tva7ch = null;
    this.s_netch = null;
    this.tvach = null;

    this.tva = 0;
    this.s_Total1 = 0;
    this.s_remise = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_net = 0;
    this.s_base0 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;
    setTimeout(() => {
      document.getElementById('num').focus();
    }, 10);
  }

  async rowSelected(e) {
    this.qteComm = false;
    if (this.gridstock.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridstock.getSelectedRecords()[0];
      this.selectedArticle = this.gridstock.getSelectedRecords()[0];
    }
  }

  ngAfterViewChecked() {
    if (this.selectedStock.length > 0 && this.ajout) {
      this.scrollToBottom();
      //  this.commandeLength = this.demandeCommande.length;
    }
  }
  private scrollToBottom(): void {
    if (
      this.selectedStock[this.selectedStock.length - 1].id !== null &&
      this.selectedStock[this.selectedStock.length - 1].id !== undefined
    ) {
      document
        .getElementById(
          `row_${this.selectedStock[this.selectedStock.length - 1].id}`
        )
        .scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'start',
        });
    }
  }

  async validationCmd(e) {
    const edevis = {
      id: null,
      numDev: null,
      datDev: null,
      net: null,
      ht: null,
      remise: null,
      cltDev: null,
      vendeur: null,
      ref: null,
      base0: null,
      base10: null,
      base17: null,
      base29: null,
      purDev: null,
      tauxTva: null,
      modep: null,
      delLiv: null,
      delOp: null,
      refDem: null,
      dateEnvoi: null,
      attention: null,
      basPage: null,
      suivie: null,
      agenda: null,
      mtSatisfTtc: null,
      remGen: null,
    };
    edevis.id = this.offreId;
    edevis.numDev = this.V2;
    // edevis.ref =  this.numOff ;
    edevis.datDev = this.dated.toLocaleDateString('en-GB');
    edevis.net = this.s_netch;
    edevis.ht = this.s_Total1CH;
    edevis.remise = this.s_remisech;
    edevis.cltDev = this.codeClient;
    edevis.vendeur = this.codeVendeur;
    edevis.ref = this.refCmd;
    edevis.dateEnvoi = this.dateOffre;
    edevis.basPage = this.basDePage;
    this.responsable ? edevis.attention = this.responsable : edevis.attention = '';
    console.log(edevis);
    // await this.edevisService.updateEdevis(edevis).subscribe((data) => {});
  }

  async valider(e) {
    this.totaliser(e, this.listeStockCMD);
    this.offreAutorisé = false;
    this.listeStockCMD.map(async ob => {
      await this.ddevisService
        .getDdevisByNumDevAndCode(this.V2, ob.code)
        .toPromise()
        .then((data) => {
          data['_embedded'].ddevis[0] && data['_embedded'].ddevis[0].coutVenteMinim ? ob.min = data['_embedded'].ddevis[0].coutVenteMinim : ob.min = ob.min;
        });
      if (ob.coefMarge && ob.min > 0 && ob.prix - (ob.prix * ob.marge / 100) < ob.min) {
        this.offreAutorisé = false;
        this.confirmationService.confirm({
          message: 'Attention la marge est inférieure à ' + Number((ob.coefMarge - 1) * 100).toFixed(2) + '%, Prix minimal est ' + ob.min,
          header: 'Avertissement',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          accept: async () => { },
        });
      } else {
        this.offreAutorisé = true;
      }
      if (this.offreAutorisé === true) {
        // await this.validationCmd(e);
        this.valide = true;
      }
    });
  }

  totaliser(e, liste) {
    this.s_Total1 = 0;
    this.s_remise = 0;
    this.s_base0 = 0;
    this.s_net = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;
    this.tva = 0;
    this.totalise = true;
    // this.totTTC = 0;
    for (const obj of liste) {
      this.s_Total1 = this.s_Total1 + Number(obj.prixtot);
      this.s_remise =
        this.s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;
      this.s_remise =
        this.s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;
      switch (Number(obj.tva).toFixed(2)) {
        case '0.00': {
          this.s_base0 =
            this.s_base0 + Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
        case '13.00': {
          this.s_base10 =
            this.s_base10 +
            Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
        case '19.00': {
          this.s_base18 =
            this.s_base18 +
            Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
        case '7.00': {
          this.s_base29 =
            this.s_base29 +
            Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
      }
    }
    this.tva = this.s_base10 * 0.13 + this.s_base18 * 0.19 + this.s_base29 * 0.07;
    this.s_net =
      this.s_base0 +
      this.s_base10 * 1.13 +
      this.s_base18 * 1.19 +
      this.s_base29 * 1.07;
    this.s_ht = this.s_base0 + this.s_base10 + this.s_base18 + this.s_base29;
    this.s_remise = this.s_Total1 - this.s_ht;
    this.s_Total1CH = Number(this.s_Total1).toFixed(3);
    this.s_remisech = Number(this.s_remise).toFixed(3);

    this.tva13 = this.s_base10 * 0.13;
    this.tva13ch = Number(this.tva13).toFixed(3);
    this.tva19 = this.s_base18 * 0.19;
    this.tva19ch = Number(this.tva19).toFixed(3);
    this.tva7 = this.s_base29 * 0.07;
    this.tva7ch = Number(this.tva7).toFixed(3);
    this.tvach = Number(this.tva).toFixed(3);
    if (this.flag_timbre) {
      this.s_net = this.s_net + 0.6;
    }
    this.s_netch = Number(this.s_net).toFixed(3);
  }
  async ngOnInit() {
    this.visible = false;
    this.visible2 = false;
    this.entete = false;
    this.flag_timbre = false;
    this.flag_exonor = false;
    // this.v_marge = 0;

    this.tn = {
      firstDayOfWeek: 0,
      dayNames: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
      ],
      dayNamesShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      dayNamesMin: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
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
    this.etab_cmd = false;
    this.totalise = false;
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };
    this.afficherNum_dev = false;
    this.afficherOffres = false;
    this.codeVendeur = '';
    this.codeClient = '';
  }

  async changeSelectedItem() {
    this.ville = this.selectedClient.ville;
    this.codeTva = this.selectedClient.codeTva;
    this.selectedClient.tel ? this.tel = this.selectedClient.tel : this.tel = '         ';
    this.selectedClient.fax ? this.fax = this.selectedClient.fax : this.fax = '';
    this.mail = this.selectedClient.eMail;
    this.m = this.selectedClient.deno;
    this.adresse = this.selectedClient.adresse;
    this.selectedClient.respon ? this.responsable = 'Mr. ' + this.selectedClient.respon : this.responsable = 'Mr.';
    if (
      Number(this.selectedClient.marque) > 0 &&
      (this.selectedClient.terme === 'O' || this.selectedClient.typeC === 'O')
    ) {
      this.v_marge = this.selectedClient.marque;
    } else {
      this.v_marge = 0;
    }

    if (this.selectedClient.timbre === 'O') {
      this.flag_timbre = true;
    } else {
      this.flag_timbre = false;
    }
    if (this.selectedClient.exonor === 'O') {
      this.flag_exonor = true;
    } else {
      this.flag_exonor = false;
    }
  }

  changeSelectedVendeur() {
    if (this.selectedVendeur !== null && this.selectedVendeur !== undefined) {
      this.codeVendeur = this.selectedVendeur.code;
    } else {
      this.codeVendeur = '';
    }
  }
  public onSearchItemclt(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.messageService.clear();
      this.op.hide();
    }
    this.wasInside = false;
  }

  async imprimer() {
    const totaux = this.totaux;

    this.impressionOffreService.imprimer(this.V2, this.entete, totaux);
  }

  verifierNumero() {
    this.messageService.clear();
    this.op.visible = false;
    const num: string = String(this.V2);
    this.V2 = num;

    if (this.V2 === 'null') {
      this.V2 = '';
    } else {
      switch (this.V2.length) {
        case 1: {
          this.V2 = '0000' + this.V2;
          break;
        }
        case 2: {
          this.V2 = '000' + this.V2;
          break;
        }
        case 3: {
          this.V2 = '00' + this.V2;
          break;
        }
        case 4: {
          this.V2 = '0' + this.V2;
          break;
        }
        default: {
          break;
        }
      }
    }
    this.V1 = this.V2;
  }
  async getByNumero(e) {
    this.blockDocument = true;
    this.messageService.clear();
    this.readonly = true;
    this.verifierNumero();
    await this.edevisService
      .findByNumDev(this.V2)
      .toPromise()
      .then((data) => {
        console.log(data['_embedded'].edevis[0]);
        if (data['_embedded'].edevis[0]) {
          this.offreId = data['_embedded'].edevis[0].id;
          this.dateOffre = new Date(data['_embedded'].edevis[0].dateEnvoi).toLocaleDateString('en-GB');
          this.remiseGlobale = data['_embedded'].edevis[0].remGen;
          this.codeClient = data['_embedded'].edevis[0].cltDev;
          this.codeVendeur = data['_embedded'].edevis[0].vendeur;
          this.refCmd = data['_embedded'].edevis[0].ref;
          this.basDePage = data['_embedded'].edevis[0].basPage;
          this.responsable = data['_embedded'].edevis[0].attention;
        }
      });
    // si offre inéxistant
    if (!this.codeClient) {
      this.msg = 'Offre inéxistant !';
      this.op.show(e, document.getElementById('num'));
      this.readonly = false;
    } else {
      this.readonly = false;
      this.affichValider = false;
      this.offreCharge = true;
      this.etab_cmd = true;
      await this.ddevisService
        .findByCombineOrderByRang(this.V2)
        .toPromise()
        .then((data) => {
          let ddev = [];
          const details = data['_embedded'].ddevis;
          details.map(async el => {
            await this.stockService
            .getStock(el.code)
            .toPromise()
            .then((data) => {
              if (data['_embedded'].stocks[0]) {
                el.achat = data['_embedded'].stocks[0].achat,
                el.operateur = data['_embedded'].stocks[0].operateur;
              }
            });
            const ddevis = {
              id: el.id,
              code: el.code,
              qte: el.quantite,
              marge: el.tRemise,
              prix: el.prix,
              prixInit: el.prix / (1 - (this.remiseGlobale / 100)),
              tva: el.tauxTva,
              design: el.design,
              agenda: el.cartech,
              rang: el.rang,
              min: el.coutVenteMinim,
              prixtot: Number(el.prix * el.quantite).toFixed(3),
              achat: el.achat ? el.achat : 0,
              coefMarge: el.operateur === '4011052' || el.operateur === '4011574' ? 1.2 : 1.25,
            };
            ddev.push(ddevis);
            ddev = ddev.sort((a, b) => (Number(a.rang) > Number(b.rang) ? 1 : -1));
          });
          this.selectedStock = ddev.sort((a, b) => (Number(a.rang) > Number(b.rang) ? 1 : -1));
          this.listeStockCMD = this.selectedStock;
        });
      await this.vendeur1Service
        .getVendeur1ByCode(this.codeVendeur)
        .toPromise()
        .then((data) => {
          this.vendeurs = data['_embedded'].vendeur1;
          this.selectedVendeur = data['_embedded'].vendeur1[0];
        });
      this.totaliser(e, this.listeStockCMD);

      await this.clientService
        .getClientByCode(this.codeClient)
        .toPromise()
        .then((data) => {
          this.selectedClient = data['_embedded'].clients[0];
        });
      await this.changeSelectedItem();
      if (this.codeClient === '7200' || this.codeClient === '7300' || this.codeClient === '7500') {
        await this.nomClientOffreService
        .getNomClientOffreByNumDev(this.V2)
        .toPromise()
        .then((data) => {
          this.selectedClient = data['_embedded'].NomClientOffre[0];

          this.ville = this.selectedClient.ville;
          this.codeTva = this.selectedClient.codeTva;
          this.selectedClient.tel ? this.tel = this.selectedClient.tel : this.tel = '         ';
          this.selectedClient.fax ? this.fax = this.selectedClient.fax : this.fax = '';
          this.m = this.selectedClient.deno;
          this.adresse = this.selectedClient.adresse;
        });
      }
      this.codedeno = this.codeClient + ' ' + this.m;

      await this.valider(e);
    }
    this.blockDocument = false;
  }

  onRowSelect(event) {
    this.currentAgenda = event.data.agenda;
    this.currentCode = event.data.code;
    this.readonlyAgenda = true;
  }

  onRowUnselect() {
    this.mySelection = [];
    this.currentAgenda = '';
    this.currentCode = '';
    this.readonlyAgenda = false;
  }

  showDialogMaximized(dialog: Dialog) {
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }
}
