import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { SearchSettingsModel } from '@syncfusion/ej2-grids';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/fournisseur';
import { StockService } from '../services/stock.service';
import { StockMort } from './StockMort';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import * as jspdf from 'jspdf';
import { ExcelService } from '../services/excel.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';

setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' '
    }
  }
});
@Component({
  selector: 'app-etat-stock-mort',
  templateUrl: './etat-stock-mort.component.html',
  styleUrls: ['./etat-stock-mort.component.scss'],
  providers: [ExcelService]
})
export class EtatStockMortComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  fournisseurs: any;
  denoFour = 'Tout';
  num = 0;
  stocks: any;
  tab_stockmort: any;
  ngselectDisabled = true;
  tab_stockmort_imprime: any;
  stockMorts: StockMort[];
  public searchOptions: SearchSettingsModel;
  readonlynom = true;
  Totaux: Object;
  readonly = true;
  codeFour = '';
  stockMortstraitement: StockMort[];
  SelectedFournisseur: Fournisseur = {
    id: '',
    code: '',
    deno: '',
    adresse: '',
    ville: '',
    post: '',
    tel: '',
    telex: '',
    frs: '',
    respon: '',
    agence: '',
    banque: '',
    fax: '',
    compte: '',
    pays: '',
    plafond: '',
    ech: '',
    delai: '',
    typef: '',
    date_creat: ''
  };
  ste: Ste;
  societe: any;
  date = '';
  stkmort: StockMort = {
    id: '',
    codeStM: '',
    designStM: '',
    quantiteStM: '',
    prixStM: '',
    valeurStM: '',
    achatdStM: '',
    denoFour: ''
  };
  valide = false;
  public customAttributes: Object;
  wasInside: boolean;
  constructor(
    private fournisseurService: FournisseurService,
    private stockService: StockService,
    private steService: SteService,
    private excelService: ExcelService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ovo.hide();
    }
    this.wasInside = false;
  }
  async ngOnInit() {
    this.SelectedFournisseur = null;
    /// charger les fournisseurs
    await this.fournisseurService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then(data => {
        this.fournisseurs = data['_embedded'].fournisseurs;
      });
  }

  // methode rechercher les fournisseurs en front end
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  ////
  /*async MajStockMort() {
    await this.stockService.modifyTaxeStockNonStable().toPromise().then(
      (data) => {
        console.log('ok : stock non stable');

      }
    );
    await this.stockService.modifyTaxeStockMort().toPromise().then(
      (data) => {
        console.log('ok : stock stable');

      }
    );
  }*/
  // methode afficher les stocks morts
  changeFour() {
    if (this.SelectedFournisseur === null || this.SelectedFournisseur === undefined) {
      this.codeFour = '';
    } else {
      this.codeFour = this.SelectedFournisseur.code;
    }
  }
  async Afficher(e) {
    this.wasInside = true;
    this.ovo.hide();
    this.stockMorts = new Array();
    // test sur le client selectionné
    if (this.SelectedFournisseur !== null) {
      this.codeFour = this.SelectedFournisseur.code;
      this.denoFour = this.SelectedFournisseur.deno;


    // afficher les stocks morts
    await this.stockService
      .rechercheStockMort(this.codeFour)
      .toPromise()
      .then(data => {
        // datasource pour le grid
        this.stockMorts = data['_embedded'].stockMorts;
        console.log(this.stockMorts);

        // affichage
        for (this.tab_stockmort of this.stockMorts) {
          if (this.tab_stockmort.prixStM !== null) {
            this.tab_stockmort.prixStM = parseFloat(
              this.tab_stockmort.prixStM
            ).toFixed(3);
          }
          if (this.tab_stockmort.valeurStM !== null) {
            this.tab_stockmort.Valeur = parseFloat(
              this.tab_stockmort.valeurStM
            ).toFixed(3);
          }
          if (this.tab_stockmort.quantiteStM !== null) {
            this.tab_stockmort.quantite = parseFloat(
              this.tab_stockmort.quantiteStM
            ).toFixed(0);
          }
          if (this.tab_stockmort.achatdStM !== null) {
            this.tab_stockmort.date = this.tab_stockmort.achatdStM.substring(
              0,
              10
            );
          }
        }
        // datasource pour le traitement
        this.stockMortstraitement = data['_embedded'].stockMorts;
        // affichage pour le traitement (excel , pdf)
        for (this.tab_stockmort_imprime of this.stockMortstraitement) {
          if (this.tab_stockmort_imprime.prixStM !== null) {
            this.tab_stockmort_imprime.prixStM = parseFloat(
              this.tab_stockmort_imprime.prixStM
            ).toFixed(3);
          }
          if (this.tab_stockmort_imprime.achatdStM !== null) {
            this.tab_stockmort_imprime.date = this.tab_stockmort_imprime.achatdStM.substring(
              0,
              10
            );
          }
        }
      });
    // si il n'existe pas de stocks morts
    if (this.stockMorts.length === 0) {
      this.valide = false;
      this.Totaux = null;
      this.codeFour = '';
      this.denoFour = 'Tout';
      this.ngselectDisabled = true;

      this.ms = 'Aucun stock trouvé !';
     this.ovo.show(e, document.getElementById('btn'));
    } else {
      this.valide = true;
      this.ngselectDisabled = false;
      console.log(this.stockMorts);

    }
    // console.log(this.stockMorts.length);

  } else {
    this.ms = 'veuilez choisir un fournisseur !!';
    this.ovo.show(e, document.getElementById('fourn'))  ;
  }
}

  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
    }
  }
  // methode pour réaisir: initialisation
  async NvlSaisie() {

    // initialisation
    this.stockMorts = null;
    this.stockMortstraitement = null;
    this.ngselectDisabled = true;
    this.Totaux = null;
    this.codeFour = '';
    this.denoFour = 'Tout';
    this.valide = false;

  }
  // calcul le total des stocks morts
  async CalculTotal() {
    // si n'existe pas des stock
    if (this.stockMorts.length === null || this.stockMorts.length === 0) {
      this.Totaux = String(this.num.toFixed(3));
    } else {
      await this.stockService
        .calculTotal(this.codeFour)
        .toPromise()
        .then(data => {
          this.Totaux = data;
        });
    }
  }
  // excel
  async exceltout(args) {

    if (this.codeFour === null || this.codeFour === undefined ) {


      await this.stockService
        .rechercheStockMort('')
        .toPromise()
        .then(data => {
          // datasource pour le grid
          this.stockMortstraitement = data['_embedded'].stockMorts;
        });
      } else {
        await this.stockService
        .rechercheStockMort(this.codeFour)
        .toPromise()
        .then(data => {
          // datasource pour le grid
          this.stockMortstraitement = data['_embedded'].stockMorts;
        });
      }
      if (this.stockMortstraitement === undefined) {
        console.log('undefined');
      } else {
        const exportExcel = this.stockMortstraitement.map(obj => {
          // console.log("ok");
          return {
            Code: obj.codeStM,
            Désignation: obj.designStM,
            quantite: parseFloat(obj.quantiteStM).toFixed(0),
            Prix: obj.prixStM,
            Valeur: obj.valeurStM,
            'Dernière Date': String(obj.achatdStM).substring(0, 10),
            'Fournisseur' : obj.denoFour
          };
        });

        this.excelService.exportAsExcelFile(
          exportExcel,
          'StockMort du Fournisseur' + this.denoFour
        );
      }
    }

  // imprimer

  async imprimertout(evenement) {

if (this.codeFour === null || this.codeFour === undefined ) {


    await this.stockService
      .rechercheStockMort('')
      .toPromise()
      .then(data => {
        // datasource pour le grid
        this.stockMortstraitement = data['_embedded'].stockMorts;
      });
    } else {
      await this.stockService
      .rechercheStockMort(this.codeFour)
      .toPromise()
      .then(data => {
        // datasource pour le grid
        this.stockMortstraitement = data['_embedded'].stockMorts;
      });
    }
    const doc1 = new jspdf();
    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');

    await this.steService
      .getSte()
      .toPromise()
      .then(data => {
        this.ste = data['_embedded'].ste;
        this.societe = this.ste[0];
      });
    doc1.text(this.societe.societe, 10, 15);
    doc1.setFontSize(13);
    doc1.setFontStyle('bold');
    doc1.setFontStyle('Arial');
    doc1.text('* Stock mort : stock avec Qte > 0 et non mouvementé durant l\'année courante ,', 15, 25);
    doc1.text(' l\'année -1 , l\'année -2 et l\'année -3 .  ', 16, 32);

    /* doc1.setFontSize(12);
    doc1.setFontStyle('bold');
    doc1.setFontStyle('Arial');
    doc1.text(' LES TROIS DERNIERS ANNEES ET QUANTITE > 0', 35, 42);*/
    // recuperer la date  du systeme
    const temps = new Date().toLocaleTimeString();
    doc1.setFontSize(12);
    doc1.setFontStyle('bold');
    doc1.setFontStyle('Arial');
    this.date = new Date().toLocaleDateString('en-GB');
    doc1.text('EDITE LE    ' + this.date, 138, 42);
    doc1.setFontSize(10);
    doc1.setFontStyle('Arial');
    doc1.text('Founisseur :  ' + 'Tout', 10, 55);
    // entete du  tableau
    doc1.setFontSize(12);
    doc1.line(9, 60, 205, 60);
    doc1.line(9, 60, 9, 280);
    doc1.line(205, 60, 205, 280);
    doc1.setFontSize(12);
    doc1.text('Code', 10, 65);
    doc1.text('Designation', 36, 65);
    doc1.text('Quantite', 90, 65);
    doc1.text('Prix', 109, 65);
    doc1.text('Valeur', 121, 65);
    doc1.text('Der dt d\'ach', 136, 65);
    doc1.text('Fournisseur', 159, 65);
    // creer la ligne
    doc1.setFontStyle('bold');
    doc1.line(9, 68, 205, 68);
    let y = 73;
    let numPage = 1;
    doc1.setFontSize(10);
    doc1.setFontStyle('Arial');
    // créer la ligne vertical
    doc1.setFontStyle('bold');
    doc1.setFontStyle('bold');

    for (this.stkmort of this.stockMortstraitement) {
      doc1.setFontSize(8);
      doc1.setFontStyle('Arial');
      doc1.text(this.stkmort.codeStM, 10, y);
      doc1.text(this.stkmort.designStM, 36, y);
      doc1.text(this.stkmort.quantiteStM, 91, y);
      if (this.stkmort.prixStM === null) {
        this.stkmort.prixStM = '';
      }
      doc1.text(this.stkmort.prixStM, 109, y);
      if (this.stkmort.valeurStM === null) {
        this.stkmort.valeurStM = '';
      }
      if (this.stkmort.valeurStM === null) {
        this.stkmort.valeurStM = '';
      }
      if (this.stkmort.denoFour === null) {
        this.stkmort.denoFour = '';
      }
      doc1.text(String(Number(this.stkmort.valeurStM).toFixed(3)), 123, y);
      if (this.stkmort.achatdStM === null) {
        this.stkmort.achatdStM = '';
      }
      doc1.text(this.stkmort.achatdStM.substring(0, 10), 138, y);
      doc1.text(this.stkmort.denoFour, 160, y);

      y = y + 7;
      // passer a une nouvelle page

      if (y > 277) {
        // doc1.line(9, y - 3, 205, y - 3, 'FD');

        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        numPage++;
        doc1.addPage();
        // entete tableau
        doc1.line(9, 12, 205, 12);

        doc1.setFontSize(12);
        doc1.text('Code', 10, 17);
        doc1.text('Designation', 36, 17);
        doc1.text('Quantite', 90, 17);
        doc1.text('Prix', 109, 17);
        doc1.text('Valeur', 121, 17);
        doc1.text('Der dt d\'ach', 136, 17);
        doc1.text('Fournisseur', 159, 17);

        // creer la ligne
        doc1.setFontStyle('bold');
        doc1.line(9, 20, 205, 20);
        y = 26;
        if (numPage > 1) {
          doc1.line(9, y - 14, 9, y + 254, 'FD');
          doc1.line(205, y - 14, 205, y + 254, 'FD');
        }
      }
    }
    doc1.line(9, 280, 205, 280, 'FD');
    doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
    window.open(doc1.output('bloburl'), '_blank');
   // this.ngOnInit();
    // message de suivi pour le processus de visualisation
  }



}
