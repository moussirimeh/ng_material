import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewChecked,
} from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { ModePService } from '../services/modeP.service';
import { TranspService } from '../services/transp.service';
import { ComService } from '../services/com.service';
import { ComLService } from '../services/comL.service';
import { CommandService } from '../services/command.service';
import { CommandeService } from '../services/commande.service';
import { ModeLService } from '../services/modeL.service';
import { Com } from '../services/com';
import { ComL } from '../services/comL';
import { Fournisseur } from '../services/fournisseur';
import { Transp } from '../services/transp';
import { ModeL } from '../services/modeL';
import { ModeP } from '../services/modeP';
import { BanqueService } from '../services/banque.service';
import { Banque } from '../services/banque';
import { StockService } from '../services/stock.service';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Command } from '../services/command';
import { Commande } from '../services/commande';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { LoginService } from 'src/app/login/login.service';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { DatePipe } from '@angular/common';
import { SmsService } from '../services/sms.service';
import { globals } from 'src/environments/environment';
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
setCulture('de-DE');
L10n.load({
  'de-DE': {
    grid: {
      EmptyRecord: [],
    },
  },
});

@Component({
  selector: 'app-nouvelle-commande',
  templateUrl: './nouvelle-commande.component.html',
  styleUrls: ['./nouvelle-commande.component.scss'],
  providers: [DatePipe],
})
export class NouvelleCommandeComponent implements OnInit, AfterViewChecked {
  constructor(
    private stockService: StockService,
    private steService: SteService,
    private fourService: FournisseurService,
    private commandService: CommandService,
    private commandeService: CommandeService,
    private modePService: ModePService,
    private modeLService: ModeLService,
    private transpService: TranspService,
    private comService: ComService,
    private comLService: ComLService,
    private banqueService: BanqueService,
    private loginService: LoginService,
    private smsService: SmsService,
    private config: NgSelectConfig,
    private datePipe: DatePipe
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  blockDocument = false;
  rechIndic = 0;
  ajout = false;
  commandeLength = 0;
  tn;
  floatNumber: RegExp = /^\d+(\.\d+)*$/;
  four: any;
  transp: Transp = null;
  modeP: ModeP = null;
  modeL: ModeL = null;
  banque: Banque = null;
  articles = [];
  public demandeCommande = [];
  ste: Ste;
  deno = '';
  adresse = '';
  ville = '';
  date;
  dateEcheance;
  code = '';
  rang = 0;
  V1: any;
  V2: string;
  com: Com;
  comL: ComL;
  flg_etranger: boolean;
  selectedFour: Fournisseur = null;
  selectedModel: ModeL;
  selectedModeP: ModeP;
  selectedTransp: Transp;
  selectedBanque: Banque;
  ref_Prof = '';
  devise = null;
  typeF: string;
  numero = null;
  champDisabled: boolean;
  cardShow: boolean;
  allowSelection: boolean;
  rechercheDisable: boolean;
  annulerShow: boolean;
  existe: boolean;
  supprimerShow: boolean;
  selectedrecords: any;
  codeCommande: string;
  designCommande: any;
  valide: boolean;
  validerShow = false;
  excelShow: boolean;
  appercuShow: boolean;
  selectedRowIndex = 0;
  public quantiteRules: object;
  public prixRules: object;
  public livreRules: object;
  public dateRules: object;
  s_total = 0;
  tot_cmd = '0.000';
  MD_cmd = '0.000';
  total: number;

  commande: Commande = {
    id: null,
    numCmd: '',
    artCmd: '',
    qteCmd: '',
    livCmd: '',
    prCmd: '',
    rang: '',
    datePr: '',
  };
  command: Command = {
    id: null,
    numcmd: '',
    frscmd: '',
    datcmd: '',
    echcmd: '',
    devcmd: '',
    tcmd: '',
    pcmd: '',
    lcmd: '',
    ddcmd: '',
    totcmd: '',
    bnqcmd: '',
    purcmd: null,
    livcmd: null,
    mdcmd: '',
    profcmd: null,
  };
  dateP: Date;
  datePrevue: string;
  detailBanque = '';
  codeBanque = '';
  codeTransp = '';
  denoTransp = '';
  codeModep = '';
  denoModep = '';
  codeModel = '';
  denoModel = '';

  nvSaisieShow = false;
  apercuShow = false;
  disableTable = false;
  showGrid2 = false;
  message = '';
  displayMessage = false;
  fourDisabled = false;
  fromProforma = false;

  phonesNumber: string[] = ['58308172'];
  nomSte = '';
  ERRORSMS: string;
  visibleProbSMS: boolean;

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
  @ViewChild('grid')
  public grid: GridComponent;
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.ov.hide();
    if (this.grid !== undefined && !this.fromProforma) {
      if (this.grid.getRowInfo(event.target).rowData !== undefined) {
        this.select(event);
        this.grid.selectRows([this.grid.getRowInfo(event.target).rowIndex]);
      }
    }
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
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
    this.date = new Date().toLocaleDateString('en-GB');
    this.dateEcheance = new Date().toLocaleDateString('en-GB');
    this.dateP = new Date();

    await this.listeFour();
    await this.modeLivraison();
    await this.modePaimenet();
    await this.listeTransporteur();
    await this.listeBanque();
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
      let societe = '';
    if (
      globals.societe !== null &&
      globals.societe !== undefined
    ) {
      societe = globals.societe;
    }

    if (societe === 'CHAMAM DIVISION GROS') {
      this.nomSte = 'CDG';
    }
    if (societe === 'EQUIPEMENT MODERNE F.INDUSTRIE') {
      this.nomSte = 'EQM';
    }
    if (societe === 'SMD (STE MODERNE DISTRIBUTION)') {
      this.nomSte = 'SMD';
    }
    if (societe === 'EQUIPEMENT MODERNE HARDWARE') {
      this.nomSte = 'HARDWARE';
    }
    if (societe === 'EQUIPEMENT MODERNE AUTOMOTIVE') {
      this.nomSte = 'AUTOMOTIVE';
    }
    let commandeEnDouble: any = [];
    await this.commandService
      .verifierCommandeEnDouble()
      .toPromise()
      .then((data) => {
        commandeEnDouble = data;
      });
    if (commandeEnDouble.length > 0) {
      this.message =
        'Il y\'a un ou plusieurs articles en double dans cette commande : ' +
        commandeEnDouble[0] +
        ' \n Veuillez contacter le service informatique';
      this.displayMessage = true;

      const message =
        this.nomSte +
        ' : Probleme commande en double numero : ' +
        commandeEnDouble[0] +
        ' , Utilisateur : ' +
        String(localStorage.getItem('login'));
      console.log('message', message);
      console.log('message length', message.length);

      await this.sendMessagesImpaye(message);
    }
  }
  async listeFour() {
    await this.fourService
      .FourList()
      .toPromise()
      .then((data) => {
        this.four = data['_embedded'].fournisseurs;
      });
  }
  async modeLivraison() {
    await this.modeLService
      .modeLivraison()
      .toPromise()
      .then((data) => {
        this.modeL = data['_embedded'].modeL;
      });
  }
  async modePaimenet() {
    this.modePService
      .modePaiement()
      .toPromise()
      .then((data) => {
        this.modeP = data['_embedded'].modeP;
      });
  }
  async listeTransporteur() {
    this.transpService
      .listeTransporteur()
      .toPromise()
      .then((data) => {
        this.transp = data['_embedded'].transp;
      });
  }
  async listeBanque() {
    this.banqueService
      .listeBanque()
      .toPromise()
      .then((data) => {
        this.banque = data['_embedded'].banque;
      });
  }
  async getNumeroCom() {
    await this.comService
      .getCom()
      .toPromise()
      .then((data) => {
        this.com = data['_embedded'].com;
        this.V2 = this.com[0].numero;
        this.get_numero();
      });
  }
  async getNumeroComL() {
    await this.comLService
      .getComL()
      .toPromise()
      .then((data) => {
        this.comL = data['_embedded'].comL;
        this.V2 = this.comL[0].numero;
        this.get_numero();
      });
  }
  get_numero() {
    this.V1 = +this.V2 + 1;
    this.V2 = this.V1.toString();

    const L: number = this.V2.length;
    switch (L) {
      case 1:
        this.V1 = '0000' + this.V2;
        break;

      case 2:
        this.V1 = '000' + this.V2;

        break;
      case 3:
        this.V1 = '00' + this.V2;

        break;
      case 4:
        this.V1 = '0' + this.V2;
        break;
      case 5:
        this.V1 = this.V2;
        break;
      default:
        break;
    }
    this.numero = this.V1;
  }
  async fournisseurClick() {
    if (this.selectedFour != null && this.selectedFour.deno !== '') {
      this.typeF = this.selectedFour.typef;
      this.deno = this.selectedFour.deno;
      this.ville = this.selectedFour.post;
      if (this.selectedFour.ville !== null) {
        this.ville = this.ville + ' ' + this.selectedFour.ville;
      }
      if (this.selectedFour.pays !== null) {
        this.ville = this.ville + ' ' + this.selectedFour.pays;
      }
      this.adresse = this.selectedFour.adresse;
      if (this.typeF === 'E') {
        this.flg_etranger = true;
        this.devise = '';
      } else {
        this.flg_etranger = false;
        this.devise = 'DT';
      }
      if (this.flg_etranger === true) {
        await this.getNumeroCom();
      } else {
        await this.getNumeroComL();
      }
    } else {
      this.devise = '';
      this.numero = '';
      this.deno = '';
      this.ville = '';
      this.adresse = '';
    }
    setTimeout(() => document.getElementById('devise').focus(), 1);
  }
  async commandeClick(e) {
    this.wasInside = true;
    this.ov.hide();
    // if (this.numero !== '' && this.numero !== null) {

    if (this.selectedFour !== null) {
      if (this.selectedFour.id !== '' && this.selectedFour.id !== null) {
        if (this.devise !== '' && this.devise !== null) {
          this.dateP = new Date();
          await this.stockService
            .getStockByCode('')
            .toPromise()
            .then((data) => {
              this.articles = data['_embedded'].stocks;
            });
          this.champDisabled = true;
          this.cardShow = true;
          this.showGrid2 = true;
          this.allowSelection = true;
          this.rechercheDisable = false;
          this.annulerShow = true;
          if (
            String(this.selectedFour.delai) !== 'null' &&
            String(this.selectedFour.delai) !== ''
          ) {
            this.dateP.setDate(
              this.dateP.getDate() + Number(this.selectedFour.delai)
            );
          } else {
            this.dateP.setDate(this.dateP.getDate() + 45);
          }
          this.nvSaisieShow = false;
          this.apercuShow = false;
          this.excelShow = false;
          if (this.selectedBanque != null) {
            this.codeBanque = this.selectedBanque.code;
          }
          if (this.selectedTransp != null) {
            this.codeTransp = this.selectedTransp.code;
            this.denoTransp = this.selectedTransp.deno;
          }
          if (this.selectedModeP != null) {
            this.codeModep = this.selectedModeP.code;
            this.denoModep = this.selectedModeP.deno;
          }
          if (this.selectedModel != null) {
            this.codeModel = this.selectedModel.code;
            this.denoModel = this.selectedModel.deno;
          }
          /*
          if (this.fromProforma) {
            this.demandeCommande = [];
          }
          */
        } else {
          this.msgs = 'Edit DEVISE';
          this.styleOvPanel = this.styleOvPanelError;
          document.getElementById('devise').focus();
          this.ov.show(e, document.getElementById('devise'));
        }
      } else {
        this.msgs = 'Veuillez selectionner un fournisseur !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('four').focus();
        this.ov.show(e, document.getElementById('four'));
      }
    } else {
      this.msgs = 'Veuillez selectionner un fournisseur !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('four').focus();
      this.ov.show(e, document.getElementById('four'));
    }
  }
  async recherche() {

    // this.grid.selectRows([0]);
    if (this.rechIndic === 0) {
      await this.stockService
      .getStockByCode(this.code)
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
      });
      /*if (this.articles.length > 0) {
        setTimeout(() => this.grid.selectRows([0]), 10);
      }*/
    }
  }
  select(args: any) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    // console.log(index);
    if (index < 0) {
      this.existe = false;
      this.annulerShow = true;
      this.supprimerShow = true;
      this.selectedrecords = this.grid.getRowInfo(args.target).rowData;
      if (this.demandeCommande.length !== 0) {
        this.datePrevue =
          this.demandeCommande[this.demandeCommande.length - 1].date_prevue;

        for (let j = 0; j <= this.demandeCommande.length - 1; j++) {
          if (this.demandeCommande[j].code === this.selectedrecords.code) {
            this.existe = true;
            this.msgs = 'Cet article est déjà dans la liste';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(args);
          }
        }
        if (this.existe === false) {
          this.RemplirTableCommande(args);
        }
      } else {
        this.datePrevue = this.dateP.toLocaleDateString('en-GB');
        this.RemplirTableCommande(args);
      }
    } else {
      this.msgs = 'Merci de vérifier cette ligne !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById(`row_nvc${index + 1}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.ov.show(args, document.getElementById(`row_nvc${index + 1}`));
    }
  }
  async RemplirTableCommande(e) {
    this.rang = this.rang + 1;
    this.codeCommande = this.selectedrecords.code;
    this.designCommande = this.selectedrecords.design;
    this.demandeCommande.push({
      rang: this.rang,
      code: this.codeCommande,
      designation: this.designCommande,
      quantite: '1',
      prixHT: '0.000',
      livre: '0',
      total_article: '0.000',
      a_livre: '0',
      date_prevue: this.datePrevue,
    });

    this.ajout = true;
    this.validerShow = true;
    await this.commandeService
      .articleCommande(this.codeCommande)
      .toPromise()
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          this.msgs = 'L\'article est déjà commandé';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e);
        }
      });
    document.getElementById(`row_nvc_qte${this.rang}`).click();
  }
  async NouvelleSaisie() {
    if (this.flg_etranger === true) {
      await this.getNumeroCom();
    } else {
      await this.getNumeroComL();
    }
    this.wasInside = true;
    this.ov.hide();
    this.s_total = 0;
    this.tot_cmd = '0.000';
    this.MD_cmd = '0.000';
    this.devise = '';
    this.total = 0;
    this.numero = null;
    this.selectedFour = null;
    this.selectedBanque = null;
    this.selectedModeP = null;
    this.selectedModel = null;
    this.selectedTransp = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.rang = 0;
    this.champDisabled = false;
    this.demandeCommande = [];
    this.cardShow = false;
    this.appercuShow = false;
    this.showGrid2 = false;
    this.disableTable = false;
    this.ref_Prof = '';
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.blockDocument = true;
      for (let i = 0; i <= this.demandeCommande.length - 1; i++) {
        this.commande.numCmd = this.numero;
        this.commande.rang = this.demandeCommande[i].rang;
        this.commande.artCmd = this.demandeCommande[i].code;
        this.commande.livCmd = this.demandeCommande[i].livre;
        this.commande.prCmd = Number(this.demandeCommande[i].prixHT).toFixed(3);
        this.commande.qteCmd = this.demandeCommande[i].quantite;
        this.commande.datePr = this.demandeCommande[i].date_prevue;
        // console.log(this.commande);
        await this.commandeService
          .createCommande(this.commande)
          .toPromise()
          .then()
          .catch((data) => {
            this.msgs = 'Erreur de validation de commande !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btValider'));
          })
          .finally();
      }
      this.command.numcmd = this.numero;
      this.command.datcmd = this.date;
      if (String(this.dateEcheance).length > 10) {
        this.command.echcmd = this.datePipe.transform(
          this.dateEcheance,
          'dd/MM/yyyy'
        );
      } else {
        this.command.echcmd = this.dateEcheance;
      }
      this.command.frscmd = this.selectedFour.code;
      this.command.tcmd = this.codeTransp;
      this.command.pcmd = this.codeModep;
      this.command.lcmd = this.codeModel;
      this.command.devcmd = this.devise;
      this.command.totcmd = Number(this.tot_cmd).toFixed(3);
      this.command.mdcmd = this.MD_cmd;
      this.command.bnqcmd = this.codeBanque;
      this.command.profcmd = this.ref_Prof;
      // console.log(this.command);
      await this.commandService
        .createCommand(this.command)
        .toPromise()
        .then()
        .catch((data) => {
          this.msgs = 'Erreur de validation de commande !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        })
        .finally();

      if (this.flg_etranger === true) {
        await this.comService
          .update(this.V2)
          .toPromise()
          .then()
          .catch((data) => {
            this.msgs = 'Erreur de validation de commande !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btValider'));
          })
          .finally();
      } else {
        await this.comLService
          .update(this.V2)
          .toPromise()
          .then()
          .catch((data) => {
            this.msgs = 'Erreur de validation de commande !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btValider'));
          })
          .finally();
      }
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          'Nouvelle Commande',
          this.numero
        )
        .toPromise()
        .then(() => {
          // console.log(data);
        });
      this.blockDocument = false;
      this.message =
        'Commande a été crée avec succès sous le numero : ' + this.numero;
      this.displayMessage = true;
      this.validerShow = false;
      this.annulerShow = false;
      if (!this.fromProforma) {
        this.nvSaisieShow = true;
      } else {
        this.nvSaisieShow = false;
      }
      this.apercuShow = true;
      this.excelShow = true;
      this.disableTable = true;
      this.showGrid2 = false;
      /*this.validerShow = false;
      this.allowSelection = false;
      this.rechercheDisable = true;
      this.annulerShow = false;
      this.excelShow = false;
      this.supprimerShow = false;
      */ this.appercuShow = true;
      if (this.ville === null) {
        this.ville = '';
      }
      if (this.adresse === null) {
        this.adresse = '';
      }
    } else {
      this.msgs = 'Merci de vérifier cette ligne !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById(`row_nvc${index + 1}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.ov.show(e, document.getElementById(`row_nvc${index + 1}`));
    }
  }
  excel(args): void {
    const worksheet = xlsx.utils.json_to_sheet(this.demandeCommande);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Commande ' + this.numero);
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  TableBanque() {
    if (this.codeBanque !== '') {
      this.detailBanque = this.selectedBanque.deno;
      if (this.selectedBanque.compte !== null) {
        this.detailBanque =
          this.detailBanque + ' ( ' + this.selectedBanque.compte + ' )';
      }
      if (this.selectedBanque.agence !== null) {
        this.detailBanque =
          this.detailBanque + ' ( ' + this.selectedBanque.agence + ' )';
      }
    }
  }
  apercu() {
    this.TableBanque();
    const cols = [
      {
        rang: 'N°',
        reference: 'Référence',
        design: 'Désignation',
        quantite: 'Quantité',
        prixUn: 'PRIX UN',
        prixTot: 'Prix Total',
      },
    ];
    const commandePDF = [];
    for (const c of this.demandeCommande) {
      commandePDF.push({
        rang: c.rang,
        reference: c.code,
        design: c.designation,
        quantite: c.quantite,
        prixUn: Number(c.prixHT).toFixed(3),
        prixTot: Number(c.total_article).toFixed(3),
      });
    }
    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    doc1.text(this.ste[0].societe, 14, 10);
    doc1.text(this.ste[0].adresse, 14, 15);
    doc1.text(this.ste[0].codep + '     ' + this.ste[0].ville, 14, 20);
    doc1.text(
      'Tel: ' + this.ste[0].tel + '   ' + 'Fax: ' + this.ste[0].fax,
      14,
      25
    );
    doc1.text('E-mail: ' + this.ste[0].email, 14, 30);
    const displayDate = new Date().toLocaleString('default', {
      timeZone: 'Africa/Tunis',
    });
    doc1.text('Tunis, le: ' + displayDate, 140, 30);

    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Commande / Order N°: ' + this.numero, 60, 45);
    doc1.setFontSize(10);
    doc1.text('Votre réf: ' + this.ref_Prof, 14, 50);
    doc1.text('Devise: ' + this.devise, 14, 55);
    doc1.text(this.deno, 140, 50);
    doc1.text(this.adresse, 140, 55);

    doc1.text(this.ville, 140, 60);
    doc1.setFontSize(11);
    doc1.text(
      'Nous avons le plaisir de vous passer une commande pour les articles mentionnés ci-dessous : ',
      14,
      68
    );
    doc1.setFontSize(10);
    doc1.autoTable({
      head: cols,
      body: commandePDF,
      startY: 80,
      theme: 'grid',
      styles: { fontSize: 8, textColor: 20 },
    });
    doc1.setFontSize(11);
    let y = doc1.autoTable.previous.finalY + 12;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Banque: ', 14, y);
    doc1.text('Total: ' + this.MD_cmd, 160, y);
    doc1.text(this.detailBanque, 45, y);

    y = y + 6;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Transporteur: ', 14, y);
    if (String(this.denoTransp) === 'null') {
      this.denoTransp = '';
    }
    doc1.text(this.denoTransp, 45, y);

    y = y + 5;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Mode de paiement: ', 14, y);
    if (String(this.denoModep) === 'null') {
      this.denoModep = '';
    }
    doc1.text(this.denoModep, 45, y);

    y = y + 5;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Mode de livraison: ', 14, y);
    if (String(this.denoModel) === 'null') {
      this.denoModel = '';
    }
    doc1.text(this.denoModel, 45, y);

    y = y + 8;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text(
      'NB: Sur la facture il faut mentionner l\'origine de chaque article',
      14,
      y
    );

    y = y + 5;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text(
      'avec son N° de tarif douanier, ainsi que le mode et delais de paiment,',
      14,
      y
    );

    y = y + 5;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('le mode de transport et le texte de conformité.', 14, y);
    y = y + 2;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Service achat ', 155, y);
    y = y + 3;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text(
      'NB: Alaways mention on invoice origin and statistcal code of each item,',
      14,
      y
    );
    y = y + 2;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text(this.isNull(this.ste[0].gerant), 155, y);
    y = y + 3;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('term of payment,transport and conformity text.', 14, y);
    /*
    doc1.setFontSize(11);
    doc1.text('Banque: ', 14, doc1.autoTable.previous.finalY + 12);
    doc1.text(
      'Total: ' + this.MD_cmd,
      160,
      doc1.autoTable.previous.finalY + 12
    );
    doc1.text(this.detailBanque, 45, doc1.autoTable.previous.finalY + 12);
    doc1.text('Transporteur: ', 14, doc1.autoTable.previous.finalY + 18);
    doc1.text(this.denoTransp, 45, doc1.autoTable.previous.finalY + 18);
    doc1.text('Mode de paiement: ', 14, doc1.autoTable.previous.finalY + 23);
    doc1.text(this.denoModep, 45, doc1.autoTable.previous.finalY + 23);
    doc1.text('Mode de livraison: ', 14, doc1.autoTable.previous.finalY + 28);
    doc1.text(this.denoModel, 45, doc1.autoTable.previous.finalY + 28);
    doc1.text(
      'NB: Sur la facture il faut mentionner l\'origine de chaque article',
      14,
      doc1.autoTable.previous.finalY + 36
    );
    doc1.text(
      'avec son N° de tarif douanier, ainsi que le mode et delais de paiment,',
      14,
      doc1.autoTable.previous.finalY + 41
    );
    doc1.text(
      'le mode de transport et le texte de conformité.',
      14,
      doc1.autoTable.previous.finalY + 46
    );
    doc1.text(
      'NB: Alaways mention on invoice origin and statistcal code of each item,',
      14,
      doc1.autoTable.previous.finalY + 51
    );
    doc1.text(
      'term of payment,transport and conformity text.',
      14,
      doc1.autoTable.previous.finalY + 56
    );
    doc1.text('Service achat ', 155, doc1.autoTable.previous.finalY + 48);
    doc1.text(this.ste[0].gerant, 155, doc1.autoTable.previous.finalY + 53);*/
    window.open(doc1.output('bloburl'), '_blank');
  }
  onRowDelete(index: number) {
    this.wasInside = true;
    this.ov.hide();
    if (index > -1) {
      this.ajout = false;
      this.demandeCommande.splice(index, 1);
      this.rang = this.demandeCommande.length;
      if (this.demandeCommande.length === 0) {
        this.validerShow = false;
      }
      for (let i = index; i < this.demandeCommande.length; i++) {
        this.demandeCommande[i].rang = i + 1;
      }
    }
  }
  testSaisie(): number {
    for (let i = 0; i <= this.demandeCommande.length - 1; i++) {
      if (
        this.demandeCommande[i].quantite !== '' &&
        this.demandeCommande[i].prixHT !== '' &&
        this.demandeCommande[i].date_prevue !== ''
      ) {
        let datePrevue = 0;
        const parts = this.demandeCommande[i].date_prevue.split('/');
        datePrevue = Date.parse(parts[1] + '/' + parts[0] + '/' + parts[2]);
        console.log(parts[1] + '/' + parts[0] + '/' + parts[2]);

        if (
          String(Number(this.demandeCommande[i].quantite)) === 'NaN' ||
          Number(this.demandeCommande[i].quantite) === 0 ||
          String(Number(this.demandeCommande[i].prixHT)) === 'NaN' ||
          Number(this.demandeCommande[i].prixHT) === 0 ||
          isNaN(datePrevue)
        ) {
          return i;
        }
      } else {
        return i;
      }
    }
    return -1;
  }
  ngAfterViewChecked() {
    if (
      this.demandeCommande.length > 0 &&
      this.demandeCommande.length !== this.commandeLength &&
      this.ajout &&
      this.cardShow
    ) {
      this.scrollToBottom();
      this.commandeLength = this.demandeCommande.length;
    }
  }
  private scrollToBottom(): void {
    // console.log(this.demandeCommande.length);

    document
      .getElementById(`row_nvc${this.demandeCommande.length}`)
      .scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'start',
      });
  }
  formatter(ri) {
    this.demandeCommande[ri - 1].date_prevue = this.datePipe.transform(
      this.demandeCommande[ri - 1].date_prevue,
      'dd/MM/yyyy'
    );
  }
  actualiserLigne(col, ri) {
    ri = Number(ri) - 1;
    if (col === 'qte' || col === 'prixHT') {
      if (col === 'qte') {
        this.demandeCommande[ri].a_livre = Number(
          this.demandeCommande[ri].quantite
        ).toFixed(0);
        this.demandeCommande[ri].total_article = (
          Number(this.demandeCommande[ri].quantite) *
          Number(this.demandeCommande[ri].prixHT)
        ).toFixed(3);
        this.demandeCommande[ri].quantite = Number(
          this.demandeCommande[ri].quantite
        ).toFixed(0);
        // console.log(document.getElementById(`row_nvc_prix${this.rang}`));
        setTimeout(
          () => document.getElementById(`row_nvc_prix${ri + 1}`).click(),
          0
        );
      }
      if (col === 'prixHT') {
        this.demandeCommande[ri].total_article = (
          Number(this.demandeCommande[ri].quantite) *
          Number(this.demandeCommande[ri].prixHT)
        ).toFixed(3);
        this.demandeCommande[ri].prixHT = Number(
          this.demandeCommande[ri].prixHT
        ).toFixed(3);
        setTimeout(
          () => document.getElementById(`row_date_prevue${ri + 1}`).click(),
          0
        );
        // document.getElementById('searchInput').focus();
        // console.log(ri + 1, this.rang);

        /*if (ri + 1 === this.rang) {
          setTimeout(
            () => document.getElementById('searchInput').focus(),

            1
          );
        } else {
          setTimeout(
            () => document.getElementById(`row_nvc_qte${ri + 2}`).click(),
            0
          );
        }*/
      }
      this.s_total = 0;
      for (let i = 0; i <= this.demandeCommande.length - 1; i++) {
        this.s_total =
          Number(this.s_total) + Number(this.demandeCommande[i].total_article);
        this.MD_cmd = Number(this.s_total).toFixed(3);
      }
    }
    if (col === 'datePrevue') {
      if (ri + 1 === this.rang) {
        this.rechIndic = 1;
        setTimeout(
          () => document.getElementById('searchInput').focus(),
          // this.grid.selectRows([this.grid.getSelectedRowIndexes()[0]]),
          10
        );
      } else {
        setTimeout(
          () => document.getElementById(`row_nvc_qte${ri + 2}`).click(),
          0
        );
      }
    }
    if (col === 'livre') {
      if (
        Number(this.demandeCommande[ri].quantite) <
        Number(this.demandeCommande[ri].livre)
      ) {
        this.demandeCommande[ri].livre = this.demandeCommande[ri].quantite;
      }
      this.demandeCommande[ri].a_livre = (
        Number(this.demandeCommande[ri].quantite) -
        Number(this.demandeCommande[ri].livre)
      ).toFixed(0);
      this.demandeCommande[ri].livre = Number(
        this.demandeCommande[ri].livre
      ).toFixed(0);
    }
  }
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  changeLocation(index) {
    if (index === 0) {
      document.getElementById('refProf').focus();
    } else {
      if (index === 1) {
        (<HTMLInputElement>document.getElementById('echeance')).focus();
      } else {
        document.getElementById('btEtablirCommande').focus();
      }
    }
  }
  async sendMessagesImpaye(msg) {
    let token = '';
    await this.smsService
      .getAccessToken()
      .toPromise()
      .then((data) => {
        try {
          console.log('access token ', data);
          token = data;
        } catch (error) {
          console.log('Error happened here!');
          console.error(error);
        }
      })
      .catch((error) => {
        console.log('errreeeeeeur ', error.Text);
      });

    if (token !== null && token !== undefined && token.length > 0) {
      // const phonesNumber = ['50314635', '58308172', '58460426'];
      const message: any = {
        mobileNumber: '',
        smsText: msg,
        token: token,
      };
      for (const numPhone of this.phonesNumber) {
        message.mobileNumber = numPhone;
        try {
          let status = 0;
          await this.smsService.sendSms(message).subscribe((data) => {
            try {
              console.log('Message Send result ', data);
              status = Number(data);
              switch (status) {
                case 201: {
                  this.ERRORSMS = `Message bien envoyé  🙂 `;
                  break;
                }
                case 404: {
                  this.ERRORSMS = `404 Not Found Service SMS : veuillez contacter le service informatique ☹️☹️`;
                  break;
                }
                case 403: {
                  this.ERRORSMS = `403 Access Denied Service SMS : veuillez contacter le service informatique ☹️☹️`;
                  break;
                }
                case 500: {
                  this.ERRORSMS = `500 Internal Server Error  Service SMS : veuillez contacter le service informatique ☹️☹️`;
                  break;
                }
                default: {
                  this.ERRORSMS = `Server Error Service SMS : veuillez contacter le service informatique ☹️☹️`;
                  break;
                }
              }
            } catch (error) {
              console.log('Message Send , Error happened here !');
              this.ERRORSMS = `Server Error Service SMS : veuillez contacter le service informatique`;
              console.error(error);
            }
          });
          this.visibleProbSMS = true;
          console.log(status, 'ssssssssssssssssssss');
        } catch (e) {
          this.ERRORSMS = `Erreur vous ne pouvez pas envoyer un SMS : veuillez contacter le service informatique ☹️ ☹️`;
        }
      }
    }
  }
  public dataBound(args): void {
    if (this.articles.length > 0) {
      this.grid.selectRows([0]);
    }
  }
  isNull(chaine: any): string {
    if (chaine === null) {
      return '';
    } else {
      return chaine;
    }
  }
}
