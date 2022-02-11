import {
  OnInit,
  Component,
  ViewChild,
  HostListener,
  AfterViewChecked,
} from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/fournisseur';
import {
  GridComponent,
  EditSettingsModel,
  ToolbarItems,
} from '@syncfusion/ej2-angular-grids';

import { StockService } from '../services/stock.service';
import { Demande } from '../services/demande';
import { DemandeService } from '../services/demande.service';

import { ProService } from '../services/pro.service';
import { Pro } from '../services/pro';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import { Dialog, OverlayPanel } from 'primeng/primeng';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { LoginService } from 'src/app/login/login.service';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { NouvelleCommandeComponent } from '../nouvelle-commande/nouvelle-commande.component';
import { DatePipe } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  selector: 'app-demande-proforma',
  templateUrl: './demande-proforma.component.html',
  styleUrls: ['./demande-proforma.component.scss'],
  providers: [DatePipe],
})
export class DemandeProformaComponent implements OnInit, AfterViewChecked {
  @ViewChild(NouvelleCommandeComponent) NouvelleCommande;
  proformaLength = 0;
  ajout = false;
  @ViewChild('grid')
  public grid: GridComponent;
  public editSettings: EditSettingsModel;
  public toolbar: ToolbarItems[];

  four: Fournisseur[] = [];
  fournisseur: Fournisseur[] = [];
  articles = [];
  allowModifCode = false;
  public proforma = [];

  deno = '';
  adresse = '';
  ville = '';
  date;
  code = '';
  champDisabled = false;
  rechercheDisable = false;
  selectedrecords;
  codeProforma: any;
  designProforma: any;
  saisirShow = false;
  validerShow = false;
  annulerShow = true;
  // appercuShow = false;
  excelShow = false;
  cardShow = false;
  nouvelleReferenceShow = false;
  allowSelection = true;
  rang = 0;
  existe: boolean;
  V1: any;
  V2: string;
  numero: string;
  selectedFour;
  ste: Ste;
  pro: Pro = {
    id: '',
    numero: '',
  };

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
  valide: boolean;
  nvSaisieShow = false;
  apercuShow = false;
  disableTable = false;
  showGrid2 = true;
  message = '';
  displayMessage = false;
  displayCommande = false;
  blockedDocument = false;
  fromOutside = false;
  rechIndic = 0;
  @ViewChild('ngSelectFournisseur') ngSelectFournisseur: NgSelectComponent;
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
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.ov.hide();
    if (this.grid !== undefined) {
      if (this.grid.getRowInfo(event.target).rowData !== undefined) {
        this.select(event);
        this.grid.selectRows([this.grid.getRowInfo(event.target).rowIndex]);
      }
    }
  }
  constructor(
    private fourService: FournisseurService,
    private stockService: StockService,
    private demandeService: DemandeService,
    private proService: ProService,
    private steService: SteService,
    private loginService: LoginService,
    private config: NgSelectConfig,
    private datePipe: DatePipe
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  async ngOnInit() {
    this.fourService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.four = data['_embedded'].fournisseurs;
      });
    this.date = new Date().toLocaleDateString('en-GB');
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
    this.NouvelleCommande.fromProforma = true;
    setTimeout(() => this.ngSelectFournisseur.focus(), 1);
  }

  async getNumeroPro() {
    await this.proService
      .getNumero()
      .toPromise()
      .then((data) => {
        this.pro = data['_embedded'].pro;
        this.V2 = this.pro[0].numero;
      });
  }
  async setCode() {
    if (this.selectedFour != null) {
      await this.fourService
        .FourByDeno(this.selectedFour.deno)
        .toPromise()
        .then((data) => {
          this.fournisseur = data['_embedded'].fournisseurs;
        });
      this.demandeProforma.operateur = this.fournisseur[0].code;
      this.deno = this.fournisseur[0].deno;
      this.ville = this.fournisseur[0].ville;
      this.adresse = this.fournisseur[0].adresse;
      this.saisirShow = true;
      setTimeout(() => document.getElementById('btSaisir').focus(), 1);
    } else {
      this.deno = '';
      this.ville = '';
      this.adresse = '';
      this.saisirShow = false;
    }
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
  async saisir() {
    await this.stockService
      .getStockByCode('')
      .toPromise()
      .then((data) => {
        this.articles = data['_embedded'].stocks;
      });
    this.champDisabled = true;
    this.cardShow = true;
    this.allowSelection = true;
    this.saisirShow = false;
    this.rechercheDisable = false;
    this.nouvelleReferenceShow = true;
    this.nvSaisieShow = false;
    this.apercuShow = false;
    this.excelShow = false;
    setTimeout(() => {
      document.getElementById('codeArt').focus();
    }, 10);
  }

  select(args: any) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.allowModifCode = false;
      this.existe = false;
      this.annulerShow = true;

      this.selectedrecords = this.grid.getRowInfo(args.target).rowData;
      if (this.proforma.length !== 0) {
        let j;
        for (j = 0; j <= this.proforma.length - 1; j++) {
          if (this.proforma[j].code === this.selectedrecords.code) {
            this.existe = true;
            this.msgs = 'Cet article est déjà dans la liste !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(args);
          }
        }
        if (this.existe === false) {
          this.rang = this.rang + 1;
          this.codeProforma = this.selectedrecords.code;
          this.designProforma = this.selectedrecords.design;
          this.proforma.push({
            rang: this.rang,
            code: this.codeProforma,
            designation: this.designProforma,
            unite: 'P',
            quantite: '1',
          });
          this.ajout = true;
          this.validerShow = true;
          this.apercuShow = true;
          this.excelShow = true;

          setTimeout(() => {
            document.getElementById(`row_unite_${this.rang}`).click();
            document.getElementById(`row_unite_${this.rang}`).focus();
          }, 0);
        }
      } else {
        this.rang = this.rang + 1;
        this.codeProforma = this.selectedrecords.code;
        this.designProforma = this.selectedrecords.design;
        this.proforma.push({
          rang: this.rang,
          code: this.codeProforma,
          designation: this.designProforma,
          unite: 'P',
          quantite: '1',
        });
        this.ajout = true;
        this.validerShow = true;
        this.apercuShow = true;
        this.excelShow = true;
        setTimeout(() => {
          document.getElementById(`row_unite_${this.rang}`).click();
          document.getElementById(`row_unite_${this.rang}`).focus();
        }, 0);
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
  ngAfterViewChecked() {
    if (
      this.proforma.length > 0 &&
      this.proforma.length !== this.proformaLength &&
      this.ajout
    ) {
      this.scrollToBottom();
      this.proformaLength = this.proforma.length;
    }
  }
  private scrollToBottom(): void {
    document.getElementById(`row_${this.proforma.length}`).scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'start',
    });
  }

  async verifCode(codeArt, rang, type, e) {
    let refs = [];
    await this.stockService
      .getStock(codeArt)
      .toPromise()
      .then((data) => {
        refs = data['_embedded'].stocks;
      });

    if (refs.length === 0) {
      this.allowModifCode = true;
    } else {
      this.allowModifCode = false;
      if (type === 1) {
        const found = this.proforma.find((dem) => dem.code === codeArt);
        if (String(found) === 'undefined') {
          this.proforma[Number(rang) - 1].code = refs[0].code;
          this.proforma[Number(rang) - 1].designation = refs[0].design;
        } else {
          this.msgs = 'Cet article est déjà dans la liste !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById(`row_${rang}`));
        }
        this.proforma[Number(rang) - 1].code = refs[0].code;
        this.proforma[Number(rang) - 1].designation = refs[0].design;
      }
    }
  }

  testSaisie(): number {
    for (let i = 0; i <= this.proforma.length - 1; i++) {
      if (
        this.proforma[i].code !== '' &&
        this.proforma[i].design !== '' &&
        this.proforma[i].unite !== '' &&
        this.proforma[i].quantite !== ''
      ) {
        if (
          String(Number(this.proforma[i].quantite)) === 'NaN' ||
          Number(this.proforma[i].quantite) === 0
        ) {
          return i;
        }
      } else {
        return i;
      }
    }
    return -1;
  }

  async valider(args) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.blockedDocument = true;
      await this.getNumeroPro();
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
      const x: any = this.proforma;
      let i;
      for (i = 0; i <= this.proforma.length - 1; i++) {
        this.demandeProforma.combine = 'PROFORMA ' + this.V1;
        this.demandeProforma.rang = x[i].rang;
        this.demandeProforma.code = x[i].code;
        this.demandeProforma.design = x[i].designation;
        this.demandeProforma.unite = x[i].unite;
        this.demandeProforma.quantite = x[i].quantite;
        this.demandeProforma.date = this.date;
        await this.demandeService
          .createDemande(this.demandeProforma)
          .toPromise()
          .then();
      }
      await this.proService.update(this.V2).toPromise().then();
      this.allowSelection = false;
      this.rechercheDisable = true;
      this.annulerShow = false;
      this.nouvelleReferenceShow = false;
      if (this.ville === null) {
        this.ville = '';
      }
      if (this.adresse === null) {
        this.adresse = '';
      }
      this.numero = this.V1;
      await this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          this.numero
        )
        .toPromise()
        .then(() => {});
      this.message =
        'Proforma a été crée avec succès sous le numero : ' + this.numero;
      this.displayMessage = true;
      this.validerShow = false;
      this.annulerShow = false;
      this.nvSaisieShow = true;
      // await this.getNumeroPro();
      this.disableTable = true;
      this.showGrid2 = false;
      this.blockedDocument = false;
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

  NouvelleSaisie() {
    this.numero = null;
    this.selectedFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.rang = 0;
    this.champDisabled = false;
    this.proforma = [];
    this.cardShow = false;
    this.disableTable = false;
    this.showGrid2 = true;
    this.validerShow = false;
    this.annulerShow = true;
    if (this.fromOutside) {
      this.champDisabled = true;
    }
  }
  excel() {
    let num = (Number(this.V2) + 1).toFixed(0);
    if (num.length < 5) {
      num = '0000'.substr(0, 5 - num.length) + num;
    }
    const worksheet = xlsx.utils.json_to_sheet(this.proforma);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Proforma ' + num);
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
  nouvelleReference(args) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.allowModifCode = true;
      this.rang = this.rang + 1;
      this.proforma.push({
        rang: this.rang,
        code: this.code,
        designation: '',
        unite: 'P',
        quantite: '1',
      });
      this.ajout = true;
      this.validerShow = true;
      this.apercuShow = true;
      this.excelShow = true;
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
  async apercu() {
    let num = (Number(this.V2)).toFixed(0);
    if (num.length < 5) {
      num = '0000'.substr(0, 5 - num.length) + num;
    }
    const cols = [
      {
        rang: 'N°',
        reference: 'Référence',
        design: 'Désignation',
        unite: 'Unité',
        quantite: 'Quantité',
      },
    ];
    const prof = [];
    for (const b of this.proforma) {
      prof.push({
        rang: b.rang,
        reference: b.code,
        design: b.designation,
        unite: b.unite,
        quantite: b.quantite,
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
    doc1.text('Demande de Prix N° :' + num, 60, 45);
    doc1.setFontSize(10);

    doc1.text('' + this.deno, 140, 50);
    doc1.text('' + this.adresse, 140, 55);

    doc1.text('' + this.ville, 140, 60);
    doc1.text(
      'Messieurs,Nous avons le plaisir de vous remettre notre demande de proforma,pour la quelle nous vous demandons de nous',
      14,
      68
    );
    doc1.text(
      'indiquier vos meilleures offres de prix ainsi que le délai de livraison :',
      14,
      73
    );
    doc1.autoTable({
      head: cols,
      body: prof,
      startY: 80,
      theme: 'grid',
      styles: { fontSize: 8, textColor: 20 },
    });
    doc1.text(
      'Dans l\'attente de votre réponse,veuillez agréér,messieurs,nos meilleures saluations.',
      14,
      doc1.autoTable.previous.finalY + 12
    );
    doc1.text(
      'Le Service Commercial ',
      150,
      doc1.autoTable.previous.finalY + 22
    );
    if (String(this.ste[0].gerant) === 'null') {
      doc1.text('', 150, doc1.autoTable.previous.finalY + 27);
    } else {
      doc1.text(this.ste[0].gerant, 150, doc1.autoTable.previous.finalY + 27);
    }
    window.open(doc1.output('bloburl'), '_blank');
  }

  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  onRowDelete(index: number) {
    this.wasInside = true;
    this.ov.hide();
    if (index > -1) {
      this.ajout = false;
      this.proforma.splice(index, 1);
      this.rang = this.proforma.length;
      if (this.proforma.length === 0) {
        this.validerShow = false;
        this.apercuShow = false;
        this.excelShow = false;
      }
      for (let i = index; i < this.proforma.length; i++) {
        this.proforma[i].rang = i + 1;
      }
    }
  }
  transferCommande() {
    this.NouvelleCommande.selectedFour = this.selectedFour;
    this.NouvelleCommande.deno = this.selectedFour.respon;
    this.NouvelleCommande.adresse = this.selectedFour.adresse;
    this.NouvelleCommande.ville = this.selectedFour.ville;
    this.NouvelleCommande.fourDisabled = true;
    this.NouvelleCommande.ref_Prof = this.numero;
    this.NouvelleCommande.fromProforma = true;
    if (this.selectedFour.typeF === 'E') {
      this.NouvelleCommande.getNumeroCom();
      // this.NouvelleCommande.devise = '';
      this.NouvelleCommande.flg_etranger = true;
    } else {
      this.NouvelleCommande.getNumeroComL();
      // this.NouvelleCommande.devise = 'DT';
      this.NouvelleCommande.flg_etranger = false;
    }
    const datePrevue = new Date();
    if (
      String(this.four[0].delai) !== 'null' &&
      String(this.four[0].delai) !== ''
    ) {
      datePrevue.setDate(datePrevue.getDate() + Number(this.four[0].delai));
    } else {
      datePrevue.setDate(datePrevue.getDate() + 45);
    }
    const dmdCommande = [];
    for (const pro of this.proforma) {
      dmdCommande.push({
        rang: pro.rang,
        code: pro.code,
        designation: pro.designation,
        quantite: pro.quantite,
        prixHT: '0.000',
        livre: '0',
        total_article: '0.000',
        a_livre: '0',
        date_prevue: this.datePipe.transform(datePrevue, 'dd/MM/yyyy'),
      });
    }
    this.NouvelleCommande.demandeCommande = dmdCommande;
    this.NouvelleCommande.rang = dmdCommande.length;
    this.NouvelleCommande.validerShow = true;
    this.NouvelleCommande.apercuShow = true;
    this.NouvelleCommande.excelShow = true;
    this.displayCommande = true;
  }
  onCommandeClose() {
    this.NouvelleCommande.NouvelleSaisie();
  }
  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }
  public dataBound(args): void {
    if (this.articles.length > 0) {
      this.grid.selectRows([0]);
    }
    /*if (this.code === ''){
      setTimeout(() => {
        document.getElementById('codeArt').focus();
      }, 10);

    }*/
  }
  moveToNext(index: number, rang) {
    if (index === 0) {
      setTimeout(() => {
        document.getElementById(`row_qte_${rang}`).click();
        document.getElementById(`row_qte_${rang}`).focus();
      }, 0);
    } else {
      if (rang < this.proforma.length) {
        setTimeout(() => {
          document.getElementById(`row_unite_${rang + 1}`).click();
          document.getElementById(`row_unite_${rang + 1}`).focus();
        }, 0);
      } else {
          this.rechIndic = 1;
          setTimeout(
            () => document.getElementById('codeArt').focus(),
            10
          );
      }
    }
  }
}
