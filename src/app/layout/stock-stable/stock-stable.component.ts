import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FamilleService } from '../services/famille.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Famille } from '../services/famille';
import * as jspdf from 'jspdf';
import {
  GridComponent,
  SearchSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { OverlayPanel } from 'primeng/primeng';
import { StockService } from '../services/stock.service';
import { ExcelService } from '../services/excel.service';
import { SteService } from '../services/ste.service';
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
  selector: 'app-stock-stable',
  templateUrl: './stock-stable.component.html',
  styleUrls: ['./stock-stable.component.scss'],
  providers: [ExcelService],
})
export class StockStableComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  wasInside: any;
  @ViewChild('op')
  public op: OverlayPanel;
  msg: String;
  f = new Date().getFullYear() - 2;
  datedebut = new Date(this.f, 0, 1).toLocaleDateString('en-GB');
  datefin = new Date();
  minDate = new Date(2010, 0, 1);
  readonly: boolean;
  dateDeterStockstable: string;
  def = '';
  tn: any;
  selectedFamille: any;
  codeFamille = '';

  listeFamille = new Array();
  listefournisseurs = new Array();
  SelectedFournisseur: any;
  codefour = '';

  disableGrid = false;
  datas: any[];
  ArrayStockMouvAll = new Array();
  listeStockAll = new Array();
  btnaff: boolean;

  total_G = '0.000';

  public sortOptions: object;
  listeStockAllexcel: any[];
  listeStockAllpdf: any[];
  ste: any;
  societe: string;
  total = '0.000';

  constructor(
    private familleService: FamilleService,
    private config: NgSelectConfig,
    private stockService: StockService,
    private fournisseurService: FournisseurService,
    private excelService: ExcelService,
    private steService: SteService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }

  async ngOnInit() {
    this.SelectedFournisseur = null;
    this.selectedFamille = null;
    this.codeFamille = '';
    this.codefour = '';

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
    this.sortOptions = {
      columns: [{ field: 'code', direction: 'Ascending' }],
    };
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste;
        this.dateDeterStockstable = this.ste[0].compta;
      });
    console.log('dateDeterStockstable', this.dateDeterStockstable);

    this.def =
      'Rotation sur la periode du ' +
      this.datedebut +
      ' jusqu\'à  ' +
      this.dateDeterStockstable +
      '  <  0.3';
  }

  changeFamille() {
    if (this.selectedFamille !== null && this.selectedFamille !== undefined) {
      this.codeFamille = this.selectedFamille.code;
      //  console.log('code fam', this.codeFamille);
    } else {
      this.codeFamille = '';
    }
  }
  async chargerFournisseur() {
    if (this.listefournisseurs.length === 0) {
      await this.fournisseurService
        .getFournisseurListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des fournisseurs ', data);
          this.listefournisseurs = data['_embedded'].fournisseurs;
        });
    }
  }
  changeFournisseur() {
    if (
      this.SelectedFournisseur !== null &&
      this.SelectedFournisseur !== undefined
    ) {
      this.codefour = this.SelectedFournisseur.code;
      console.log('code four ', this.codefour);
    } else {
      this.codefour = '';
    }
  }
  public onSearchfournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async chargerListeFamille() {
    if (this.listeFamille.length === 0) {
      await this.familleService
        .getFamillesList()
        .toPromise()
        .then((data) => {
          console.log('famille liste  ', data);
          this.listeFamille = data['_embedded'].familles;
        });
    }
  }
  public onSearchfamille(word: string, item: Famille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async gererExcelgrid(e) {
    this.listeStockAllexcel = new Array();
    this.wasInside = true;
    await this.stockService
      .getListstockStable(this.codefour, this.codeFamille)
      .toPromise()
      .then((data) => {
        this.listeStockAllexcel = data['_embedded'].stockStables;
        console.log('liste  du stock ', this.listeStockAll);
      });

    if (this.listeStockAllexcel.length === 0) {
      this.msg = 'Aucun article trouvé avec ces critères !';
      this.op.show(e, document.getElementById('btnExcel'));
    } else {
      for (const obj of this.listeStockAllexcel) {
        obj.quantite = Number(obj.quantite);
        obj.achats = Number(obj.achats);
        obj.total = Number(obj.total);
      }
      const exportExcel = this.listeStockAllexcel;
      this.excelService.exportAsExcelFile(
        exportExcel,
        'Stock stable  ' + new Date().toLocaleDateString('en-GB')
      );
    }
  }

  async afficher(e) {
    this.wasInside = true;

    await this.stockService
      .getListstockStable(this.codefour, this.codeFamille)
      .toPromise()
      .then((data) => {
        this.listeStockAll = data['_embedded'].stockStables;
        // .stockMouvs;

        console.log('liste  du stock ', this.listeStockAll);
      });

    if (this.listeStockAll.length < 800 && this.listeStockAll.length > 0) {
      let totG = 0;
      for (const obj of this.listeStockAll) {
        obj.quantite = Number(obj.quantite);
        obj.achats = Number(obj.achats);
        obj.total = Number(obj.total);
        totG = totG + obj.quantite * obj.achats;
      }
      this.total_G = totG.toFixed(3);
      // this.grid.refresh();
      this.readonly = true;
      this.btnaff = true;
    } else {
      this.readonly = false;
      this.btnaff = false;
      if (this.listeStockAll.length === 0) {
        this.msg = 'Aucun article trouvé avec ces critères !';
        this.op.show(e, document.getElementById('btnAjouter'));
      } else {
        this.msg = 'Veuillez raffiner les critères  !';
        this.op.show(e, document.getElementById('btnAjouter'));
      }
    }
  }

  nouvelleSaisie() {
    this.listeStockAll = new Array();
    this.btnaff = false;
    this.readonly = false;
    this.codeFamille = '';
    this.codefour = '';
    this.SelectedFournisseur = null;
    this.selectedFamille = null;
    /* this.total_ventes = '0.000';
  this.total_achats = '0.000';
  this.total_stk = '0.000';
  this.totalventes = '';
  this.totalachats = '';
  this.totalstk = '';*/
  }
  Initialiser() {
    this.SelectedFournisseur = null;
    this.selectedFamille = null;
  }

  async Apercu(e) {
    this.listeStockAllpdf = new Array();
    this.wasInside = true;
    await this.stockService
      .getListstockStable(this.codefour, this.codeFamille)
      .toPromise()
      .then((data) => {
        this.listeStockAllpdf = data['_embedded'].stockStables;
        console.log('liste  du stock ', this.listeStockAll);
      });

    if (this.listeStockAllpdf.length === 0) {
      this.msg = 'Aucun article trouvé avec ces critères !';
      this.op.show(e, document.getElementById('btnpdf'));
    } else {
      let tot = 0;
      for (const obj of this.listeStockAllpdf) {
        obj.quantite = Number(obj.quantite);
        obj.achats = Number(obj.achats);
        obj.total = Number(obj.total);
        tot = tot + obj.quantite * obj.achats;
      }

      this.total = tot.toFixed(3);
      console.log('totalpdf ', this.total);

      let four = '';
      let fam = '';
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      this.societe = globals.societe;
      doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
      let temps = String(new Date().getUTCHours() + 1);
      temps = temps + ':' + String(new Date().getUTCMinutes());
      temps = temps + ':' + String(new Date().getUTCSeconds());
      console.log('datedu jour ', temps);
      const datedujour = new Date().toLocaleDateString('en-GB');
      doc1.text('Tunis, le : ' + datedujour + ' ' + temps, 152, 15);
      doc1.setFontSize(15);
      doc1.setFontStyle('bold');
      doc1.setTextColor(9, 4, 161);
      if (this.SelectedFournisseur !== null) {
        four = this.SelectedFournisseur.deno;
      }
      if (this.selectedFamille !== null) {
        fam = this.selectedFamille.nom;
      }

      doc1.setFontStyle('bold');
      doc1.setFontSize(10);
      doc1.text('Fournisseur  :' + four, 9, 23);
      doc1.text('Famille  :' + fam, 9, 30);
      doc1.setFontStyle('bold');
      doc1.setFontSize(16);
      doc1.text('Stock Stable ', 70, 35);
      doc1.setFontStyle('Arial');
      doc1.setFontSize(11);
      doc1.setTextColor(0, 0, 0);
      doc1.setFontStyle('bold');
      doc1.text(this.def, 9, 42);
      doc1.setFontSize(8);
      // entete du  tableau
      doc1.setFontStyle('Arial');
      doc1.line(9, 45, 205, 45);
      doc1.line(9, 45, 9, 277);
      doc1.line(205, 45, 205, 277);
      doc1.setFontStyle('bold');
      doc1.setTextColor(0, 0, 0);
      doc1.text('Référence', 11, 50);
      doc1.text('Désignation', 42, 50);
      doc1.text('Qte_stk', 100, 50);
      doc1.text('Prix_Ach', 111, 50);
      doc1.text('Total', 130, 50);
      doc1.text('Fournisseur', 141, 50);
      doc1.text('Famille', 178, 50);

      // creer la ligne
      doc1.setFontStyle('bold');
      doc1.line(9, 53, 205, 53);
      let y = 57;
      doc1.setFontStyle('Arial');
      let numPage = 1;
      for (const obj of this.listeStockAllpdf) {
        doc1.setFontSize(7);
        doc1.setFontStyle('Arial');
        doc1.text(obj.code, 11, y);
        doc1.text(String(obj.design), 43, y);
        doc1.text(Number(obj.quantite).toFixed(1), 110, y, 'right');
        doc1.text(Number(obj.achats).toFixed(3), 124, y, 'right');
        doc1.text(Number(obj.total).toFixed(3), 138, y, 'right');
        doc1.text(String(obj.fournisseur).substr(0, 23), 142, y);
        doc1.text(String(obj.famille).substr(0, 16), 179, y);

        y = y + 7;
        if (y > 277) {
          doc1.line(9, 277, 205, 277);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          doc1.line(9, 12, 205, 12);
          doc1.line(9, 12, 9, 277);
          doc1.line(205, 12, 205, 277);
          doc1.setFontSize(10);
          doc1.setFontStyle('bold');
          doc1.setFontSize(10);
          doc1.setFontStyle('bold');
          doc1.setTextColor(0, 0, 0);
          doc1.text('Référence', 11, 17);
          doc1.text('Désignation', 42, 17);
          doc1.text('Qte_stk', 100, 17);
          doc1.text('Prix_Ach', 111, 17);
          doc1.text('Total', 130, 17);
          doc1.text('Fournisseur', 141, 17);
          doc1.text('Famille', 178, 17);
          // creer la ligne
          doc1.setFontStyle('bold');
          doc1.line(9, 20, 205, 20);
          y = 24;
        }
      }
      doc1.setFontStyle('bold');
      doc1.setFontSize(12);
      doc1.line(9, y + 3, 205, y + 3);
      y = y + 10;
      doc1.text('Total :  ', 110, y);
      doc1.text(this.total, 125, y);
      // + this.TtHT + '' + this.TtRem + '' + this.TtNet
      doc1.setFontStyle('bold');
      doc1.setFontSize(7);
      /*  doc1.text(this.total_ventes , 172 , y,'right');
              doc1.text(this.total_achats , 186 , y,'right' );
              doc1.text(this.total_stk, 203 , y,'right');*/

      doc1.line(9, 277, 205, 277);
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');
    }
  }
}
