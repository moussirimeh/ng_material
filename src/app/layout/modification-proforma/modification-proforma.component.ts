import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewChecked,
} from '@angular/core';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/fournisseur';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { StockService } from '../services/stock.service';
import { Demande } from '../services/demande';
import { DemandeService } from '../services/demande.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import { OverlayPanel } from 'primeng/primeng';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { LoginService } from 'src/app/login/login.service';
import * as xlsx from 'xlsx';
import { saveAs } from 'file-saver';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { NouvelleCommandeComponent } from '../nouvelle-commande/nouvelle-commande.component';
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
  selector: 'app-modification-proforma',
  templateUrl: './modification-proforma.component.html',
  styleUrls: ['./modification-proforma.component.scss'],
  providers: [DatePipe]
})
export class ModificationProformaComponent implements OnInit, AfterViewChecked {
  @ViewChild(NouvelleCommandeComponent) NouvelleCommande;
  @ViewChild('grid')
  public grid: GridComponent;
  four: Fournisseur[] = [];
  allowModifCode = false;
  ajout = false;
  demandeLength = 0;
  articles = [];
  demande = [];
  deno = '';
  adresse = '';
  ville = '';
  date;
  code = '';
  codeFour = '';
  champDisabled = false;
  rechercheDisable = false;
  selectedrecords;
  codeProforma: any;
  designProforma: any;
  saisirShow = false;
  validerShow = false;
  supprimerShow = false;
  annulerShow = false;
  appercuShow = true;
  excelShow = false;
  cardShow = false;
  nouvelleReferenceShow = false;
  allowSelection = true;
  rang = 0;
  existe: boolean;
  combine;
  numero = '';
  ste: Ste;
  public codeRules: object;
  public quantiteRules: object;
  public designRules: object;
  public uniteRules: object;
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
  result: boolean;
  nvSaisieShow = false;
  disableTable = false;
  showGrid2 = false;
  message = '';
  displayMessage = false;
  displayCommande = false;
  blockedDocument = false;
  rechIndic = 0;
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
    private steService: SteService,
    private loginService: LoginService,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    document.getElementById('num').focus();
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
      });
      this.NouvelleCommande.fromProforma = true;
  }

  async valid_prof_num(e) {
    this.blockedDocument = true;
    this.wasInside = true;
    this.ov.hide();
    if (this.numero.length > 0) {
      if (this.numero !== '0') {
        let tmp = '';
        for (let i = 0; i < 5 - this.numero.length; i++) {
          tmp = tmp + '0';
        }
        this.numero = tmp + this.numero;
      }
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
      if (this.result) {
        await this.demandeService
          .findByCombine(this.combine)
          .toPromise()
          .then((data) => {
            this.demande = data['_embedded'].demandes;
          });
        for (let j = 0; j <= this.demande.length - 1; j++) {
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
        await this.stockService
          .getStockByCode('')
          .toPromise()
          .then((data) => {
            this.articles = data['_embedded'].stocks;
          });
        this.excelShow = true;
        this.validerShow = false;
        this.supprimerShow = true;
        this.annulerShow = true;
        this.champDisabled = true;
        this.cardShow = true;
        this.showGrid2 = true;
        this.allowSelection = true;
        this.rechercheDisable = false;
        this.nouvelleReferenceShow = true;
        this.appercuShow = true;
      }
    } else {
      this.msgs = 'Veillez saisir le numéro !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('num').focus();
      this.ov.show(e, document.getElementById('num'));
    }
    this.blockedDocument = false;
  }
  select(args: any) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.allowModifCode = false;
      this.existe = false;
      this.annulerShow = true;
      this.supprimerShow = true;
      this.selectedrecords = this.grid.getRowInfo(args.target).rowData;

      if (this.demande.length !== 0) {
        // const d: any = this.gridProforma.currentViewData;

        let j;
        for (j = 0; j <= this.demande.length - 1; j++) {
          if (this.demande[j].code === this.selectedrecords.code) {
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
          this.demande.push({
            rang: this.rang,
            code: this.codeProforma,
            design: this.designProforma,
            unite: 'P',
            quantite: '1',
          });
          this.ajout = true;
          this.validerShow = true;
          setTimeout(() => {
            document.getElementById(`row_unite_${this.rang}`).click();
            document.getElementById(`row_unite_${this.rang}`).focus();
          }, 0);
          // this.gridProforma.refresh();
        }
      } else {
        this.rang = this.rang + 1;
        this.codeProforma = this.selectedrecords.code;
        this.designProforma = this.selectedrecords.design;
        this.demande.push({
          rang: this.rang,
          code: this.codeProforma,
          design: this.designProforma,
          unite: 'P',
          quantite: '1',
        });
        this.ajout = true;
        this.validerShow = true;
        setTimeout(() => {
          document.getElementById(`row_unite_${this.rang}`).click();
          document.getElementById(`row_unite_${this.rang}`).focus();
        }, 0);
        // this.gridProforma.refresh();
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
      this.demande.length > 0 &&
      this.demande.length !== this.demandeLength &&
      this.ajout
    ) {
      this.scrollToBottom();
      this.demandeLength = this.demande.length;
    }
  }
  private scrollToBottom(): void {
    document.getElementById(`row_${this.demande.length}`).scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'start',
    });
  }

  async valider(args) {
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    console.log(index);

    if (index < 0) {
      this.blockedDocument = true;
      await this.demandeService
        .removeByCombine(this.combine)
        .toPromise()
        .then();
      this.demandeProforma.operateur = this.codeFour;
      // const x: any = this.gridProforma.currentViewData;
      let i;
      for (i = 0; i <= this.demande.length - 1; i++) {
        this.demandeProforma.combine = this.combine;
        this.demandeProforma.rang = this.demande[i].rang;
        this.demandeProforma.code = this.demande[i].code;
        this.demandeProforma.design = this.demande[i].design;
        this.demandeProforma.unite = this.demande[i].unite;
        this.demandeProforma.quantite = this.demande[i].quantite;
        this.demandeProforma.date = new Date().toLocaleDateString('en-GB');
        await this.demandeService
          .createDemande(this.demandeProforma)
          .toPromise()
          .then();
      }
      this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          this.numero
        )
        .subscribe((data) => {
          console.log(data);
        });
        this.blockedDocument = false;
      this.message =
        'Proforma numéro : ' + this.numero + ' a été modifié avec succès ' ;
      this.displayMessage = true;
      this.validerShow = false;
      this.annulerShow = false;
      this.nvSaisieShow = true;
      this.disableTable = true;
      this.showGrid2 = false;

      if (this.ville === null) {
        this.ville = '';
      }
      if (this.adresse === null) {
        this.adresse = '';
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
  annuler() {
    this.rechercheDisable = true;
    this.annulerShow = false;
    this.nouvelleReferenceShow = false;
    this.supprimerShow = false;
    this.excelShow = false;
    this.validerShow = false;
  }

  excel(args): void {
    const worksheet = xlsx.utils.json_to_sheet(this.demande);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Proforma ' + this.numero);
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
  nouvelleSaisie() {
    this.numero = null;
    this.codeFour = null;
    this.deno = null;
    this.ville = null;
    this.adresse = null;
    this.rang = 0;
    this.champDisabled = false;
    this.demande = [];
    this.cardShow = false;
    this.showGrid2 = false;
    this.appercuShow = false;
    this.disableTable = false;
    this.nvSaisieShow = false;
    this.date = '';
    document.getElementById('num').focus();
  }
  nouvelleReference(args) {
    // this.validerShow = false;
    // this.supprimerShow = true;
    // this.excelShow = false;
    this.wasInside = true;
    this.ov.hide();
    const index = this.testSaisie();
    if (index < 0) {
      this.rang = this.rang + 1;
      this.demande.push({
        rang: this.rang,
        code: '',
        design: '',
        unite: 'P',
        quantite: '1',
      });
      this.ajout = true;
      this.validerShow = true;
    } else {
      this.msgs = 'Merci de vérifier cette ligne !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById(`row_${index + 1}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.ov.show(args, document.getElementById(`row_${index + 1}`));
    }
    // this.gridProforma.refresh();
  }
  apercu() {
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
    for (const b of this.demande) {
      prof.push({
        rang: b.rang,
        reference: b.code,
        design: b.design,
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
    doc1.text('Demande de Prix N° :' + this.numero, 60, 45);
    doc1.setFontSize(10);

    doc1.text('' + this.deno, 140, 50);
    doc1.text('' + this.adresse, 140, 55);

    doc1.text('' + this.ville, 140, 60);
    doc1.text(
      'Messieurs,Nous avons le plaisir de vous remettre notre demande de proforma,' +
        'pour la quelle nous vous demandons de nous',
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
      'Dans l\'attente de votre réponse,veuillez agréér,messieurs,' +
        'nos meilleures saluations.',
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
        const found = this.demande.find((dem) => dem.code === codeArt);
        if (String(found) === 'undefined') {
          this.demande[Number(rang) - 1].code = refs[0].code;
          this.demande[Number(rang) - 1].design = refs[0].design;
        } else {
          this.msgs = 'Cet article est déjà dans la liste !';
          this.styleOvPanel = this.styleOvPanelError;
          this.ov.show(e, document.getElementById(`row_${rang}`));
        }
      }
    }
  }
  onRowDelete(index: number) {
    this.wasInside = true;
    this.ov.hide();
    if (index > -1) {
      this.ajout = false;
      this.demande.splice(index, 1);
      this.rang = this.demande.length;
      if (this.demande.length === 0) {
        this.validerShow = false;
      } else {
        this.validerShow = true;
      }
      for (let i = index; i < this.demande.length; i++) {
        this.demande[i].rang = i + 1;
      }
    }
  }
  testSaisie(): number {
    for (let i = 0; i < this.demande.length; i++) {
      if (
        this.demande[i].code !== '' &&
        this.demande[i].design !== '' &&
        this.demande[i].unite !== '' &&
        this.demande[i].quantite !== ''
      ) {
        if (
          String(Number(this.demande[i].quantite)) === 'NaN' ||
          Number(this.demande[i].quantite) === 0
        ) {
          return i;
        }
      } else {
        return i;
      }
    }
    return -1;
  }
  transferCommande() {
    this.NouvelleCommande.selectedFour = this.four[0];
    this.NouvelleCommande.deno = this.four[0].respon;
    this.NouvelleCommande.adresse = this.four[0].adresse;
    this.NouvelleCommande.ville = this.four[0].ville;
    this.NouvelleCommande.fournisseurClick();
    this.NouvelleCommande.fourDisabled = true;
    this.NouvelleCommande.ref_Prof = this.numero;
    const datePrevue = new Date();
    if (
      String(this.four[0].delai) !== 'null' &&
      String(this.four[0].delai) !== ''
    ) {
      datePrevue.setDate(
        datePrevue.getDate() + Number(this.four[0].delai)
      );
    } else {
      datePrevue.setDate(datePrevue.getDate() + 45);
    }
    const dmdCommande = [];
    for (const pro of this.demande) {
      dmdCommande.push({
        rang: pro.rang,
        code: pro.code,
        designation: pro.design,
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
  moveToNext(index: number, rang) {
    if (index === 0) {
      setTimeout(() => {
        document.getElementById(`row_qte_${rang}`).click();
        document.getElementById(`row_qte_${rang}`).focus();
      }, 0);
    } else {
      if (rang < this.demande.length) {
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
