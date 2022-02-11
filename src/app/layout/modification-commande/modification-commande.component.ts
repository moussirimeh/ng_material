import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewChecked,
} from '@angular/core';
import { CommandeFourService } from '../services/commandeFour.service';
import { CommandeService } from '../services/commande.service';
import { CommandService } from '../services/command.service';
import { DetailCommandeFourService } from '../services/detailCommandeFour.service';
import {
  GridComponent,
  EditSettingsModel,
  ToolbarItems,
  ExcelExportProperties,
} from '@syncfusion/ej2-angular-grids';
import { CommandeFour } from '../services/commandeFour';
import { StockService } from '../services/stock.service';
import { SteService } from '../services/ste.service';
import { ModePService } from '../services/modeP.service';
import { ModeLService } from '../services/modeL.service';
import { TranspService } from '../services/transp.service';
import { BanqueService } from '../services/banque.service';
import { Ste } from '../services/ste';
import { Transp } from '../services/transp';
import { ModeP } from '../services/modeP';
import { ModeL } from '../services/modeL';
import { Banque } from '../services/banque';
import { ReferenceEquivalenteService } from '../services/referenceEquivalente.service';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { LoginService } from 'src/app/login/login.service';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { Commande } from '../services/commande';
import { Command } from '../services/command';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { ExcelService } from '../services/excel.service';
import { DatePipe } from '@angular/common';
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
  selector: 'app-modification-commande',
  templateUrl: './modification-commande.component.html',
  styleUrls: ['./modification-commande.component.scss'],
  providers: [DatePipe, ExcelService],
})
export class ModificationCommandeComponent implements OnInit, AfterViewChecked {
  blockDocument = false;
  rechIndic = 0;
  ajout = false;
  commandeLength = 0;
  detailBanque = '';
  @ViewChild('gridEquivs')
  public gridEquivs: GridComponent;
  @ViewChild('gridMouves')
  public gridMouves: GridComponent;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];
  ste: Ste;
  transp: Transp = null;
  modeP: ModeP = null;
  modeL: ModeL = null;
  banque: Banque = null;
  articles = [];
  commandeFour: any[] = [];
  commande = [];
  numero = '';
  dateP: Date;
  datePrevue: string;
  devise;
  deno = '';
  adresse = '';
  ville = '';
  date: string;
  date_liv: string;
  codeFour = '';
  id = null;
  refProf = '';
  codeTransp: string;
  codeModeP: string;
  codeModeL: string;
  denoTransp: string;
  denoModeP: string;
  denoModeL: string;
  codeBNQ: string;
  denoBNQ: string;
  tot_cmd: string;
  md_cmd: string;
  cardShow = false;
  cardEquivShow = false;
  situation: string;
  selectedModel: ModeL;
  selectedModeP: ModeP;
  selectedTransp: Transp;
  selectedBanque: Banque;
  public quantiteRules: object;
  public prixRules: object;
  public livreRules: object;
  public dateRules: object;
  existe: boolean;
  annulerShow: boolean;
  supprimerShow: boolean;
  rechercheDisable: boolean;
  selectedrecords: any;
  code = '';
  rang = 0;
  codeCommande: any;
  designCommande: any;
  valide: boolean;
  validerShow: boolean;
  excelShow: boolean;
  s_total: number;
  allowSelection: boolean;
  champDisabled: boolean;
  numEquiv: any;
  referencesEquivalente: any;
  mouves = [];
  invent: number;
  mouv1: any;
  reserv: number;
  achat: number;
  av_f: number;
  av_b_l: number;
  b_l: number;
  av_cpt: number;
  fre_cpt: number;
  reg_plus: number;
  reg_moin: number;
  entreesom: number;
  sortiesom: number;
  showTotaux = false;
  showBtVoirTotaux = false;
  showMvmts = false;
  apercuShow = true;
  message = '';
  displayMessage = false;
  nvSaisieShow = false;
  disableTable = false;
  dateEcheance;
  tn;
  selectedRowIndex = 0;
  consultOnly = false;
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
    if (this.grid.getRowInfo(event.target).rowData !== undefined) {
      this.select(event);
      this.grid.selectRows([this.grid.getRowInfo(event.target).rowIndex]);
    }
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private commandeFourService: CommandeFourService,
    private commandeService: CommandeService,
    private commandService: CommandService,
    private detailCommandeFourService: DetailCommandeFourService,
    private stockService: StockService,
    private steService: SteService,
    private modePService: ModePService,
    private modeLService: ModeLService,
    private transpService: TranspService,
    private banqueService: BanqueService,
    private referenceEquivalenteService: ReferenceEquivalenteService,
    private loginService: LoginService,
    private mouveService: MouveService,
    private mouve1Service: Mouve1Service,
    private mouve2Service: Mouve2Service,
    private excelService: ExcelService,
    private config: NgSelectConfig,
    private datePipe: DatePipe
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
    this.date = new Date().toLocaleDateString('en-GB');
    this.dateP = new Date();

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
    if (globals.selectedMenu === 'Duplicata Commande') {
      this.consultOnly = true;
      this.disableTable = true;
    }
    document.getElementById('num').focus();
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
    await this.modePService
      .modePaiement()
      .toPromise()
      .then((data) => {
        this.modeP = data['_embedded'].modeP;
      });
  }
  async listeTransporteur() {
    await this.transpService
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
  async valid_prof_num(e) {
    this.blockDocument = true;
    this.rang = 0;
    this.ajout = false;
    if (this.numero.length > 0) {
      if (this.numero !== '0') {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero.length; i++) {
          tmp = tmp + '0';
        }
        this.numero = tmp + this.numero;
      }
      await this.detailCommandeFourService
        .commandeFour(this.numero)
        .toPromise()
        .then((data) => {
          this.commande = data['_embedded'].detailCommandeFour;
        });

      if (this.commande.length === 0) {
        this.msgs = 'COMMANDE FOURNISSEUR inéxistant !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('num').focus();
        this.ov.show(e, document.getElementById('num'));
      } else {
        await this.commandeFourService
          .detailCommandeFour(this.numero)
          .toPromise()
          .then((data) => {
            this.commandeFour = data['_embedded'].commandeFour;
          });
        console.log(this.commandeFour);
        this.dateP = new Date();
        if (this.commandeFour.length > 0) {
          if (
            String(this.commandeFour[0].delai) !== 'null' &&
            String(this.commandeFour[0].delai) !== ''
          ) {
            this.dateP.setDate(
              this.dateP.getDate() + Number(this.commandeFour[0].delai)
            );
          } else {
            this.dateP.setDate(this.dateP.getDate() + 45);
          }
        }
        await this.stockService
          .getStockByCode('')
          .toPromise()
          .then((data) => {
            this.articles = data['_embedded'].stocks;
          });

        for (let j = 0; j <= this.commande.length - 1; j++) {
          this.rang = this.rang + 1;
          this.commande[j].rang = this.rang;
        }
        if (this.commandeFour.length > 0) {
          if (this.commandeFour[0].purcmd === 'O') {
            this.situation =
              'TOTALEMENT LIVREE le ' +
              new Date(this.commandeFour[0].livcmd).toLocaleDateString('en-GB');
          } else if (this.commandeFour[0].purcmd === 'P') {
            this.situation =
              'PARTIELLEMENT LIVREE le ' +
              new Date(this.commandeFour[0].livcmd).toLocaleDateString('en-GB');
          } else {
            this.situation = 'NON LIVREE ';
          }

          this.deno = this.commandeFour[0].deno;
          this.ville = this.commandeFour[0].post;
          if (this.commandeFour[0].ville !== null) {
            this.ville = this.ville + ' ' + this.commandeFour[0].ville;
          }
          if (this.commandeFour[0].pays !== null) {
            this.ville = this.ville + ' ' + this.commandeFour[0].pays;
          }
          this.selectedBanque = {
            id: '',
            code: this.commandeFour[0].bnqcmd,
            deno: this.commandeFour[0].bankdeno,
            agence: this.commandeFour[0].agence,
            compte: this.commandeFour[0].compte,
          };
          this.selectedTransp = {
            id: '',
            code: this.commandeFour[0].tcmd,
            deno: this.commandeFour[0].transpdeno,
          };
          this.selectedModeP = {
            id: '',
            code: this.commandeFour[0].pcmd,
            deno: this.commandeFour[0].modepdeno,
          };
          this.selectedModel = {
            id: '',
            code: this.commandeFour[0].lcmd,
            deno: this.commandeFour[0].modeldeno,
          };
          this.adresse = this.commandeFour[0].adresse;
          this.codeFour = this.commandeFour[0].frscmd;
          this.id = this.commandeFour[0].id;
          this.refProf = this.commandeFour[0].profcmd;
          this.devise = this.commandeFour[0].devcmd;
          this.date = new Date(this.commandeFour[0].datcmd).toLocaleDateString(
            'en-GB'
          );
          this.dateEcheance = new Date(
            this.commandeFour[0].echcmd
          ).toLocaleDateString('en-GB');
          this.date_liv = new Date(
            this.commandeFour[0].livcmd
          ).toLocaleDateString('en-GB');
          this.tot_cmd = this.commandeFour[0].totcmd;
          this.md_cmd = this.commandeFour[0].mdcmd;
        }
        this.cardShow = true;
        this.excelShow = true;
        this.validerShow = true;
        this.supprimerShow = true;
        this.annulerShow = true;
        this.champDisabled = true;
        this.allowSelection = true;
        this.rechercheDisable = false;
        if (this.consultOnly) {
          this.validerShow = false;
          this.annulerShow = false;
          this.nvSaisieShow = true;
        }
      }
    } else {
      this.msgs = 'Veillez saisir le numéro !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    }
    this.commandeLength = this.commande.length;
    console.log(this.commande);
    this.blockDocument = false;
  }

  async recherche() {

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
    if (index < 0) {
      this.existe = false;
      this.annulerShow = true;
      this.supprimerShow = true;
      this.selectedrecords = this.grid.getRowInfo(args.target).rowData;
      if (this.commande.length !== 0) {
        // const d: any = this.gridCommande.currentViewData;
        this.datePrevue = this.commande[this.commande.length - 1].datepr;
        for (let j = 0; j <= this.commande.length - 1; j++) {
          if (this.commande[j].artcmd === this.selectedrecords.code) {
            this.existe = true;
            this.msgs = 'Cet article est déjà dans la liste !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(args);
            break;
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
      document.getElementById(`row_${index + 1}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.ov.show(args, document.getElementById(`row_${index + 1}`));
    }
  }
  async RemplirTableCommande(e) {
    this.rang = this.rang + 1;
    this.codeCommande = this.selectedrecords.code;
    this.designCommande = this.selectedrecords.design;
    this.commande.push({
      rang: this.rang,
      artcmd: this.codeCommande,
      design: this.designCommande,
      qtecmd: '1',
      prcmd: '0.000',
      livcmd: '0',
      arttotal: '0.000',
      datepr: this.datePrevue,
    });
    this.ajout = true;
    this.validerShow = true;
    this.gridEquivs.refresh();
    await this.commandeService
      .articleCommande(this.codeCommande)
      .toPromise()
      .then((data) => {
        if (Object.keys(data).length !== 0) {
          this.msgs = 'L\'article est déjà commandé !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e);
        }
      });
    document.getElementById(`row_nvc_qte${this.rang}`).click();
  }
  public totalValue = (
    arttotal: String,
    data: { qtecmd: number; prcmd: number },
    column: Object
  ) => {
    return (arttotal = Number(data.prcmd * data.qtecmd).toFixed(3));
  }
  public prix = (prcmd: string, data: { prcmd: number }, column: Object) => {
    return (prcmd = Number(data.prcmd).toFixed(3));
  }
  public alivre = (
    field: string,
    data: { qtecmd: number; livcmd: number },
    column: Object
  ) => {
    if (Math.sign(data.qtecmd - data.livcmd) === 1) {
      return data.qtecmd - data.livcmd;
    } else {
      return 0;
    }
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.blockDocument = true;
      await this.commandeService.removeByNumCmd(this.numero).toPromise().then();
      // await this.commandService.removeByNumCmd(this.numero).toPromise().then();
      let purCmd = 'O';
      for await (const commande of this.commande) {
        const cmde: Commande = {
          id: null,
          numCmd: this.numero,
          artCmd: commande.artcmd,
          qteCmd: commande.qtecmd,
          livCmd: commande.livcmd,
          prCmd: Number(commande.prcmd).toFixed(3),
          rang: commande.rang,
          datePr: '',
        };
        if (String(commande.datepr).length > 10) {
          cmde.datePr = this.datePipe.transform(commande.datepr, 'dd/MM/yyyy');
        } else {
          cmde.datePr = commande.datepr;
        }
        /*
        cmde.numCmd = this.numero;
        cmde.rang = this.commande[i].rang;
        cmde.artCmd = this.commande[i].artcmd;
        cmde.livCmd = this.commande[i].livcmd;
        cmde.prCmd = Number(this.commande[i].prcmd).toFixed(3);
        cmde.qteCmd = this.commande[i].qtecmd;
        cmde.datePr = this.datePipe.transform(
          this.commande[i].datepr,
          'dd/MM/yyyy'
        );*/
        console.log(cmde);
        if (Number(cmde.qteCmd) === Number(cmde.livCmd)) {
          purCmd = 'P';
        }
        await this.commandeService
          .createCommande(cmde)
          .toPromise()
          .then()
          .catch((data) => {
            this.msgs = 'Erreur de validation de commande !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btValider'));
          })
          .finally();
      }
      let command: any;
      await this.commandService
        .getCommandByNumCmd(this.numero)
        .toPromise()
        .then((data) => {
          command = data['_embedded'].command[0];
        });

      const cmd: Command = {
        id: this.id,
        numcmd: this.numero,
        frscmd: this.codeFour,
        datcmd: this.date,
        echcmd: '',
        devcmd: this.devise,
        tcmd: this.selectedTransp.code,
        pcmd: this.selectedModeP.code,
        lcmd: this.selectedModel.code,
        ddcmd: command.ddcmd,
        totcmd: Number(this.tot_cmd).toFixed(3),
        bnqcmd: this.selectedBanque.code,
        purcmd: purCmd,
        livcmd: '',
        mdcmd: this.md_cmd,
        profcmd: this.refProf,
      };

      // cmd.numcmd = this.numero;
      // cmd.datcmd = this.date;
      if (String(this.dateEcheance).length > 10) {
        cmd.echcmd = this.datePipe.transform(this.dateEcheance, 'dd/MM/yyyy');
      } else {
        cmd.echcmd = this.dateEcheance;
      }
      if (String(command.livcmd).length > 4) {
        cmd.livcmd = this.datePipe.transform(command.livcmd, 'dd/MM/yyyy');
      }
      // cmd.frscmd = this.codeFour;
      // cmd.id = this.id;
      // cmd.tcmd = this.selectedTransp.code;
      // cmd.pcmd = this.selectedModeP.code;
      // cmd.lcmd = this.selectedModel.code;
      // cmd.devcmd = this.devise;
      // cmd.totcmd = Number(this.tot_cmd).toFixed(3);
      // cmd.mdcmd = this.md_cmd;
      // cmd.bnqcmd = this.selectedBanque.code;
      // cmd.profcmd = this.refProf;

      console.log(this.dateEcheance);
      console.log(cmd);

      await this.commandService
        .updateCommand(cmd)
        .toPromise()
        .then()
        .catch((data) => {
          this.msgs = 'Erreur de validation de commande !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById('btValider'));
        })
        .finally();
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          this.numero
        )
        .subscribe((data) => {
          console.log(data);
        });
      /*this.confirmationService.confirm({
        message:
          'Commande numéro : ' +
          this.numero +
          ' a été modifiée avec succès Voulez-vous l\'imprimer ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Oui',
        rejectLabel: 'Non',
        accept: () => {
          this.apercu();
          this.annuler();
        },
        reject: () => {
          this.annuler();
        },
      });*/
      this.blockDocument = false;
      this.message =
        'Commande numéro : ' + this.numero + ' a été modifié avec succès ';
      this.displayMessage = true;
      this.validerShow = false;
      this.annulerShow = false;
      this.nvSaisieShow = true;
      this.disableTable = true;
    } else {
      this.msgs = 'Merci de vérifier cette ligne !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById(`row_${index + 1}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.ov.show(e, document.getElementById(`row_${index + 1}`));
    }
  }

  excel(args): void {
    if (this.commande.length > 0) {
    const exportExcel = this.commande.map((obj) => {
      return {
        'N°': obj.rang,
        'Référence': obj.artcmd,
        'Désignation': obj.design,
        'Quantité': obj.qtecmd,
        'Prix UN': obj.prcmd,
        'Prix Total': obj.arttotal,
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      'Commande ' + this.numero
    );
  }
    /*const worksheet = xlsx.utils.json_to_sheet(exportExcel);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Commande ' + this.numero);*/
  }
  /*saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(
      data,
      fileName + '_export_' + new Date().toLocaleDateString('en-GB') + EXCEL_EXTENSION
    );
  }*/

  annuler() {
    this.wasInside = true;
    this.ov.hide();
    this.rechercheDisable = true;
    this.annulerShow = false;
    this.supprimerShow = false;
    this.excelShow = false;
    this.validerShow = false;
    this.s_total = 0;
    this.tot_cmd = '0.000';
    this.md_cmd = '0.000';
    this.numero = null;
    this.date = null;
    this.codeFour = null;
    this.id = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.codeBNQ = null;
    this.denoBNQ = null;
    this.codeModeL = null;
    this.codeModeP = null;
    this.codeTransp = null;
    this.devise = null;
    this.denoModeL = null;
    this.denoModeP = null;
    this.denoTransp = null;
    this.situation = null;
    this.date_liv = null;
    this.commandeFour = [];
    this.commande = [];
    this.cardShow = false;
    this.champDisabled = false;
    this.disableTable = this.consultOnly;
    this.nvSaisieShow = false;
    this.cardEquivShow = false;
    this.dateEcheance = null;
    this.selectedTransp = null;
    this.selectedModeP = null;
    this.refProf = '';
    this.selectedModel = null;
    this.selectedBanque = null;
    setTimeout(() => document.getElementById('num').focus(), 1);
  }
  async voirEquiv(ri) {
    this.wasInside = true;
    this.ov.hide();
    const selectedRow: any = this.commande[ri];
    this.code = selectedRow.artcmd;
    await this.recherche();
    await this.stockService
      .getNumEquiv(this.code)
      .toPromise()
      .then((data) => {
        this.numEquiv = data;
      });
    await this.referenceEquivalenteService
      .getEquivalence(this.code, this.numEquiv)
      .toPromise()
      .then((data) => {
        this.referencesEquivalente = data['_embedded'].referenceEquivalente;
      });
    this.cardEquivShow = true;
  }
  onRowDelete(index: number) {
    this.wasInside = true;
    this.ov.hide();
    if (index > -1) {
      this.ajout = false;
      this.md_cmd = (
        Number(this.md_cmd) - Number(this.commande[index].arttotal)
      ).toFixed(3);
      this.commande.splice(index, 1);
      this.rang = this.commande.length;
      for (let i = index; i < this.commande.length; i++) {
        this.commande[i].rang = i + 1;
      }
      if (this.commande.length === 0) {
        this.validerShow = false;
      } else {
        this.validerShow = true;
      }
    }
  }
  testSaisie(): number {
    for (let i = 0; i <= this.commande.length - 1; i++) {
      if (
        this.commande[i].qtecmd !== '' &&
        this.commande[i].prcmd !== '' &&
        this.commande[i].datepr !== ''
      ) {
        let datePrevue = 0;
        const parts = this.commande[i].datepr.split('/');
        datePrevue = Date.parse(parts[1] + '/' + parts[0] + '/' + parts[2]);
        if (
          String(Number(this.commande[i].qtecmd)) === 'NaN' ||
          Number(this.commande[i].qtecmd) === 0 ||
          String(Number(this.commande[i].prcmd)) === 'NaN' ||
          Number(this.commande[i].prcmd) === 0 ||
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
      this.commande.length > 0 &&
      this.commande.length !== this.commandeLength &&
      this.ajout
    ) {
      document.getElementById(`row_${this.commande.length}`).scrollIntoView({
        behavior: 'auto',
        inline: 'start',
        block: 'start',
      });
      this.commandeLength = this.commande.length;
    }
  }
  actualiserLigne(col, ri) {
    ri = Number(ri) - 1;
    if (col === 'qte' || col === 'prixHT') {
      if (col === 'qte') {
        this.commande[ri].arttotal = (
          Number(this.commande[ri].qtecmd) * Number(this.commande[ri].prcmd)
        ).toFixed(3);
        this.commande[ri].qtecmd = Number(this.commande[ri].qtecmd).toFixed(0);
        if (this.commande[ri].qtecmd < this.commande[ri].livcmd) {
          this.commande[ri].livcmd = this.commande[ri].qtecmd;
        }
        setTimeout(
          () => document.getElementById(`row_nvc_prix${ri + 1}`).click(),
          1
        );
      }
      if (col === 'prixHT') {
        this.commande[ri].arttotal = (
          Number(this.commande[ri].qtecmd) * Number(this.commande[ri].prcmd)
        ).toFixed(3);
        this.commande[ri].prcmd = Number(this.commande[ri].prcmd).toFixed(3);
        /*setTimeout(
          () => document.getElementById(`row_nvc_livre${this.rang}`).click(),
          1
        );*/
        setTimeout(
          () => document.getElementById(`row_date_prevue${ri + 1}`).click(),
          0
        );
      }
      this.s_total = 0;
      for (let i = 0; i <= this.commande.length - 1; i++) {
        this.s_total = Number(this.s_total) + Number(this.commande[i].arttotal);
        this.md_cmd = Number(this.s_total).toFixed(3);
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
      if (Number(this.commande[ri].qtecmd) < Number(this.commande[ri].livcmd)) {
        this.commande[ri].livcmd = this.commande[ri].qtecmd;
      }
      this.commande[ri].livcmd = Number(this.commande[ri].livcmd).toFixed(0);
      setTimeout(
        () => this.grid.selectRows([this.grid.getSelectedRowIndexes()[0]]),
        1
      );
    }
    this.validerShow = true;
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
    for (const c of this.commande) {
      commandePDF.push({
        rang: c.rang,
        reference: c.artcmd,
        design: c.design,
        quantite: c.qtecmd,
        prixUn: Number(c.prcmd).toFixed(3),
        prixTot: Number(c.arttotal).toFixed(3),
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
    doc1.text('Tunis,le: ' + displayDate, 140, 30);

    doc1.setFontSize(18);
    doc1.setFontStyle('arial');
    doc1.text('Commande / Order N°: ' + this.numero, 60, 45);
    doc1.setFontSize(10);
    doc1.text('Votre réf: ' + this.isNull(this.refProf), 14, 50);
    doc1.text('Devise: ' + this.devise, 14, 55);
    doc1.text(this.deno, 140, 50);
    doc1.text(this.isNull(this.adresse), 140, 55);

    doc1.text(this.isNull(this.ville), 140, 60);
    doc1.setFontSize(11);
    doc1.text(
      'Nous avons le plaisir de vous passer une commande pour les articles ' +
        'mentionnés ci-dessous:',
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
    doc1.text('Total: ' + this.md_cmd, 160, y);
    doc1.text(this.detailBanque, 45, y);

    y = y + 6;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Transporteur: ', 14, y);
    if (String(this.selectedTransp.deno) === 'null') {
      this.selectedTransp.deno = '';
    }
    doc1.text(this.selectedTransp.deno, 45, y);

    y = y + 5;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Mode de paiement: ', 14, y);
    if (String(this.selectedModeP.deno) === 'null') {
      this.selectedModeP.deno = '';
    }
    doc1.text(this.selectedModeP.deno, 45, y);

    y = y + 5;
    if (y > 290) {
      doc1.addPage();
      y = 20;
    }
    doc1.text('Mode de livraison: ', 14, y);
    if (String(this.selectedModel.deno) === 'null') {
      this.selectedModel.deno = '';
    }
    doc1.text(this.selectedModel.deno, 45, y);

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

    window.open(doc1.output('bloburl'), '_blank');
  }
  TableBanque() {
    if (this.selectedBanque.code !== '') {
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
  async mvmtAnneeCour_1_2(index, e) {
    this.wasInside = true;
    this.ov.hide();
    this.showTotaux = false;
    if (this.gridEquivs.getSelectedRecords().length > 0) {
      const selectedArticle: any = this.gridEquivs.getSelectedRecords()[0];
      if (index === 0) {
        await this.mouveService
          .getMouveByCodeForConsultationRef(selectedArticle.code)
          .toPromise()
          .then((data) => {
            this.mouves = data['_embedded'].mouvementDuStocks;
          });
      } else {
        if (index === 1) {
          await this.mouve1Service
            .getMouve1ByCodeForConsultationRef(selectedArticle.code)
            .toPromise()
            .then((data) => {
              this.mouves = data['_embedded'].mouvementDuStocks;
            });
        } else {
          await this.mouve2Service
            .getMouve2ByCodeForConsultationRef(selectedArticle.code)
            .toPromise()
            .then((data) => {
              this.mouves = data['_embedded'].mouvementDuStocks;
            });
        }
      }
      this.showBtVoirTotaux = true;
      this.showMvmts = true;
      const column1 = this.gridMouves.getColumnByField('entree'); // get the JSON object of the column corresponding to the field name
      column1.headerText = 'Entree'; // assign a new header text to the column
      const column2 = this.gridMouves.getColumnByField('sortie'); // get the JSON object of the column corresponding to the field name
      column2.headerText = 'Sortie'; // assign a new header text to the column
      this.gridMouves.refreshHeader();
    } else {
      this.msgs = 'Veuillez selectionner un article';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  async cmdsFournisseur(e) {
    this.wasInside = true;
    this.ov.hide();
    this.showTotaux = false;
    if (this.gridEquivs.getSelectedRecords().length > 0) {
      const selectedArticle: any = this.gridEquivs.getSelectedRecords()[0];
      await this.commandeFourService
        .commandeFrs(selectedArticle.code)
        .toPromise()
        .then((data) => {
          this.mouves = data['_embedded'].mouvementDuStocks;
        });
      this.showBtVoirTotaux = true;
      this.showMvmts = true;
      const column1 = this.gridMouves.getColumnByField('entree'); // get the JSON object of the column corresponding to the field name
      column1.headerText = 'Commandé'; // assign a new header text to the column
      const column2 = this.gridMouves.getColumnByField('sortie'); // get the JSON object of the column corresponding to the field name
      column2.headerText = 'Livré'; // assign a new header text to the column
      this.gridMouves.refreshHeader();
    } else {
      this.msgs = 'Veuillez selectionner un article';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }
  afficherTot() {
    this.showTotaux = true;
    this.invent = 0;
    this.reserv = 0;
    this.achat = 0;
    this.av_f = 0;
    this.av_b_l = 0;
    this.b_l = 0;
    this.av_cpt = 0;
    this.fre_cpt = 0;
    this.reg_plus = 0;
    this.reg_moin = 0;
    this.entreesom = 0;
    this.sortiesom = 0;
    const tableMouve = this.mouves;
    for (const tab of tableMouve) {
      if (tab.document.substring(0, 6) === 'INVENT') {
        this.invent = this.invent + Number(tab.entree);
      }
      if (tab.document.substring(0, 5) === 'ACHAT') {
        this.achat = this.achat + Number(tab.entree);
      }
      if (tab.document.substring(0, 9) === 'AVOIR B/L') {
        this.av_b_l = this.av_b_l + Number(tab.entree);
      }
      if (tab.document.substring(0, 6) === 'AVOIR ') {
        this.av_b_l = this.av_b_l + Number(tab.entree);
      }
      if (tab.document.substring(0, 6) === 'AVOIRP') {
        this.av_cpt = this.av_cpt + Number(tab.entree);
      }
      if (tab.document.substring(0, 4) === 'REGU') {
        this.reg_plus = this.reg_plus + Number(tab.entree);
      }
      this.entreesom =
        this.invent + this.achat + this.av_b_l + this.av_cpt + this.reg_plus;
      if (tab.document.substring(0, 7) === 'AVOIR/F') {
        this.av_f = this.av_f + Number(tab.sortie);
      }
      if (tab.document.substring(0, 6) === 'RESERV') {
        this.reserv = this.reserv + Number(tab.sortie);
      }
      if (tab.document.substring(0, 3) === 'B/L') {
        this.b_l = this.b_l + Number(tab.sortie);
      }
      if (tab.document.substring(0, 7) === 'FACTURE') {
        this.fre_cpt = this.fre_cpt + Number(tab.sortie);
      }
      if (tab.document.substring(0, 4) === 'REGU') {
        this.reg_moin = this.reg_moin + Number(tab.sortie);
      }
      this.sortiesom =
        this.reg_moin + this.fre_cpt + this.b_l + this.reserv + this.av_f;
    }
    this.showBtVoirTotaux = false;
  }
  changeLocation(index) {
    if (index === 0) {
      document.getElementById('refProf').focus();
    } else {
      if (index === 1) {
        (<HTMLInputElement>document.getElementById('echeance')).focus();
      } else {
        document.getElementById('btValider').focus();
      }
    }
  }
  formatter(ri) {
    this.commande[ri - 1].datepr = this.datePipe.transform(
      this.commande[ri - 1].datepr,
      'dd/MM/yyyy'
    );
  }
  isNull(chaine: any): string {
    if (chaine === null) {
      return '';
    } else {
      return chaine;
    }
  }
  public dataBound(args): void {
    if (this.articles.length > 0) {
      this.grid.selectRows([0]);
    }
  }
}
