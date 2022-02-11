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
import { LoginService } from 'src/app/login/login.service';
import { RepresanService } from '../services/represan.service';
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
/** Hack: align header */
ScrollableView.prototype.ngAfterViewChecked = function () {
  if (!this.initialized && this.el.nativeElement.offsetParent) {
    // this.alignScrollBar();
    this.initialized = true;

    new ResizeObserver((entries) => {
      // for (let entry of entries)
      this.alignScrollBar();
    }).observe(this.scrollBodyViewChild.nativeElement);
  }
};

@Component({
  selector: 'app-modification-offre-rg-mg',
  templateUrl: './modification-offre-rg-mg.component.html',
  styleUrls: ['./modification-offre-rg-mg.component.scss'],
  providers: [
    MessageService,
    ToolbarService,
    ResizeService,
    ConfirmationService,
    DatePipe,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ModificationOffreRgMgComponent
  implements OnInit, AfterViewChecked {
  @ViewChild(ReleveClientComponent) Releve;
  @ViewChild(CmdsFrsNonSoldeesComponent) cmdfrs;
  totalEntreesMvts = '';
  totalSortiesMvts = '';
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
    private commandeService: CommandeService,
    private config: NgSelectConfig,
    private clientService: ClientService,
    private edevisService: EdevisService,
    private stockService: StockService,
    private vendeur1Service: Vendeur1Service,
    private mouveService: MouveService,
    private mouve1Service: Mouve1Service,
    private ddevisService: DdevisService,
    private confirmationService: ConfirmationService,
    private mouve2Service: Mouve2Service,
    private devisService: DevisService,
    private loginService: LoginService,
    private datepipe: DatePipe,
    private nomClientOffreService: NomClientOffreService,
    private steService: SteService,
    private represanService: RepresanService,
    private messageService: MessageService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
    // this.dated = new Date();
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
  // dated: Date;
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
  rang = 5;
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

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.op.hide();
    if (this.gridstock !== undefined) {
      if (this.gridstock.getRowInfo(event.target).rowData !== undefined) {
        this.doubleclickStock(event);
        this.gridstock.selectRows([
          this.gridstock.getRowInfo(event.target).rowIndex,
        ]);
      }
    }
  }

  verifCode(data, e) {
    this.wasInside = true;
    if (data.code === null || data.code === undefined || data.code === '') {
      this.msg = 'Veuillez verifier le code , code est obligatoire !!';
      this.op.show(e);
    } else {
      this.mouveToNext(`row_${data.id}_design`);
    }
  }
  verifTva(data, e) {
    this.wasInside = true;
    if (
      data.tva === null ||
      data.tva === undefined ||
      data.tva === '' ||
      !(
        Number(data.tva).toFixed(2) === '0.00' ||
        Number(data.tva).toFixed(2) === '13.00' ||
        Number(data.tva).toFixed(2) === '19.00' ||
        Number(data.tva).toFixed(2) === '7.00'
      )
    ) {
      data.tva = Number(data.tva).toFixed(2);
      this.msg = 'Veuillez verifier le tva !!';
      this.op.show(e);
    } else {
      data.tva = Number(data.tva).toFixed(2);
      this.mouveToNext(`row_${data.id}_prix`);
    }
  }
  verifDesign(data, e) {
    this.wasInside = true;
    if (
      data.design === null ||
      data.design === undefined ||
      data.design === ''
    ) {
      this.msg = 'Veuillez verifier le designiation !!';
      this.op.show(e);
    } else {
      this.mouveToNext(`row_${data.id}_inputQte`);
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Set the new row in edit mode
    if (this.listeStockCMD.length > 3 && this.ajout === true) {
      this.table.handleVirtualScroll('click');
      event.preventDefault();
    }
  }

  onRowEditCancel(rowData, ri) {
    this.ajout = false;
    this.affichValider = false;
    // rowData = this.selectedArticle;
  }

  async mouveToNext(id) {
    if (id !== null) {
      setTimeout(() => {
        document.getElementById(id).focus();
      }, 10);
    }
  }

  async onRowEditSave(rowData, e) {
    this.op.hide();
    this.wasInside = false;
    const art = rowData;

    this.table.initRowEdit(rowData);
    this.calculTotPrix = false;
    const idQte = `row_${rowData.id}_inputQte`;
    console.log(idQte);
    if (idQte !== null && idQte !== undefined) {
      document.getElementById(`row_${rowData.id}_inputQte`).focus();
    }
  }

  async onRowEditInit(rowData, e) {
    this.onRowUnselect();
    this.totalise = false;
    this.currentCode = rowData.code;
    this.currentAgenda = rowData.agenda;
    this.caracters = rowData.agenda;
    this.affichValider = true;
    let i = 0;
    while (i < this.listeStockCMD.length) {
      if (this.listeStockCMD[i].id !== rowData.id) {
        this.setQuantite(rowData, e);
        this.table.cancelRowEdit(this.listeStockCMD[i]);
      } else {
        this.disable = true;
        this.table.initRowEdit(rowData);
      }

      i++;
    }
    this.calculTotPrix = false;
    this.op.hide();
    if (rowData !== null && rowData !== undefined) {
      this.refArticle = rowData.code;
    }
    setTimeout(() => {
      this.mouveToNext(`row_${rowData.id}_inputQte`);
    }, 10);
  }

  async supprimer(rowdata, ri) {
    const index = this.listeStockCMD.indexOf(this.listeStockCMD[ri], 0);
    if (index > -1) {
      this.listeStockCMD.splice(index, 1);
    }
    if (this.listeStockCMD.length === 0) {
      this.affichValider = true;
      this.s_Total1CH = null;
      this.totalise = false;
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
    }
    this.disable = false;
    this.currentAgenda = '';
    this.currentCode = '';
    await this.ddevisService
      .getDdevisByNumDevAndCode(this.V2, rowdata.code)
      .toPromise()
      .then((data) => {
        if (data['_embedded'].ddevis[0]) {
          rowdata.id = data['_embedded'].ddevis[0].id;
          this.ddevisService
            .deleteDdevis(rowdata.id)
            .toPromise()
            .then(
              (d) => {},
              (error) => console.log('There was an error: ', error)
            );
        }
      });
  }

  rechercheMotGridDetais(mot) {
    this.searchDetails = {
      fields: ['code'],
      operator: 'startswith',
      key: mot,
      ignoreCase: true,
    };
  }

  rechercheMotGrid(mot) {
    this.searchOptions = {
      fields: ['numDev'],
      operator: 'startswith',
      key: mot,
      ignoreCase: true,
    };
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

  async equivArticle(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      const equiv = this.selectedArticle.equiv;
      //  const  equiv = '108';
      if (equiv !== null && equiv !== undefined) {
        await this.stockService
          .getStockByEquiv(equiv)
          .toPromise()
          .then((data) => {
            this.equivalences = data['_embedded'].stocks;
          });
      } else {
        this.equivalences = new Array();
      }
      // this.listeStocks = this.equivalences;
    }
  }

  async afficherMvtAnnCourante_2(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      const code = this.selectedArticle.code;
      this.mouve = 'mouve2';
      await this.mouve2Service
        .getMouve2ByCodeForConsultationRef(code)
        .toPromise()
        .then((data) => {
          if (this.sortOptions === 'client') {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks.sort(
              (a, b) => (a.deno > b.deno ? 1 : -1)
            );
          } else {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
          }
        });
    }
  }

  async afficherMvtAnnCourante_1(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      const code = this.selectedArticle.code;
      this.mouve = 'mouve1';
      await this.mouve1Service
        .getMouve1ByCodeForConsultationRef(code)
        .toPromise()
        .then((data) => {
          if (this.sortOptions === 'client') {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks.sort(
              (a, b) => (a.deno > b.deno ? 1 : -1)
            );
          } else {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
          }
        });
    }
  }

  async afficherMvtAnnCourante(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      const code = this.selectedArticle.code;
      this.mouve = 'mouve';
      await this.mouveService
        .getMouveByCodeForConsultationRef(code)
        .toPromise()
        .then((data) => {
          if (this.sortOptions === 'client') {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks.sort(
              (a, b) => (a.deno > b.deno ? 1 : -1)
            );
          } else {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
          }
        });
    }
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

  async setQuantite(art, e) {
    const qte = art.qte;
    const art_quantite = art.quantite;
    const id = art.id;
    this.op.hide();
    this.wasInside = true;
    if (qte !== null && qte !== undefined && Number(qte) !== 0) {
      const qte_stock = Number(art_quantite);
      const qte_saisie = Number(qte);
      this.mouveToNext(`row_${id}_marge`);
    } else {
      this.ajout = true;
      // this.calculTotPrix = false;
      this.table.initRowEdit(art);
      this.disable = true;
      this.msg = 'veuillez donner la quantité';
      document.getElementById(`row_${id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.op.show(e, document.getElementById(`row_${id}_qte`));
      this.ajout = false;
      this.table.initRowEdit(art);
    }
  }

  async validationCmd(e) {
    this.blockDocument = true;
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
    edevis.datDev = this.dateOffre.toLocaleDateString();
    edevis.net = this.s_netch;
    edevis.ht = this.s_Total1CH;
    edevis.remise = this.s_remisech;
    edevis.cltDev = this.codeClient;
    edevis.vendeur = this.codeVendeur;
    edevis.ref = this.refCmd;
    edevis.dateEnvoi = this.dateOffre.toLocaleDateString();
    edevis.basPage = this.basDePage;
    this.responsable
      ? (edevis.attention = this.responsable)
      : (edevis.attention = '');
    await this.edevisService
      .updateEdevis(edevis)
      .toPromise()
      .then((data) => {});
    await this.loginService
      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        this.V2
      )
      .subscribe((data) => {
        console.log(data);
      });
      this.blockDocument = false;
  }

  async valider(e) {
    this.blockDocument = true;
    this.totaliser(e, this.listeStockCMD);
    this.offreAutorisé = true;
    for await (const ob of this.listeStockCMD) {
      await this.ddevisService
        .getDdevisByNumDevAndCode(this.V2, ob.code)
        .toPromise()
        .then((data) => {
          data['_embedded'].ddevis[0] &&
          data['_embedded'].ddevis[0].coutVenteMinim
            ? (ob.min = data['_embedded'].ddevis[0].coutVenteMinim)
            : (ob.min = ob.min);
        });
      if (
        ob.coefMarge &&
        ob.min > 0 &&
        ob.prix - (ob.prix * ob.marge) / 100 < ob.min
      ) {
        this.confirmationService.confirm({
          message:
            'Attention la marge est inférieure à ' +
            Number((ob.coefMarge - 1) * 100).toFixed(2) +
            '%, Prix minimal est ' +
            ob.min,
          header: 'Avertissement',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          accept: async () => {},
        });
        this.offreAutorisé = false;
        this.blockDocument = false;
        break;
      }
    }
    if (this.offreAutorisé === true) {
      this.blockDocument = false;
      this.confirmationService.confirm({
        message: 'Validez l\'OFFRE S.V.P.',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'OK',
        rejectLabel: 'Annuler',
        accept: async () => {
          await this.validationCmd(e);
          this.valide = true;
        },
        reject: () => {
          // this.annulerCMD(e);
        },
      });
    }
  }

  async quantiteCommande(e) {
    const selected: any = this.gridstock.getSelectedRecords()[0];
    let qte = '0';
    let qteClt = '0';
    this.datePr = '';
    await this.commandeService
      .quantiteCommande(selected.code)
      .toPromise()
      .then((data) => {
        if (data['_embedded'].qtComs[0]) {
          qte = data['_embedded'].qtComs[0].qtcom;
          this.datePr = data['_embedded'].qtComs[0].datePr;
          qteClt = data['_embedded'].qtComs[0].qtComClt;
        }
      });
    this.qteEncours = qte;
    this.qteClient = qteClt;
    this.qteComm = true;
  }

  async verifRemise(remise, rawData, e, id) {
    if (remise !== null && remise !== undefined && Number(remise) >= 0) {
      const remiseClt = Number(rawData.marge);
      const remise_saisie = Number(remise);
      if (!this.flag_exonor && id.charAt(0) === '#') {
        this.mouveToNext(`row_${id}_tva`);
      } else {
        this.mouveToNext(`row_${id}_prix`);
      }
      this.v_marge = remiseClt;
    } else {
      this.ajout = true;
      this.msg = 'Remise doit etre un nombre postif';
      document.getElementById(`row_${id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.op.show(e, document.getElementById(`row_${id}_remise`));
      this.ajout = false;
    }
  }

  async verifLigne(prix, rawData, e, id) {
    this.op.hide();
    this.wasInside = true;

    if (
      rawData.code === null ||
      rawData.code === undefined ||
      rawData.code === ''
    ) {
      this.msg = 'veuillez donner le code article !!';

      this.mouveToNext(`row_${rawData.id}_code`);
      this.op.show(e, document.getElementById(`row_${rawData.id}_code`));
    } else {
      if (
        rawData.design === null ||
        rawData.design === undefined ||
        rawData.design === ''
      ) {
        this.msg = 'veuillez donner la désignation de l\'article !!';

        this.mouveToNext(`row_${rawData.id}_design`);
        this.op.show(e, document.getElementById(`row_${rawData.id}_design`));
      } else {
        if (
          rawData.qte === null ||
          rawData.qte === undefined ||
          rawData.qte === '' ||
          Number(rawData.qte) === 0
        ) {
          this.msg = 'veuillez donner la quantite !!';

          this.mouveToNext(`row_${rawData.id}_inputQte`);
          this.op.show(
            e,
            document.getElementById(`row_${rawData.id}_inputQte`)
          );
        } else {
          if (prix !== null && prix !== undefined && Number(prix) > 0) {
            if (
              rawData.coefMarge &&
              rawData.min > 0 &&
              rawData.prix - (rawData.prix * rawData.marge) / 100 < rawData.min
            ) {
              this.confirmationService.confirm({
                message:
                  'Attention la marge est inférieure à ' +
                  Number((rawData.coefMarge - 1) * 100).toFixed(2) +
                  '%, Prix minimal est ' +
                  rawData.min,
                header: 'Avertissement',
                icon: 'pi pi-exclamation-triangle',
                acceptLabel: 'OK',
                rejectLabel: 'Annuler',
                accept: async () => {
                  rawData.agenda = this.currentAgenda;
                  const prix_saisie = Number(prix);
                  const qte = Number(rawData.qte);
                  rawData = this.calculTotalPrix(prix_saisie, qte, rawData);
                  // rawData.prixInit = prix_saisie;
                  this.disable = false;
                  this.currentAgenda = '';
                  this.currentCode = '';
                  this.table.cancelRowEdit(rawData);
                  this.affichValider = false;
                  if (rawData.id === '#') {
                    const id = (Math.random() * 10000).toFixed(0);
                    rawData.id = '#' + id;
                  }
                  const ddevis = {
                    id,
                    combine: this.V2,
                    code: rawData.code,
                    quantite: rawData.qte,
                    tRemise: rawData.marge,
                    prix: rawData.prix,
                    // rawData.prix - (rawData.prix * this.remiseGlobale) / 100,
                    tauxTva: rawData.tva,
                    livre: null,
                    dispon: rawData.dispon,
                    design: rawData.design,
                    cartech: rawData.agenda,
                    rang: this.rang,
                    coutVenteMinim: rawData.min,
                  };
                  let exist;
                  await this.ddevisService
                    .getDdevisByNumDevAndCode(this.V2, rawData.code)
                    .toPromise()
                    .then((data) => {
                      if (
                        data['_embedded'].ddevis &&
                        data['_embedded'].ddevis[0] &&
                        data['_embedded'].ddevis[0].id
                      ) {
                        exist = true;
                        ddevis.id = data['_embedded'].ddevis[0].id;
                        ddevis.rang = rawData.rang;
                      } else {
                        exist = false;
                      }
                    });
                  if (exist) {
                    await this.ddevisService
                      .updateDdevis(ddevis)
                      .subscribe((data) => {});
                  } else {
                    await this.ddevisService
                      .createDdevis(ddevis)
                      .subscribe((data) => {});
                    this.rang = this.rang + 5;
                  }
                },
                reject: () => {
                  // this.annulerCMD(e);
                },
              });
            } else {
              rawData.agenda = this.currentAgenda;
              const prix_saisie = Number(prix);
              const qte = Number(rawData.qte);
              rawData = this.calculTotalPrix(prix_saisie, qte, rawData);
              // rawData.prixInit = prix_saisie;
              this.disable = false;
              this.currentAgenda = '';
              this.currentCode = '';
              this.table.cancelRowEdit(rawData);
              this.affichValider = false;
              if (rawData.id === '#') {
                const id = (Math.random() * 10000).toFixed(0);
                rawData.id = '#' + id;
              }

              const ddevis = {
                id: undefined,
                combine: this.V2,
                code: rawData.code,
                quantite: rawData.qte,
                tRemise: rawData.marge,
                prix: rawData.prix,
                // prix: rawData.prix - (rawData.prix * this.remiseGlobale) / 100,
                tauxTva: rawData.tva,
                livre: null,
                dispon: rawData.dispon,
                design: rawData.design,
                cartech: rawData.agenda,
                rang:
                  rawData.rang && Number(rawData) > 0
                    ? rawData.rang
                    : this.rang,
                coutVenteMinim: rawData.min,
              };
              let exist;
              await this.ddevisService
                .getDdevisByNumDevAndCode(this.V2, rawData.code)
                .toPromise()
                .then((data) => {
                  if (
                    data['_embedded'].ddevis &&
                    data['_embedded'].ddevis[0] &&
                    data['_embedded'].ddevis[0].id
                  ) {
                    exist = true;
                    ddevis.id = data['_embedded'].ddevis[0].id;
                    ddevis.rang = rawData.rang;
                  } else {
                    exist = false;
                  }
                });
              if (exist) {
                await this.ddevisService
                  .updateDdevis(ddevis)
                  .subscribe((data) => {});
              } else {
                await this.ddevisService
                  .createDdevis(ddevis)
                  .subscribe((data) => {});
                this.rang = this.rang + 5;
              }
              // if (this.rang === 5) { await this.devisService.update(this.V2).toPromise().then(); }
              // if (rawData.rang && rawData > 0) {
              // this.rang = this.rang + 5;
              // }
            }
          } else {
            this.affichValider = true;
            this.ajout = true;
            this.msg = 'veuillez donner le prix de cet article';
            document.getElementById(`row_${rawData.id}`).scrollIntoView({
              inline: 'start',
              block: 'start',
            });
            rawData.prixtot = null;
            this.op.show(e, document.getElementById(`row_${id}_prix`));
            this.ajout = false;
          }
        }
      }
    }
  }

  async verifPrix(prix, rawData, e, id) {
    this.op.hide();
    this.wasInside = true;

    if (prix !== null && prix !== undefined && Number(prix) > 0) {
      if (
        rawData.coefMarge &&
        rawData.min > 0 &&
        rawData.prix - (rawData.prix * rawData.marge) / 100 < rawData.min
      ) {
        this.confirmationService.confirm({
          message:
            'Attention la marge est inférieure à ' +
            Number((rawData.coefMarge - 1) * 100).toFixed(2) +
            '%, Prix minimal est ' +
            rawData.min,
          header: 'Avertissement',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          rejectLabel: 'Annuler',
          accept: async () => {
            this.mouveToNext(`agenda`);
          },
          reject: () => {
            // this.annulerCMD(e);
          },
        });
      } else {
        this.mouveToNext(`agenda`);
      }
      rawData.prixInit = (
        (100 * Number(rawData.prix)) /
        (100 - this.remiseGlobale)
      ).toFixed(3);
    } else {
      this.affichValider = true;
      this.ajout = true;
      this.msg = 'veuillez donner le prix de cet article';
      document.getElementById(`row_${rawData.id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      rawData.prixtot = null;
      this.op.show(e, document.getElementById(`row_${id}_prix`));
      this.ajout = false;
    }
  }

  calculTotalPrix(prix, qte, art): any {
    if (
      prix === null ||
      prix === undefined ||
      qte === null ||
      qte === undefined
    ) {
      art.prixtot = null;
      // this.calculTotPrix = true;
    } else {
      this.prixTot = Number(prix) * Number(qte);

      const prixx = 0;

      art.prixtot = Number(this.prixTot).toFixed(3);
      this.calculTotPrix = true;
    }

    return art;
  }

  async doubleclickStock(e) {
    this.onRowUnselect();
    this.qteEncours = null;
    this.datePr = null;
    this.qteClient = null;
    this.qteComm = false;
    this.s_Total1CH = null;
    this.totalise = false;
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

    this.affichValider = true;
    this.wasInside = true;

    this.op.hide();
    this.selectedArticle = this.gridstock.getRowInfo(e.target).rowData;
    const art = {
      id: this.selectedArticle.id,
      prix: (
        (10 * Number(this.selectedArticle.prix) * (100 - this.remiseGlobale)) /
        1000
      ).toFixed(3),
      code: this.selectedArticle.code,
      design: this.selectedArticle.design,
      quantite: this.selectedArticle.quantite,
      qte: null,
      marge: Number(this.selectedClient.marque).toFixed(2),
      tva: Number(this.selectedArticle.tva).toFixed(2),
      prixtot: null,
      numdev: null,
      agenda: this.selectedArticle.agenda,
      prixInit: this.selectedArticle.prix,
      achat: this.selectedArticle.achat ? this.selectedArticle.achat : 0,
      coefMarge:
        this.selectedArticle.operateur === '4011052' ||
        this.selectedArticle.operateur === '4011574'
          ? 1.2
          : 1.25,
      min: '0',
      dispon: null,
      rang: (this.listeStockCMD.length + 1) * 5,
    };
    art.min = (Number(this.selectedArticle.achat) * art.coefMarge).toFixed(3);
    this.currentCode = this.selectedArticle.code;
    this.currentAgenda = this.selectedArticle.agenda;
    // art.min = (art.achat * art.coefMarge).toFixed(3);
    this.caracters = this.selectedArticle.agenda;
    if (this.flag_exonor) {
      art.tva = '0.00';
    } else {
      art.tva = Number(this.selectedArticle.tva).toFixed(2);
    }

    if (this.selectedStock.length === 0) {
      await this.selectedStock.push(art);
      this.disable = true;
      this.listeStockCMD = this.selectedStock;
      await this.table.initRowEdit(art);
      this.refArticle = this.selectedArticle.code;
      this.gridstock.selectRows([e.rowIndex]);
    } else {
      if (this.listeStockCMD[this.listeStockCMD.length - 1].prixtot !== null) {
        this.table.cancelRowEdit(
          this.listeStockCMD[this.listeStockCMD.length - 1]
        );
      }

      let j;
      let index = -1;
      for (j = 0; j <= this.selectedStock.length - 1; j++) {
        if (this.selectedStock[j].code === art.code) {
          this.calculTotPrix = true;
          if (art.prixtot === undefined || art.prixtot === null) {
            this.table.initRowEdit(art);
          } else {
            this.calculTotPrix = false;
            this.table.cancelRowEdit(art);
          }
          this.msg = 'Cet article est déjà dans la liste !!';
          this.op.show(e);
          index = j;

          break;
        } else {
          index = -1;
        }
      }
      if (index === -1) {
        if (
          this.selectedStock[this.selectedStock.length - 1].qte === null ||
          this.selectedStock[this.selectedStock.length - 1].qte === undefined
        ) {
          this.ajout = true;
          // this.calculTotPrix = false;
          this.table.initRowEdit(art);
          this.msg = 'veuillez donner la quantité ';
          document
            .getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}`
            )
            .scrollIntoView({
              inline: 'start',
              block: 'start',
            });
          this.op.show(
            e,
            document.getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}_qte`
            )
          );
          this.ajout = false;
          this.table.initRowEdit(art);
        } else {
          this.ajout = true;
          this.refArticle = this.selectedArticle.code;
          this.gridstock.selectRows([e.rowIndex]);
          let i = 0;
          let cmd = this.selectedStock[i];
          while (
            i <= this.listeStockCMD.length - 1 &&
            cmd.prixtot !== null &&
            cmd.prixtot !== undefined
          ) {
            i++;
            cmd = this.selectedStock[i];
          }

          if (i > this.listeStockCMD.length - 1) {
            await this.selectedStock.push(art);
            this.disable = true;
            this.listeStockCMD = this.selectedStock;
            this.table.initRowEdit(art);

            this.wasInside = true;

            this.refArticle = this.selectedArticle.code;
            this.gridstock.selectRows([e.rowIndex]);
          } else {
            // this.calculTotPrix = true;
            this.table.initRowEdit(cmd);
            this.msg =
              'Veuillez verifier cette ligne !! , cliquer sur Entrée pour continuer !!';
            this.table.initRowEdit(cmd);
            this.op.show(e, document.getElementById(`row_${cmd.id}`));
          }
        }
        setTimeout(() => {
          this.mouveToNext(`row_${art.id}_inputQte`);
        }, 10);
      }
    }

    this.calculTotPrix = false;

    this.ajout = false;
  }

  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    this.refArticleRech = mot;
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        this.listeStocks = data['_embedded'].stocks;
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
      console.log(obj);
      this.s_Total1 = this.s_Total1 + Number(obj.prixtot);
      this.s_remise =
        this.s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;
      /*this.s_remise =
        this.s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;*/
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
    this.tva =
      this.s_base10 * 0.13 + this.s_base18 * 0.19 + this.s_base29 * 0.07;
    this.s_net =
      this.s_base0 +
      this.s_base10 * 1.13 +
      this.s_base18 * 1.19 +
      this.s_base29 * 1.07;
    this.s_ht = this.s_base0 + this.s_base10 + this.s_base18 + this.s_base29;
    // this.s_remise = this.s_Total1 - this.s_ht;
    this.s_Total1CH = Number(this.s_Total1).toFixed(3);
    this.s_remisech = Number(this.s_remise).toFixed(3);

    this.tva13 = this.s_base10 * 0.13;
    this.tva13ch = Number(this.tva13).toFixed(3);
    this.tva19 = this.s_base18 * 0.19;
    this.tva19ch = Number(this.tva19).toFixed(3);
    this.tva7 = this.s_base29 * 0.07;
    this.tva7ch = Number(this.tva7).toFixed(3);
    this.tvach = Number(this.tva).toFixed(3);
    /*if (this.flag_timbre) {
      this.s_net = this.s_net + 0.6;
    }*/
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
    this.rechArticle('');
  }

  chargerPrixtot(rowdata) {
    rowdata.prixtot = null;
    return rowdata;
  }

  async offrsClient(e) {
    const selected: any = this.gridstock.getSelectedRecords()[0];
    this.wasInside = true;
    this.op.hide();
    this.listeOffres = new Array();
    // await this.edevisService
    //   .listeOffreClient(this.codeClient)
    //   .toPromise()
    //   .then((data) => {
    //     this.listeOffres = data['_embedded'].edevis;
    //   });
    await this.ddevisService
      .getDdevisByClientCodeArticle(this.codeClient, selected.code)
      .toPromise()
      .then((data) => {
        this.listeOffres = data['_embedded'].ddevis;
      });
    if (this.listeOffres.length === 0) {
      this.msg = 'aucun offre trouvé !! ';
      this.op.show(e, document.getElementById('affdetails'));
      this.displayDevClt = false;
    } else {
      for (const el of this.listeOffres) {
        el.quantite = Number(el.quantite);
        el.prix = Number(el.prix);
        el.tRemise = Number(el.tRemise);
        el.qtSatisf ? (el.qtSatisf = Number(el.qtSatisf)) : (el.qtSatisf = 0);
      }
      this.displayDevClt = true;
    }
  }

  async changeSelectedItem() {
    this.ville = this.selectedClient.ville;
    this.codeTva = this.selectedClient.codeTva;
    this.selectedClient.tel
      ? (this.tel = this.selectedClient.tel)
      : (this.tel = '         ');
    this.selectedClient.fax
      ? (this.fax = this.selectedClient.fax)
      : (this.fax = '');
    this.mail = this.selectedClient.eMail;
    this.m = this.selectedClient.deno;
    this.adresse = this.selectedClient.adresse;
    this.selectedClient.respon
      ? (this.responsable = 'Mr. ' + this.selectedClient.respon)
      : (this.responsable = 'Mr.');
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

  async addLigne(e) {
    this.onRowUnselect();
    this.qteEncours = null;
    this.datePr = null;
    this.qteClient = null;
    this.qteComm = false;
    this.s_Total1CH = null;
    this.totalise = false;
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
    this.s_base0 = 0;
    this.s_net = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_net = 0;
    this.s_base0 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;

    this.affichValider = true;
    this.wasInside = true;

    this.op.hide();
    const art = {
      id: '#',
      prix: null,
      code: null,
      design: null,
      quantite: null,
      qte: null,
      marge: Number(this.selectedClient.marque).toFixed(2),
      tva: '19.00',
      prixtot: null,
      numdev: null,
      achat: 0,
      coefMarge: null,
      min: 0,
      dispon: null,
      rang: (this.listeStockCMD.length + 1) * 5,
    };

    if (this.flag_exonor) {
      art.tva = '0.00';
    }

    if (this.selectedStock.length === 0) {
      await this.selectedStock.push(art);
      this.disable = true;
      this.listeStockCMD = this.selectedStock;
      await this.table.initRowEdit(art);
      this.refArticle = null;
    } else {
      if (this.listeStockCMD[this.listeStockCMD.length - 1].prixtot !== null) {
        this.table.cancelRowEdit(
          this.listeStockCMD[this.listeStockCMD.length - 1]
        );
      }

      let j;
      let index = -1;
      for (j = 0; j <= this.selectedStock.length - 1; j++) {
        if (this.selectedStock[j].code === art.code) {
          this.calculTotPrix = true;
          if (art.prixtot === undefined || art.prixtot === null) {
            this.table.initRowEdit(art);
          } else {
            this.calculTotPrix = false;
            this.table.cancelRowEdit(art);
          }
          this.msg = 'Cet article est déjà dans la liste !!';
          this.op.show(e);
          index = j;

          break;
        } else {
          index = -1;
        }
      }
      if (index === -1) {
        if (
          this.selectedStock[this.selectedStock.length - 1].qte === null ||
          this.selectedStock[this.selectedStock.length - 1].qte === undefined
        ) {
          this.ajout = true;
          // this.calculTotPrix = false;
          this.table.initRowEdit(art);
          this.msg = 'veuillez donner la quantité ';
          document
            .getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}`
            )
            .scrollIntoView({
              inline: 'start',
              block: 'start',
            });
          this.op.show(
            e,
            document.getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}_qte`
            )
          );
          this.ajout = false;
          this.table.initRowEdit(art);
        } else {
          this.ajout = true;
          this.refArticle = null;
          let i = 0;
          let cmd = this.selectedStock[i];
          while (
            i <= this.listeStockCMD.length - 1 &&
            cmd.prixtot !== null &&
            cmd.prixtot !== undefined
          ) {
            i++;
            cmd = this.selectedStock[i];
          }

          if (i > this.listeStockCMD.length - 1) {
            await this.selectedStock.push(art);
            this.disable = true;
            this.listeStockCMD = this.selectedStock;
            this.table.initRowEdit(art);

            this.wasInside = true;

            this.refArticle = null;
          } else {
            // this.calculTotPrix = true;
            this.table.initRowEdit(cmd);
            this.msg =
              'Veuillez verifier cette ligne !! , cliquer sur Entrée pour continuer !!';
            this.table.initRowEdit(cmd);
            this.op.show(e, document.getElementById(`row_${cmd.id}`));
            if (
              document.getElementById(`row_${cmd.id}_inputQte`) !== null &&
              document.getElementById(`row_${cmd.id}_inputQte`) !== undefined
            ) {
              document.getElementById(`row_${cmd.id}_inputQte`).focus();
            }
          }
        }
      }
    }

    this.calculTotPrix = false;
    setTimeout(() => {
      this.mouveToNext(`row_${art.id}_code`);
    }, 10);

    this.ajout = false;
  }

  async appliquerRemise() {
    let remise_aut = false;
    this.totalise = false;
    for (const ob of this.listeStockCMD) {
      if (
        ob.coefMarge &&
        ob.min > 0 &&
        ob.prix - (ob.prix * ob.marge) / 100 < ob.min
      ) {
        this.confirmationService.confirm({
          message:
            'Attention la marge est inférieure à ' +
            Number((ob.coefMarge - 1) * 100).toFixed(2) +
            '%, Prix minimal est ' +
            ob.min,
          header: 'Avertissement',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          rejectLabel: 'Annuler',
          accept: async () => {
            remise_aut = true;
          },
          reject: () => {
            // this.annulerCMD(e);
          },
        });
        break;
      }
    }

    for await (const el of this.listeStockCMD) {
      // el.prix = el.prixInit - (el.prixInit * this.remiseGlobale) / 100;
      el.prix = (
        (10 * Number(el.prixInit) * (100 - this.remiseGlobale)) /
        1000
      ).toFixed(3);
      el.prixtot = el.prix * el.qte;
      // el.prix = el.prix.toFixed(3);
      el.prixtot = el.prixtot.toFixed(3);
      const ddevis = {
        id: null,
        combine: this.V2,
        code: el.code,
        quantite: el.qte,
        tRemise: el.marge,
        // prix: (el.prix - (el.prix * this.remiseGlobale) / 100).toFixed(3),
        prix: el.prix,
        tauxTva: el.tva,
        livre: null,
        dispon: null,
        design: el.design,
        cartech: el.agenda,
        rang: el.rang,
        coutVenteMinim: el.min,
      };
      await this.ddevisService
        .getDdevisByNumDevAndCode(this.V2, el.code)
        .toPromise()
        .then((data) => {
          ddevis.id = data['_embedded'].ddevis[0].id;
        });
      // if (ddevis.id) {
      await this.ddevisService
        .updateDdevis(ddevis)
        .toPromise()
        .then((data) => {});
      // }
    }
  }

  AjouterCaract(rowData) {
    this.mouveToNext(`row_${rowData.id}_inputQte`);
  }

  async onRadioChange(event) {
    if (this.sortOptions === 'date') {
      const code = this.selectedArticle.code;
      if (this.mouve === 'mouve') {
        await this.mouveService
          .getMouveByCodeForConsultationRef(code)
          .toPromise()
          .then((data) => {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
          });
      }
      if (this.mouve === 'mouve1') {
        await this.mouve1Service
          .getMouve1ByCodeForConsultationRef(code)
          .toPromise()
          .then((data) => {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
          });
      }
      if (this.mouve === 'mouve2') {
        await this.mouve2Service
          .getMouve2ByCodeForConsultationRef(code)
          .toPromise()
          .then((data) => {
            this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
          });
      }
    }
    if (this.sortOptions === 'client') {
      const mvmtsTemp = this.mvtAnnCournte;
      this.mvtAnnCournte = mvmtsTemp.sort((a, b) => (a.deno > b.deno ? 1 : -1));
    }
    this.gridMouves.refresh();
    this.gridMouves1.refresh();
    this.gridMouves2.refresh();
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
    let represantant = '';
    console.log(this.selectedClient);
    await this.represanService
      .findByCode(this.selectedClient.represant)
      .toPromise()
      .then((data) => {
        console.log(data);
        represantant = data['_embedded'].represans[0].deno;
      });
    const entete = this.entete;
    let societe = this.societe;
    const doc1 = new jspdf();
    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');
    const signImg = new Image();
    societe = await globals.societe;
    if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
      signImg.src =
        'assets/images/offres/signatures/' + this.codeVendeur + '.jpg';
    }
    if (entete) {
      if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
        const img = new Image();
        img.src = 'assets/images/offres/entete.jpg';
        doc1.addImage(img, 'JPEG', 10, 10, 190, 30);
      } else {
        await this.steService
          .getSte()
          .toPromise()
          .then((data) => {
            societe = data['_embedded'].ste[0];
          });
        doc1.text('SOCIETE..:  ' + societe.societe, 9, 15);
        doc1.text('ADRESSE..:  ' + societe.adresse, 9, 20);
        doc1.text('VILLE....:  ' + societe.ville, 9, 25);
        doc1.text('TEL......:  ' + societe.tel, 9, 30);
        doc1.text('FAX......:  ' + societe.fax, 9, 35);
        doc1.text('E-MAIL...:  ' + societe.email, 9, 40);
      }
    }
    doc1.text(
      'Tunis, le : ' + this.datepipe.transform(this.dateOffre, 'dd/MM/yyyy'),
      165,
      50
    );
    doc1.setFontSize(24);
    doc1.setFontStyle('bold');
    doc1.text('Offre de Prix N°:' + this.V1, 63, 50);
    doc1.setFontSize(12);
    doc1.text(
      '(Merci de rappeler ce numero d\'offre en cas de commande)',
      50,
      57
    );

    doc1.setFontStyle('Arial');
    doc1.text('A l\'attention de: ' + this.responsable, 9, 77);
    doc1.text('Votre Ref N°: ', 9, 91);
    if (this.refCmd) {
      doc1.text(this.refCmd, 35, 91);
    }
    this.notreRef =
      this.selectedVendeur.deno.trim().charAt(0) +
      this.V1 +
      '/' +
      this.datepipe.transform(this.dateOffre, 'yy');
    doc1.text('Notre Ref N°: ' + this.notreRef, 9, 98);
    doc1.text(this.m.trim(), 135, 77);
    if (this.adresse) {
      doc1.text(this.adresse, 135, 84);
    }
    if (this.ville) {
      doc1.text(this.ville, 135, 91);
    }
    doc1.text('TEL: ' + this.tel + ' FAX: ' + this.fax, 135, 98);
    doc1.text('Messieurs', 20, 114);
    doc1.text(
      'Nous vous remettons, notre meilleure offre de prix et délai, pour le materiel dénommé ci-dessous:',
      9,
      121
    );
    // entete du  tableau
    doc1.line(9, 130, 205, 130);
    // doc1.line(9, 130, 9, 280);
    // doc1.line(205, 130, 205, 280);
    doc1.setFontSize(10);
    doc1.setFontStyle('bold');
    doc1.text('N°', 10, 133);
    doc1.text('Réf.Article', 15, 133);
    doc1.text('Désignation', 60, 133);
    doc1.text('Qte', 130, 133);
    doc1.text('TVA', 140, 133);
    doc1.text('Pu HT', 150, 133);
    doc1.text('Rem', 162, 133);
    doc1.text('Pu Net HT', 171, 133);
    doc1.text('T.Net HT', 190, 133);

    // creer la ligne
    doc1.line(9, 135, 205, 135);
    let y = 138;
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('Arial');
    // créer la ligne vertical
    doc1.setFontStyle('bold');
    let r = 1;
    let PUHT = 0;
    let TotHt = 0;
    let totalremise = 0;
    let tot;
    this.listeStockCMD.forEach(function (value) {
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
      doc1.text(Number(r).toFixed(0), 10, y);
      doc1.text(value.code, 15, y);
      doc1.text(value.design, 60, y);
      doc1.text(value.qte, 135, y, 'right');
      doc1.text(value.prix, 160, y, 'right');
      doc1.text(value.tva, 147, y, 'right');
      doc1.text(value.marge, 169, y, 'right');
      PUHT = value.prix - (value.prix * value.marge) / 100;
      doc1.text(Number(PUHT).toFixed(3), 185, y, 'right');
      TotHt = PUHT * value.qte;
      doc1.text(Number(TotHt).toFixed(3), 204, y, 'right');
      totalremise = totalremise + TotHt;
      if (value.agenda && value.agenda !== '') {
        // y = y + 5;
        const splitAgenda = doc1.splitTextToSize(value.agenda, 60);
        for (let i = 0; i < splitAgenda.length; i++) {
          y = y + 5;
          // if (y > 280) {
          //   doc1.addPage();
          //   y = 20;
          // }
          doc1.text(60, y, splitAgenda[i]);
          // y = y + 5;
        }
      }
      y = y + 7;
      r = r + 1;
      // passer a une nouvelle page

      if (y > 277) {
        doc1.line(9, y - 3, 205, y - 3, 'FD');
        if (entete) {
          if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
            const img = new Image();
            img.src = 'assets/images/offres/bp.jpg';
            doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
          }
        }
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        // entete tableau
        doc1.line(9, 12, 205, 12);

        doc1.setFontSize(12);
        doc1.text('N°', 10, 17);
        doc1.text('Réf.Article', 15, 17);
        doc1.text('Désignation', 60, 17);
        doc1.text('Qte', 130, 17);
        doc1.text('TVA', 140, 17);
        doc1.text('Pu HT', 150, 17);
        doc1.text('Rem', 162, 17);
        doc1.text('Pu Net HT', 171, 17);
        doc1.text('T.Net HT', 190, 17);

        // creer la ligne
        doc1.setFontStyle('bold');
        doc1.line(9, 20, 205, 20);
        y = 26;
        // if (numPage > 1) {
        // doc1.line(9, y - 14, 9, y + 254, 'FD');
        // doc1.line(205, y - 14, 205, y + 254, 'FD');
        // }
      }
      doc1.line(9, y - 6, 205, y - 6, 'FD');
    });

    //  doc1.line(9, y - 6, 205, y - 6, 'FD');

    //  doc1.line(9, 130, 9, y - 6);
    //  doc1.line(205, 130, 205, y - 6);

    doc1.setFontSize(12);
    let y1 = y;
    if (y1 + 25 > 277) {
      if (this.entete) {
        if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
          const img = new Image();
          img.src = 'assets/images/offres/bp.jpg';
          doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
        }
      }
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      numPage++;
      doc1.addPage();
      y1 = 17;
    }
    if (this.basDePage !== '') {
      // y = y + 5;
      const splitBasDePage = doc1.splitTextToSize(this.basDePage, 140);
      for (let i = 0; i < splitBasDePage.length; i++) {
        y1 = y1 + 5;
        // if (y > 280) {
        //   doc1.addPage();
        //   y = 20;
        // }
        doc1.text(9, y1, splitBasDePage[i]);
        // y = y + 5;
      }
      y1 = y1 - 5 * (splitBasDePage.length - 1);
    }
    // doc1.text(this.basDePage, 9, y1);
    if (this.totaux) {
      tot = totalremise.toFixed(3);
      doc1.text('Total Net HT: ', 150, y1);
      doc1.text(tot, 195, y1, 'right');
      doc1.text('Total TVA:', 150, y1 + 7);
      doc1.text(this.tvach, 195, y1 + 7, 'right');
      if (this.flag_timbre) {
        doc1.text('Timbre:', 150, y1 + 14);
        doc1.text('0.600', 195, y1 + 14, 'right');
      }
      doc1.text('Total TTC', 150, y1 + 21);
      doc1.text((Number(this.s_netch) + 0.6).toFixed(3), 195, y1 + 21, 'right');
    }
    y1 = y1 + 30;
    if (y1 + 80 > 277) {
      if (this.entete) {
        if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
          const img = new Image();
          img.src = 'assets/images/offres/bp.jpg';
          doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
        }
      }
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      numPage++;
      doc1.addPage();
      y1 = 17;
    }

    doc1.text(
      'Ces prix pourront être révisés et dépendront nottamment de la parité Devise/Dinar et de taux des droits' +
        '\net taxes en vigueur le jour de dédouanement\n' +
        '\n\tTout en espérant que notre offre retiendrait favorablement votre attention,\n' +
        '\nOffre établit par Mr: ' +
        this.selectedVendeur.deno +
        '\nOffre suivi par Mr: ' +
        represantant,
      9,
      y1
    );

    if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
      const tabSignV = [
        '02',
        '03',
        '04',
        '05',
        '09',
        '14',
        '28',
        '29',
        '30',
        '36',
        '39',
        '40',
        '46',
      ];

      if (tabSignV.includes(this.codeVendeur)) {
        doc1.addImage(signImg, 'JPEG', 125, y1 + 15);
      }
    }
    if (this.entete) {
      if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
        const img = new Image();
        img.src = 'assets/images/offres/bp.jpg';
        doc1.addImage(img, 'JPEG', 10, 282, 190, 15);
      }
    }
    doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
    window.open(doc1.output('bloburl'), '_blank');
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
        if (data['_embedded'].edevis[0]) {
          this.offreId = data['_embedded'].edevis[0].id;
          this.dateOffre = new Date(data['_embedded'].edevis[0].dateEnvoi);
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
      let details = [];
      await this.ddevisService
        .findByCombineOrderByRang(this.V2)
        .toPromise()
        .then((data) => {
          details = data['_embedded'].ddevis;
        });
      let ddev = [];
      for await (const el of details) {
        console.log(el);
        await this.stockService
          .getStock(el.code)
          .toPromise()
          .then((data) => {
            if (data['_embedded'].stocks[0]) {
              (el.achat = data['_embedded'].stocks[0].achat),
                (el.operateur = data['_embedded'].stocks[0].operateur);
            }
          });
        const ddevis = {
          id: el.id,
          code: el.code,
          qte: el.quantite,
          marge: el.tRemise,
          prix: el.prix,
          prixInit: el.prix / (1 - this.remiseGlobale / 100),
          tva: el.tauxTva,
          design: el.design,
          agenda: el.cartech,
          rang: el.rang,
          min: el.coutVenteMinim,
          prixtot: Number(el.prix * el.quantite).toFixed(3),
          achat: el.achat ? el.achat : 0,
          coefMarge:
            el.operateur === '4011052' || el.operateur === '4011574'
              ? 1.2
              : 1.25,
          dispon: el.dispon,
        };
        ddev.push(ddevis);
        ddev = ddev.sort((a, b) => (Number(a.rang) > Number(b.rang) ? 1 : -1));
      }
      this.selectedStock = ddev.sort((a, b) =>
        Number(a.rang) > Number(b.rang) ? 1 : -1
      );
      this.listeStockCMD = this.selectedStock;
      await this.vendeur1Service
        .getVendeur1ByDeno()
        .toPromise()
        .then((data) => {
          this.vendeurs = data['_embedded'].vendeur1;
        });
      await this.vendeur1Service
        .getVendeur1ByCode(this.codeVendeur)
        .toPromise()
        .then((data) => {
          this.selectedVendeur = data['_embedded'].vendeur1[0];
        });
      this.totaliser(e, this.listeStockCMD);
        let represan = '';
      await this.clientService
        .getClientByCode(this.codeClient)
        .toPromise()
        .then((data) => {
          this.selectedClient = data['_embedded'].clients[0];
          represan = this.selectedClient.represant;
        });
      await this.changeSelectedItem();
      if (
        this.codeClient === '7200' ||
        this.codeClient === '7300' ||
        this.codeClient === '7500'
      ) {
        await this.nomClientOffreService
          .getNomClientOffreByNumDev(this.V2)
          .toPromise()
          .then((data) => {
            this.selectedClient = data['_embedded'].NomClientOffre[0];

            this.selectedClient.represant = represan;
            this.ville = this.selectedClient.ville;
            this.codeTva = this.selectedClient.codeTva;
            this.selectedClient.tel
              ? (this.tel = this.selectedClient.tel)
              : (this.tel = '         ');
            this.selectedClient.fax
              ? (this.fax = this.selectedClient.fax)
              : (this.fax = '');
            this.m = this.selectedClient.deno;
            this.adresse = this.selectedClient.adresse;
          });
      }
      this.codedeno = this.codeClient + ' ' + this.m;
      await this.edevisService
        .evaluationClient(this.selectedClient.code)
        .toPromise()
        .then((data) => {
          this.nbrDesOffresTotals = Number(
            data['_embedded'].evalClients[0].nbrDesOffresTotals
          );
          this.mtTotalDesOffres = Number(
            data['_embedded'].evalClients[0].mtTotalDesOffres
          ).toFixed(3);
          this.mtSatisfTotal = Number(
            data['_embedded'].evalClients[0].mtSatisfTotal
          ).toFixed(3);
          Number(this.mtTotalDesOffres) === 0
            ? (this.pourcSatisfTotal = 0)
            : (this.pourcSatisfTotal = (
                (Number(this.mtSatisfTotal) / Number(this.mtTotalDesOffres)) *
                100
              ).toFixed(2));
          this.evalClient = true;
        });
      this.selectedClient.marque =
        this.selectedStock[this.selectedStock.length - 1].marge;
      if (this.nbrDesOffresTotals <= 3) {
        this.evaluation = 'on ne peut pas juger';
      } else {
        if (this.pourcSatisfTotal < 5) {
          this.evaluation = 'tres mauvais';
        } else {
          if (this.pourcSatisfTotal >= 5 && this.pourcSatisfTotal < 12) {
            this.evaluation = 'mauvais';
          } else if (
            this.pourcSatisfTotal >= 12 &&
            this.pourcSatisfTotal < 21
          ) {
            this.evaluation = 'moyen';
          } else if (
            this.pourcSatisfTotal >= 21 &&
            this.pourcSatisfTotal < 30
          ) {
            this.evaluation = 'bon';
          } else if (
            this.pourcSatisfTotal >= 30 &&
            this.pourcSatisfTotal < 40
          ) {
            this.evaluation = 'tres bon';
          } else if (this.pourcSatisfTotal >= 40) {
            this.evaluation = 'excellent';
          }
        }
      }
      this.rechArticle('');
      this.rang =
        Number(this.selectedStock[this.selectedStock.length - 1].rang) + 5;
    }
    this.blockDocument = false;
  }

  changeSelection(e) {
    this.totalEntreesMvts = '';
    this.totalSortiesMvts = '';
    if (e.index === 0) {
      // this.rechArticle('');
    } else if (e.index === 1) {
      this.afficherMvtAnnCourante(e);
    } else if (e.index === 2) {
      this.afficherMvtAnnCourante_1(e);
    } else if (e.index === 3) {
      this.afficherMvtAnnCourante_2(e);
    } else if (e.index === 4) {
      this.equivArticle(e);
    }
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

  async releve() {
    this.Releve.selectedClient = this.selectedClient;
    this.Releve.codeClient = this.selectedClient.code;
    this.Releve.afficherClicked = true;
    this.Releve.afficherDisable = true;
    await this.Releve.afficher();
    this.visible = true;
    this.Releve.releveClicked = true;
    this.Releve.apercueDisable = false;
  }

  showDialogMaximized(dialog: Dialog) {
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }

  async cmdFrs() {
    const selected: any = this.gridstock.getSelectedRecords()[0];
    const datedeb = new Date();
    const date = new Date(
      datedeb.getFullYear() - 1,
      datedeb.getMonth(),
      datedeb.getDay()
    );
    this.cmdfrs.SelectedArticles = selected.code;
    this.cmdfrs.codearticle = selected.code;
    this.cmdfrs.typef = '';
    this.cmdfrs.datedebut = date;
    this.cmdfrs.SelectedArticles = selected;
    await this.cmdfrs.Afficher();
    this.visible2 = true;
  }
  mvtsClient(index) {
    const isSelectedClient = (element) =>
      element.deno === this.selectedClient.deno;
    const ligne = this.mvtAnnCournte.findIndex(isSelectedClient);
    if (ligne >= 0) {
      if (index === 0) {
        setTimeout(() => this.gridMouves.selectRows([ligne]), 10);
      }
      if (index === 1) {
        setTimeout(() => this.gridMouves1.selectRows([ligne]), 10);
      }
      if (index === 2) {
        setTimeout(() => this.gridMouves2.selectRows([ligne]), 10);
      }
    }
  }
  totalMvts() {
    let sumEntree = 0,
      sumSortie = 0;
    for (const mvmt of this.mvtAnnCournte) {
      sumEntree = sumEntree + Number(mvmt.entree);
      sumSortie = sumSortie + Number(mvmt.sortie);
    }
    this.totalEntreesMvts = sumEntree.toFixed(0);
    this.totalSortiesMvts = sumSortie.toFixed(0);
  }
  public dataBound(args): void {
    if (this.listeStocks.length > 0) {
      this.gridstock.selectRows([0]);
    }
  }
}
