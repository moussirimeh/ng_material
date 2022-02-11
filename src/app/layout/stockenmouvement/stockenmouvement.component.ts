import { Component, OnInit , ViewChild , HostListener } from '@angular/core';
import { FamilleService } from '../services/famille.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Famille } from '../services/famille';
import * as jspdf from 'jspdf';
import { GridComponent, SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { OverlayPanel } from 'primeng/primeng';
import { StockService } from '../services/stock.service';
import { ExcelService } from '../services/excel.service';
setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' ',
    },
  },
});
import {
  ExcelExportProperties,
  ToolbarService,
  ToolbarItems,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-stockenmouvement',
  templateUrl: './stockenmouvement.component.html',
  styleUrls: ['./stockenmouvement.component.scss'],
  providers: [ ExcelService, ToolbarService]
})
export class StockenmouvementComponent implements OnInit {


  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  wasInside: any;
  @ViewChild('op')
   public op: OverlayPanel;
   msg: String;
  datedeb = new Date();
  datedebut = new Date ();
  datefin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  readonly: boolean ;

  tn: any;
  selectedFamille: any;
  codeFamille = '';
  tri = 'article' ;
  listeFamille = new Array();
  listefournisseurs  = new Array() ;
  SelectedFournisseur: any;
  codefour = '';
  listeSFamille = new Array();
  selectedSFamille: any;

  disableGrid = false ;
  datas: any[];
  objStockMouvAll: {achats: string ;
    design: string ; code: string ; enstock: string ; prix: string ; valach: string ; valstk: string ; valvnt: string; ventes: string};
  ArrayStockMouvAll = new Array();
  listeStockAll = new Array();
  listeStock  = new Array();
  btnaff: boolean;
  total_ventes = '0.000';
  total_achats = '0.000';
  total_stk = '0.000';



  societe: string;
  totalventes: string;
  totalachats: string;
  totalstk: string;
  totalinv: string;

  constructor(
    private familleService: FamilleService ,
    private config: NgSelectConfig ,
    private stockService: StockService,
    private excelService: ExcelService,
    private fournisseurService: FournisseurService ,

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

  ngOnInit() {
    this.btnaff = false;
  this.SelectedFournisseur = null;
  this.selectedFamille = null ;
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
        'Samedi'
      ],
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ],
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
        'Decembre'
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
        'Dec'
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy'
    };
  }

  changeFamille() {
    if (this.selectedFamille !== null || this.selectedFamille !== undefined) {
      this.codeFamille = this.selectedFamille.code ;
       console.log('code fam', this.codeFamille);
       } else { this.codeFamille  = ''; }
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
    if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined) {
      this.codefour = this.SelectedFournisseur.code ;
      console.log('code four ' , this.codefour);

     } else { this.codefour = '' ; }
  }
  public onSearchfournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async chargerListeFamille() {
    if (this.listeFamille.length === 0) {
    await this.familleService.getFamillesList()
    .toPromise()
    .then(data => {
      console.log('famille liste  ', data);
     this.listeFamille =  data['_embedded'].familles;
    });
   }
  }
  public onSearchfamille(word: string, item: Famille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }



  async afficher(e) {
    this.wasInside = true;
    console.log(this.datedebut.toLocaleDateString('en-GB'),
    this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille );

await this.stockService.getListstock(this.datedebut.toLocaleDateString('en-GB'),
this.datefin.toLocaleDateString('en-GB') , this.codefour , this.codeFamille )
.toPromise()
.then((data) => {
 this.listeStock = data['_embedded'].stockMouvs;

console.log('liste  du stock ' , this.listeStock);
});




   this.readonly = false ;

    this.readonly = true ;
    this.btnaff = true;
    let totventes = 0;
    let totachats = 0;
    let totstocks = 0;

   for (const obj of this.listeStock) {
    const valvnt = Number(obj.valvnt);
     totventes = totventes  + valvnt ;
    this.total_ventes = totventes.toFixed(3);

    const valach = Number(obj.valach);
    totachats = totachats  + valach ;
    this.total_achats = totachats.toFixed(3);

    const valstk = Number(obj.valstk);
    totstocks = totstocks  + valstk ;
    this.total_stk = totstocks.toFixed(3);

    obj.prix = Number(obj.prix).toFixed(3);
    obj.enstock = Number(obj.enstock).toFixed(0);
    obj.achats = Number(obj.achats).toFixed(0);
    obj.ventes = Number(obj.ventes).toFixed(0);

    obj.valach = Number(obj.valach).toFixed(3);
    obj.valvnt = Number(obj.valvnt).toFixed(3);
    obj.valstk = Number(obj.valstk).toFixed(3);
    }
   switch (this.tri) {
    case 'achat': {
      this.listeStockAll = this.listeStockAll.sort(function(a, b) {
        return Number(a.valach) < Number(b.valach) ? 1 : Number(a.valach) > Number(b.valach) ? -1 : 0;
      });
      break;
    }
    case 'vente': {
      this.listeStockAll = this.listeStockAll.sort(function(a, b) {
        return Number(a.valvnt) < Number(b.valvnt) ? 1 : Number(a.valvnt) > Number(b.valvnt) ? -1 : 0;
      });
      break;
    }
    case 'stk': {
      this.listeStockAll = this.listeStockAll.sort(function(a, b) {
        return Number(a.valstk) < Number(b.valstk) ? 1 : Number(a.valstk) > Number(b.valstk) ? -1 : 0;
      });
      break;
    }
    default: {
      break;
    }
  }

  }

  nouvelleSaisie() {
  this.tri = 'article' ;
  this.listeStockAll = new Array();
  this.btnaff = false ;
  this.readonly = false ;
  this.SelectedFournisseur = null ;
  this.selectedFamille = null ;
  this.total_ventes = '0.000';
  this.total_achats = '0.000';
  this.total_stk = '0.000';
  this.totalventes = '';
  this.totalachats = '';
  this.totalstk = '';
  this.codeFamille = '';
  this.codefour = '';
  }
  Initialiser() {

  this.tri = 'article' ;
  this.SelectedFournisseur = null ;
  this.selectedFamille = null ;

  }

async gererExcelgrid(e) {

console.log(this.datedebut.toLocaleDateString('en-GB'),
this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille );
await this.stockService.getListstock(this.datedebut.toLocaleDateString('en-GB'),
this.datefin.toLocaleDateString('en-GB') , this.codefour , this.codeFamille )
.toPromise()
.then((data) => {
 this.listeStock = data['_embedded'].stockMouvs;

console.log('liste  du stock ' , this.listeStock);
});


 try {
  let nomFich;
     nomFich = 'ListeStockMouv';

  const exportExcel = this.listeStock.map(obj => {
    return {
      'Reference': obj.code,
      'Designation': obj.design,
      'P.U.HT': obj.prix,

      'Achats': obj.enstock,
      'En Stock': obj.achats,
       'ventes' : obj.ventes,

      'Val.Ach': obj.valach,
      'Val.Vnt': obj.valvnt,
      'Val.Stk': obj.valstk,
    };
  });
  this.excelService.exportAsExcelFile(
    exportExcel,
    nomFich + ' : ' + new Date().toLocaleDateString('en-GB')
  );
} catch {
console.log(' methode genererExcel');
}

}





  async Apercu(e) {
  await this.stockService.getListstock(this.datedebut.toLocaleDateString('en-GB'),
  this.datefin.toLocaleDateString('en-GB') , this.codefour , this.codeFamille )
 .toPromise()
 .then((data) => {
   this.listeStock = data['_embedded'].stockMouvs;

 console.log('liste  du stock ' , this.listeStock);
 });
 let totventes = 0;
 let totachats = 0;
 let totstocks = 0;

 for (const obj of this.listeStock) {
  const valvnt = Number(obj.valvnt);
   totventes = totventes  + valvnt ;
  this.total_ventes = totventes.toFixed(3);

  const valach = Number(obj.valach);
  totachats = totachats  + valach ;
  this.total_achats = totachats.toFixed(3);

  const valstk = Number(obj.valstk);
  totstocks = totstocks  + valstk ;
  this.total_stk = totstocks.toFixed(3);

  obj.prix = Number(obj.prix).toFixed(3);
  obj.enstock = Number(obj.enstock).toFixed(0);
  obj.achats = Number(obj.achats).toFixed(0);
  obj.ventes = Number(obj.ventes).toFixed(0);

  obj.valach = Number(obj.valach).toFixed(3);
  obj.valvnt = Number(obj.valvnt).toFixed(3);
  obj.valstk = Number(obj.valstk).toFixed(3);
  }


  let four = '' ;
  let fam = '';
  const doc1 = new jspdf();
  doc1.setFontSize(12);
  doc1.setFontStyle('Arial');
  this.societe = globals.societe;
   doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
   let temps = String(new Date().getUTCHours() + 1);
   temps = temps + ':' + String(new Date().getUTCMinutes());
   temps = temps + ':' + String(new Date().getUTCSeconds());
   console.log('datedu jour ', temps );
   const datedujour = new Date().toLocaleDateString('en-GB') ;
   doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
   doc1.setFontSize(15);
   doc1.setFontStyle('bold');
   doc1.setTextColor(9, 4, 161);
   if (this.SelectedFournisseur !== null  ) {
    four = this.SelectedFournisseur.deno ;
   }
   if (this.selectedFamille !== null) {
    fam = this.selectedFamille.nom ;
   }

   doc1.setFontStyle('bold');
   doc1.setFontSize(10);
   doc1.text('Fournisseur  :'  + four, 9, 23);
   doc1.text('Famille  :'  + fam, 9, 30);
   doc1.setFontStyle('bold');
   doc1.setFontSize(13);
   doc1.text('Stock en Mouvement(en Pris de V.HT)', 70, 35);
   doc1.setFontStyle('Arial');
   doc1.setFontSize(10);
   doc1.setTextColor(0, 0, 0);
   doc1.text('Période : du : ' + this.datedebut.toLocaleDateString('en-GB') + ' au :' + this.datefin.toLocaleDateString('en-GB'), 9, 42);
   // entete du  tableau
   doc1.setFontStyle('Arial');
   doc1.line(9, 45, 205, 45);
   doc1.line(9, 45, 9, 277);
   doc1.line(205, 45, 205, 277);
   doc1.setFontStyle('bold');
   doc1.setTextColor(0, 0, 0);
   doc1.text('Reference', 11, 50);
   doc1.text('Designation', 48, 50);
   doc1.text('P.U.HT', 120, 50, 'right');
   doc1.text('Achats', 133, 50, 'right');
   doc1.text('Ventes', 143, 50, 'right');
   doc1.text('EnStk', 154, 50, 'right');
   doc1.text('Val.Ach', 168, 50, 'right');
   doc1.text('Val.Vnt', 185, 50, 'right');
   doc1.text('Val.Stk', 202, 50, 'right');
   // creer la ligne
   doc1.setFontStyle('bold');
   doc1.line(9, 53, 205, 53);
   let y = 62;
   doc1.setFontStyle('Arial');
   let  numPage = 1;
     for (const obj of this.listeStock) {
       doc1.setFontSize(9);
       doc1.setFontStyle('Arial');
       doc1.text(obj.code, 10, y);
       doc1.text(obj.design, 48, y);
       doc1.text(Number(obj.prix).toFixed(3), 120, y, 'right');
       doc1.text(Number(obj.achats).toFixed(0), 130, y, 'right');
      doc1.text(Number(obj.ventes).toFixed(0), 140, y, 'right');
      doc1.text(Number(obj.enstock).toFixed(0), 150, y, 'right');

       doc1.text(Number(obj.valach).toFixed(3), 165, y, 'right');
       doc1.text(Number(obj.valvnt).toFixed(3), 185, y, 'right');
       doc1.text(Number(obj.valstk).toFixed(3), 204, y, 'right');
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
         doc1.text('Reference ', 11, 17);
         doc1.text('Designation ', 48, 17);
         doc1.text('P.U.HT ', 120, 17, 'right');
         doc1.text('Achats ', 133, 17, 'right');
         doc1.text('Ventes', 143, 17, 'right');
         doc1.text('EnStk ', 154, 17, 'right');
         doc1.text('Val.Ach ', 168, 17, 'right');
         doc1.text('Val.Vnt ', 185, 17, 'right');
         doc1.text('Val.Stk', 202, 17, 'right');
         // creer la ligne
         doc1.setFontStyle('bold');
         doc1.line(9, 20, 205, 20);
         y = 24;
       }

     }
     doc1.setFontStyle('bold');
     doc1.setFontSize(14);
     doc1.text('Totaux ' , 9 , y);

     doc1.setFontStyle('bold');
     doc1.setFontSize(11);
     doc1.text(this.total_achats , 158 , y);
     doc1.text(this.total_ventes , 174 , y + 3);
     doc1.text(this.total_stk, 185 , y);

     doc1.line(9, 277, 205, 277);
     doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
     window.open(doc1.output('bloburl'), '_blank');
}
// }

}


