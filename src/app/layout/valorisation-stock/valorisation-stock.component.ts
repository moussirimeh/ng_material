import { Component, OnInit, ViewChild } from '@angular/core';
import { FamilleService } from '../services/famille.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { SfamilleService } from '../services/sfamille.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Famille } from '../services/famille';
import { Sfamille } from '../services/sfamille';
import { ExcelExportProperties, GridComponent, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { StockService } from '../services/stock.service';
import { ExcelService } from '../services/excel.service';
import * as jspdf from 'jspdf';
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
  selector: 'app-valorisation-stock',
  templateUrl: './valorisation-stock.component.html',
  styleUrls: ['./valorisation-stock.component.scss'] ,
  providers: [ExcelService],
})
export class ValorisationStockComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  datefin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  readonly: boolean ;
  tn: any;
  selectedFamille: any;
  codeFamille: string;
  tri = 'four' ;
  listeFamille = new Array();
  listefournisseurs  = new Array() ;
  SelectedFournisseur: any;
  labeltri = 'Fournisseurs' ;
  codefour: any;
  listeSFamille = new Array();
  selectedSFamille: any;
  codeSFamille: string;
  disableGrid = false ;
  datas: any[];
  ArrayValorisationAll: {codefr: string ; raisonS: string ; initial: string ; achats: string ; ventes: string ; stock: string };
  ArrayValorisation: {reference: string ; designation: string ; puht: string ; achats: string ; ventes: string ; stock: string ;
     valach: string ; valvnt: string ; valstk: string ;  };
  listeValorisationAll = new Array();
  btnaff = false ;
  total_ventes = 0;
  total_achats = 0;
  total_stk = 0;
  total_ES = 0;
  total_RE = 0;
  total_inv = 0;
  total = new Array();
  public toolbarOptions: ToolbarItems[];
  societe: string;
  totalventes: string;
  totalachats: string;
  totalstk: string;
  totalinv: string;
  all: boolean;
  listeall: boolean;
  constructor(
    private familleService: FamilleService ,
    private config: NgSelectConfig ,
    private sfamilleService: SfamilleService ,
    private fournisseurService: FournisseurService ,
    private stockService: StockService ,
    private excelService: ExcelService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  ngOnInit() {
    this.SelectedFournisseur = '';
    this.selectedFamille = '' ;
    this.selectedSFamille = '' ;
    this.toolbarOptions = ['ExcelExport'];
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
    if (this.selectedFamille !== null && this.selectedFamille !== undefined) {
      this.labeltri = 'article' ;
      this.codeFamille = this.selectedFamille ;
       console.log('code fam', this.codeFamille);
       } else {
          this.codeFamille  = '';
          this.labeltri = 'Fournisseurs' ; }
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
      this.labeltri = 'article' ;
      this.codefour = this.SelectedFournisseur ;
      console.log('code four ' , this.codefour);

     } else {
       this.codefour = '' ;
       this.labeltri = 'Fournisseurs' ; }
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
  chargerListeSfamille() {
    if (this.listeSFamille.length === 0) {
    this.sfamilleService.getSousFamillesByOrderByNom()
    .toPromise()
    .then((data) => {
        this.listeSFamille = data['_embedded'].sfamilles;
        console.log('sous famille liste  ', data);
    });

   }
  }
  changeSFamille() {
    if (this.selectedSFamille !== null && this.selectedSFamille !== undefined) {
      this.labeltri = 'article' ;
      this.codeSFamille = this.selectedSFamille;
       console.log('code Sfam', this.codeSFamille );
       } else {
       this.codeSFamille  = '';
       this.labeltri = 'Fournisseurs' ; }
  }
  public onSearchSfamille(word: string, item: Sfamille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  trier() {
    switch (this.tri) {
      case 'achat': {
        this.listeValorisationAll = this.listeValorisationAll.sort(function(a, b) {
          return Number(a.achats) < Number(b.achats) ? 1 : Number(a.achats) > Number(b.achats) ? -1 : 0;
        });
        break;
      }
      case 'vente': {
        this.listeValorisationAll = this.listeValorisationAll.sort(function(a, b) {
          return Number(a.ventes) < Number(b.ventes) ? 1 : Number(a.ventes) > Number(b.ventes) ? -1 : 0;
        });
        break;
      }
      case 'stk': {
        this.listeValorisationAll = this.listeValorisationAll.sort(function(a, b) {
          return Number(a.stock) < Number(b.stock) ? 1 : Number(a.stock) > Number(b.stock) ? -1 : 0;
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  async afficher() {
    this.listeValorisationAll = new Array();
    console.log('tri par ', this.tri);
    console.log('test ', ( (this.SelectedFournisseur !== null
      && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '')  ||
    (this.selectedFamille !== null && this.selectedFamille !== undefined && this.selectedFamille !== '') ||
    (this.selectedSFamille !== null && this.selectedSFamille !== undefined && this.selectedSFamille !== '') ));
    if ( (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '')  ||
     (this.selectedFamille !== null && this.selectedFamille !== undefined && this.selectedFamille !== '') ||
     (this.selectedSFamille !== null && this.selectedSFamille !== undefined && this.selectedSFamille !== '') ) {
    console.log(this.datedebut.toLocaleDateString('en-GB'),
      this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille);
      this.all = false ;
      await this.stockService.getlistValorisationStock(this.datedebut.toLocaleDateString('en-GB'),
       this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille)
      .toPromise()
      .then((data) => {
        this.datas = data ;
        console.log('liste valorisation du stock****** ' , this.datas);
      });


      for (let i = 0 ; i < this.datas.length ; i++) {
        this.ArrayValorisation = {reference: '' , designation: '' , puht: '' , achats: '' , ventes: '' , stock: ''
           , valach : '' , valvnt : '' , valstk : ''   };
        const obj = this.datas[i];
        this.ArrayValorisation.reference = obj[0];
        this.ArrayValorisation.designation = obj[1];
        this.ArrayValorisation.puht = Number(obj[2]).toFixed(3);
        this.ArrayValorisation.achats = Number(obj[3]).toFixed(3);
        this.ArrayValorisation.ventes = Number(obj[4]).toFixed(3);
        this.ArrayValorisation.stock = Number(obj[5]).toFixed(3);
        this.ArrayValorisation.valach = Number(obj[6]).toFixed(3);
        this.ArrayValorisation.valvnt = Number(obj[7]).toFixed(3);
        this.ArrayValorisation.valstk = Number(obj[8]).toFixed(3);
        this.listeValorisationAll.push(this.ArrayValorisation);
       }
    } else {
      this.all = true ;

    await this.stockService.getlistValorisationStockAll(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
    .toPromise()
    .then((data) => {
      this.datas = data ;
      console.log('liste valorisation du stock All ' , this.datas);

    });
    for (let i = 0 ; i < this.datas.length ; i++) {
      this.ArrayValorisationAll = {codefr : '' , raisonS: '' , initial: '' , achats: '' , ventes: '' , stock: '' };
      const obj = this.datas[i];
      this.ArrayValorisationAll.codefr = obj[0];
      this.ArrayValorisationAll.raisonS = obj[1];
      this.ArrayValorisationAll.initial = Number(obj[2]).toFixed(3);
      this.ArrayValorisationAll.achats = Number(obj[3]).toFixed(3);
      this.ArrayValorisationAll.ventes = Number(obj[4]).toFixed(3);
      this.ArrayValorisationAll.stock = Number(obj[5]).toFixed(3);
      this.listeValorisationAll.push(this.ArrayValorisationAll);
     }
   }
    // console.log('listevalorisationAll', this.listeValorisationAll);
    this.trier() ;
    this.Total() ;
    // this.grid.refresh();
    this.readonly = true ;
    this.btnaff = true ;
  }

  async Total() {
    this.total_ventes = 0;
    this.total_achats = 0;
    this.total_stk = 0;
    this.total_ES = 0;
    this.total_RE = 0;
    this.total_inv = 0;
    if ( (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '')  ||
     (this.selectedFamille !== null && this.selectedFamille !== undefined && this.selectedFamille !== '') ||
     (this.selectedSFamille !== null && this.selectedSFamille !== undefined && this.selectedSFamille !== '') ) {
       console.log(this.datedebut.toLocaleDateString('en-GB'),
       this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille);

    await this.stockService.getTotvalorisationStock(this.datedebut.toLocaleDateString('en-GB'),
    this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille)
   .toPromise()
   .then((data) => {
     this.total = data ;
     console.log('liste total ' , this.total);
   });
   for (let i = 0 ; i < this.total.length ; i++) {
    const obj = this.total[i] ;
    this.total_ventes = this.total_ventes + Number(obj[4]);
    this.total_achats = this.total_achats +  Number(obj[3]);
    this.total_stk = this.total_stk + Number(obj[5]) ;
    this.total_inv = this.total_inv + Number(obj[8]);
    this.total_RE = this.total_RE + Number(obj[7]) ;
    this.total_ES = this.total_ES + Number(obj[6]) ;
    }
    } else {
      await this.stockService.getTotvalorisationStockAll(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
     .toPromise()
     .then((data) => {
       this.total = data ;
       console.log('liste total all' , this.total);
     });
     for (let i = 0 ; i < this.total.length ; i++) {
      const obj = this.total[i] ;
      this.total_ventes = this.total_ventes + Number(obj[2]);
      this.total_achats = this.total_achats +  Number(obj[1]);
      this.total_stk = this.total_stk + Number(obj[3]) ;
      this.total_inv = this.total_inv + Number(obj[0]);
      }
    }
    console.log(' total ventes  ' , this.total_ventes , ' total achat ' , this.total_achats , ' total stk ' ,
     this.total_stk  , ' total inv ', this.total_inv );

    this.totalventes = this.total_ventes.toFixed(3);
    this.totalachats = this.total_achats .toFixed(3);
    this.totalstk = this.total_stk .toFixed(3) ;
    this.totalinv = this.total_inv .toFixed(3);
  }

  nouvelleSaisie() {
  this.tri = 'four' ;
  this.labeltri = 'Fournisseurs' ;
  this.listeValorisationAll = new Array();
  this.btnaff = false ;
  this.readonly = false ;
  this.SelectedFournisseur = '' ;
  this.selectedFamille = '' ;
  this.selectedSFamille = '' ;

  this.totalventes = '';
  this.totalachats = '';
  this.totalstk = '';
  this.totalinv = '';
  }
  Initialiser() {
  this.datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  this.datefin = new Date ();
  this.tri = 'four' ;
  this.labeltri = 'Fournisseurs' ;
  this.SelectedFournisseur = '' ;
  this.selectedFamille = '' ;
  this.selectedSFamille = '' ;
  }


async excelExport() {
  if (this.btnaff === false) {
    this.listeValorisationAll = new Array();
  }
  if (this.listeValorisationAll.length === 0) {
    if ( (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '')  ||
    (this.selectedFamille !== null && this.selectedFamille !== undefined && this.selectedFamille !== '') ||
    (this.selectedSFamille !== null && this.selectedSFamille !== undefined && this.selectedSFamille !== '') ) {
   console.log(this.datedebut.toLocaleDateString('en-GB'),
     this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille);

     await this.stockService.getlistValorisationStock(this.datedebut.toLocaleDateString('en-GB'),
      this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille)
     .toPromise()
     .then((data) => {
       this.datas = data ;
       console.log('liste valorisation du stock ' , this.datas);
     });
     for (let i = 0 ; i < this.datas.length ; i++) {
      this.ArrayValorisation = {reference: '' , designation: '' , puht: '' , achats: '' , ventes: '' , stock: ''
         , valach : '' , valvnt : '' , valstk : ''   };
      const obj = this.datas[i];
      this.ArrayValorisation.reference = obj[0];
      this.ArrayValorisation.designation = obj[1];
      this.ArrayValorisation.puht = Number(obj[2]).toFixed(3);
      this.ArrayValorisation.achats = Number(obj[3]).toFixed(3);
      this.ArrayValorisation.ventes = Number(obj[4]).toFixed(3);
      this.ArrayValorisation.stock = Number(obj[5]).toFixed(3);
      this.ArrayValorisation.valach = Number(obj[6]).toFixed(3);
      this.ArrayValorisation.valvnt = Number(obj[7]).toFixed(3);
      this.ArrayValorisation.valstk = Number(obj[8]).toFixed(3);
      this.listeValorisationAll.push(this.ArrayValorisation);
    }
     this.all = false  ;
   } else {

   await this.stockService.getlistValorisationStockAll(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
   .toPromise()
   .then((data) => {
     this.datas = data ;
     console.log('liste valorisation du stock All ' , this.datas);

   });
   for (let i = 0 ; i < this.datas.length ; i++) {
    this.ArrayValorisationAll = {codefr : '' , raisonS: '' , initial: '' , achats: '' , ventes: '' , stock: '' };
    const obj = this.datas[i];
    this.ArrayValorisationAll.codefr = obj[0];
    this.ArrayValorisationAll.raisonS = obj[1];
    this.ArrayValorisationAll.initial = Number(obj[2]).toFixed(3);
    this.ArrayValorisationAll.achats = Number(obj[3]).toFixed(3);
    this.ArrayValorisationAll.ventes = Number(obj[4]).toFixed(3);
    this.ArrayValorisationAll.stock = Number(obj[5]).toFixed(3);
    this.listeValorisationAll.push(this.ArrayValorisationAll);
   }
   this.all = true  ;
   }
   this.trier() ;

  }
    if ( this.all) {
      try {
        let nomFich;
           nomFich = 'ListeValorisationDuStock';
        const exportExcel = this.listeValorisationAll.map(obj => {
          return {
            'codefr': obj.codefr,
            'raisonS': obj.raisonS,
            'initial': obj.initial,
            'achats': Number(obj.achats),
            'ventes': Number(obj.ventes),
            'stock': Number(obj.stock),
          };
        });
        this.excelService.exportAsExcelFile(
          exportExcel,
          nomFich + ' : ' + new Date().toLocaleDateString('en-GB')
        );
    } catch {
      console.log(' methode genererExcel');
    }
     } else {
      try {
        let nomFich;
           nomFich = 'ListeValorisationDuStock';
           const exportExcel = this.listeValorisationAll.map(obj => {
            return {
              'Reference': obj.reference,
              'Designation': obj.designation,
              'P.U.HT': Number(obj.puht),
              'Achats': Number(obj.achats),
              'Ventes': Number(obj.ventes),
              'En Stock': Number(obj.stock),
              'ValACH' : Number(obj.valach),
              'ValVNT': Number(obj.valvnt),
              'ValSTK': Number(obj.valstk),
            };
          });
        this.excelService.exportAsExcelFile(exportExcel,
          nomFich + ' : ' + new Date().toLocaleDateString('en-GB')
        );
        } catch {
          console.log(' methode genererExcel');
        }
      }



}

async Apercu() {
  this.Total() ;
  if (this.btnaff === false) {
    this.listeValorisationAll = new Array();
  }
  if (this.listeValorisationAll.length === 0) {
    if ( (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '')  ||
    (this.selectedFamille !== null && this.selectedFamille !== undefined && this.selectedFamille !== '') ||
    (this.selectedSFamille !== null && this.selectedSFamille !== undefined && this.selectedSFamille !== '') ) {
   console.log(this.datedebut.toLocaleDateString('en-GB'),
     this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille);

     await this.stockService.getlistValorisationStock(this.datedebut.toLocaleDateString('en-GB'),
      this.datefin.toLocaleDateString('en-GB') , this.SelectedFournisseur , this.selectedFamille , this.selectedSFamille)
     .toPromise()
     .then((data) => {
       this.datas = data ;
       console.log('liste valorisation du stock ' , this.datas);
     });
     for (let i = 0 ; i < this.datas.length ; i++) {
      this.ArrayValorisation = {reference: '' , designation: '' , puht: '' , achats: '' , ventes: '' , stock: ''
         , valach : '' , valvnt : '' , valstk : ''   };
      const obj = this.datas[i];
      this.ArrayValorisation.reference = obj[0];
      this.ArrayValorisation.designation = obj[1];
      this.ArrayValorisation.puht = Number(obj[2]).toFixed(3);
      this.ArrayValorisation.achats = Number(obj[3]).toFixed(3);
      this.ArrayValorisation.ventes = Number(obj[4]).toFixed(3);
      this.ArrayValorisation.stock = Number(obj[5]).toFixed(3);
      this.ArrayValorisation.valach = Number(obj[6]).toFixed(3);
      this.ArrayValorisation.valvnt = Number(obj[7]).toFixed(3);
      this.ArrayValorisation.valstk = Number(obj[8]).toFixed(3);
      this.listeValorisationAll.push(this.ArrayValorisation);
    }
     this.all = false  ;
   } else {

   await this.stockService.getlistValorisationStockAll(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
   .toPromise()
   .then((data) => {
     this.datas = data ;
     console.log('liste valorisation du stock All ' , this.datas);

   });
   for (let i = 0 ; i < this.datas.length ; i++) {
    this.ArrayValorisationAll = {codefr : '' , raisonS: '' , initial: '' , achats: '' , ventes: '' , stock: '' };
    const obj = this.datas[i];
    this.ArrayValorisationAll.codefr = obj[0];
    this.ArrayValorisationAll.raisonS = obj[1];
    this.ArrayValorisationAll.initial = Number(obj[2]).toFixed(3);
    this.ArrayValorisationAll.achats = Number(obj[3]).toFixed(3);
    this.ArrayValorisationAll.ventes = Number(obj[4]).toFixed(3);
    this.ArrayValorisationAll.stock = Number(obj[5]).toFixed(3);
    this.listeValorisationAll.push(this.ArrayValorisationAll);
   }
   this.all = true  ;
   }
   this.trier() ;

  }
  if (this.all) {
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
     doc1.text('Valorisation du Stock(en Pris de V.HT)', 50, 20);
     doc1.setFontStyle('Arial');
     doc1.setFontSize(12);
     doc1.setTextColor(0, 0, 0);
     doc1.text('Période : du : ' + this.datedebut.toLocaleDateString('en-GB') + ' au :' + this.datefin.toLocaleDateString('en-GB'), 9, 40);
     // entete du  tableau
     doc1.setFontStyle('Arial');
     doc1.line(9, 45, 205, 45);
     doc1.line(9, 45, 9, 277);
     doc1.line(205, 45, 205, 277);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
      doc1.text('CodeFr', 11, 50);
      doc1.text('Raison Sociale', 30, 50);
      doc1.text('Val_INVENT', 120, 50, 'right');
      doc1.text('VAL_Entrees', 150, 50, 'right');
      doc1.text('Val_Sorties', 175, 50, 'right');
      doc1.text('Val_Stock', 200, 50, 'right');
     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 53, 205, 53);
     let y = 62;
     doc1.setFontStyle('Arial');
     let  numPage = 1;
       for (const obj of this.listeValorisationAll) {
         doc1.setFontSize(8);
         doc1.setFontStyle('Arial');
        doc1.text(obj.codefr, 11, y);
        doc1.text(obj.raisonS, 30, y);
        doc1.text(Number(obj.initial).toFixed(3), 120, y, 'right');
        doc1.text(Number(obj.achats).toFixed(3), 150, y, 'right');
        doc1.text(Number(obj.ventes).toFixed(3), 175, y, 'right');
        doc1.text(Number(obj.stock).toFixed(3), 200, y, 'right');
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
           doc1.setFontSize(12);
           doc1.setFontStyle('bold');
           doc1.setTextColor(0, 0, 0);
            doc1.text('CodeFr ', 11, 17);
            doc1.text('Raison Sociale ', 30, 17);
            doc1.text('Val_INVENT ', 120, 17, 'right');
            doc1.text('VAL_Entrees ', 150, 17, 'right');
            doc1.text('Val_Sorties ', 175, 17, 'right');
            doc1.text('Val_Stock ', 200, 17, 'right');
           // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(9, 20, 205, 20);
           y = 24;
         }

       }
       doc1.line(9, 277, 205, 277);
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       window.open(doc1.output('bloburl'), '_blank');
  } else {
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
     doc1.text('Valorisation du Stock(en Pris de V.HT)', 50, 20);
     doc1.setFontStyle('Arial');
     doc1.setFontSize(12);
     doc1.setTextColor(0, 0, 0);
      if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined && this.SelectedFournisseur !== '' ) {
        doc1.text('Fournisseur : ' + this.SelectedFournisseur, 9, 25);
      }
      if (this.selectedFamille !== null && this.selectedFamille !== undefined && this.selectedFamille !== '' ) {
      doc1.text('Famille : ' + this.selectedFamille, 9, 30);
      }
      if (this.selectedSFamille !== null && this.selectedSFamille !== undefined && this.selectedSFamille !== '' ) {
      doc1.text('Sfamille : ' + this.selectedSFamille, 9, 35);
      }
     doc1.text('Période : du : ' + this.datedebut.toLocaleDateString('en-GB') + ' au :' + this.datefin.toLocaleDateString('en-GB'), 9, 40);
     // entete du  tableau
     doc1.setFontStyle('Arial');
     doc1.line(9, 45, 205, 45);
     doc1.line(9, 45, 9, 277);
     doc1.line(205, 45, 205, 277);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
      doc1.text('Reference', 11, 50);
      doc1.text('Designation', 30, 50);
      doc1.text('P.U.HT', 80, 50);
      doc1.text('Achats', 109, 50, 'right');
      doc1.text('Ventes', 124, 50, 'right');
      doc1.text('En Stock', 144, 50, 'right');
      doc1.text('ValACH', 164, 50, 'right');
      doc1.text('ValVNT', 184, 50, 'right');
      doc1.text('ValSTK', 204, 50, 'right');
     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 53, 205, 53);
     let y = 62;
     doc1.setFontStyle('Arial');
     let  numPage = 1;
       for (const obj of this.listeValorisationAll) {
         doc1.setFontSize(8);
         doc1.setFontStyle('Arial');
        doc1.text(obj.reference, 11, y);
        doc1.text(obj.designation, 30, y);
        doc1.text(Number(obj.puht).toFixed(3), 80, y);
        doc1.text(Number(obj.achats).toFixed(3), 109, y, 'right');
        doc1.text(Number(obj.ventes).toFixed(3), 124, y, 'right');
        doc1.text(Number(obj.stock).toFixed(3), 144, y, 'right');
        doc1.text(Number(obj.valach).toFixed(3), 164, y, 'right');
        doc1.text(Number(obj.valvnt).toFixed(3), 184, y, 'right');
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
           doc1.setFontSize(12);
           doc1.setFontStyle('bold');
           doc1.setTextColor(0, 0, 0);
            doc1.text('Reference', 11, 17);
            doc1.text('Designation', 30, 17);
            doc1.text('P.U.HT', 80, 17);
            doc1.text('Achats', 109, 17, 'right');
            doc1.text('Ventes', 124, 17, 'right');
            doc1.text('En Stock', 144, 17, 'right');
            doc1.text('ValACH', 164, 17, 'right');
            doc1.text('ValVNT', 184, 17, 'right');
            doc1.text('ValSTK', 204, 17, 'right');
           // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(9, 20, 205, 20);
           y = 24;
         }
       }
       doc1.setFontStyle('bold');
       doc1.text('Total :      ' + this.totalachats + '    ' + this.totalventes + '     ' + this.totalstk, 100, y) ;
       doc1.line(9, 277, 205, 277);
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       window.open(doc1.output('bloburl'), '_blank');

  }

}

}
