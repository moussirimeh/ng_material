import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Fournisseur } from '../services/fournisseur';
import { FournisseurService } from '../services/fournisseur.service';
import { StockService } from '../services/stock.service';
import { Stock } from '../services/stock';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { MouveService } from '../services/mouve.service';
import * as jspdf from 'jspdf';
import { SteService } from '../services/ste.service';
import { Ste } from '../services/ste';
import { OverlayPanel } from 'primeng/primeng';
import { ExcelService } from '../services/excel.service';

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
  selector: 'app-rapport-des-achats',
  templateUrl: './rapport-des-achats.component.html',
  styleUrls: ['./rapport-des-achats.component.scss'],
  providers: [ExcelService]
})
export class RapportDesAchatsComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;
  readonlynom = true;
  readonly = true;
  tn: any;
  from = new Date();
  to = new Date();
  maxDate: Date;
  minDate: Date;
  minDate1: Date;
  Selectedachat: any;
  fournisseurs: any;
  articles: any ;
  ngselectDisabled = true;
  afficherClicked = false ;
  ste: Ste;
  societe: any;
  SelectedArticle: Stock = {
    id: '',
  code: '',
  design: '',
  quantite: '',
  tva: '',
  prix: '',
  achat: '',
  marge: '',
  operateur: '',
  achatD: '',
  famille: '',
  achatP: '',
  devise: '',
  sfamille: '',
  taxe: '',
  origine: '',
  equiv: '',
  imp: '',
  min: '',
  max: '',
  commQuant: '',
  dPachat: '',
  pInv: '',
  qInv: '',
  agenda: '',
  qtEnt: '',
  emplacement: '',
  nbrC: '',
  nbrCl: '',
  nbrBl: '',
  qtTotal: '',
  ca: '',
  profilCa: '',
  profilTyp: '',
  qteTotal1: '',
  qtTotal1: '',
  };
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
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  wasInside: boolean;
  achats: any;
  lenght = 0;
  codeFour = '';
  codeArticle = '';
  totalHt = 0;
  year = this.from.getFullYear();
  month = this.from.getMonth();
  day = this.from.getDay();
  denoFournisseur = 'Tout';
  denoArticle = 'Tout ' ;
  public searchOptions: SearchSettingsModel;
  public customAttributes: Object;
  achatsTraitement: any ;
  tab_achat: any ;
  hidden: boolean;
  dateDisabled = false;
  valideShow = false;
  constructor( private fournisseurService: FournisseurService,
              private stockService: StockService,
              private mouveService: MouveService,
              private steService: SteService,
              private excelService: ExcelService,
              private config: NgSelectConfig) {
     this.config.notFoundText = 'Aucun élément trouvé';
     this.config.clearAllText = 'Supprimer tous';
    // this.minDate = this.from;
    // this.maxDate = new Date();
    const dat = new Date();
    this.from = new Date(dat.getFullYear(), 0, 1);
     this.to = new Date();

  }
  init() {
    const dat = new Date();
    this.from = new Date(dat.getFullYear(), 0, 1);
    this.to = new Date();
    this.SelectedFournisseur = null;
    this.SelectedArticle = null;
  }


  dayDiff(d1, d2) {

    d1 = d1.getTime() / 86400000;
    d2 = d2.getTime() / 86400000;
    const d3 = d2 - d1 + 1 ;
    return new Number(d3).toFixed(0);
  }
  ngOnInit() {
     this.hidden = false;
    // style de ejs grid
    this.customAttributes = { class: 'customcss' };
    // initailisation
    this.SelectedFournisseur = null;
    this.SelectedArticle = null;
    /// charger les fournisseurs
     this.fournisseurService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then(data => {
        this.fournisseurs = data['_embedded'].fournisseurs;
      });
      // charger les articles
    this.stockService.getStockList('').toPromise().then(
      (data) => {

        this.articles = data['_embedded'].stocks;

      }
    );
    // traduire calendrier en francais
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
  // hostListener
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside ) {
       this.ovo.hide();
    }
    this.wasInside = false;
  }
  // methode rechercher les fournisseurs en front end
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  // methode rechercher les articles
  public onSearchArtParCode(word: string): Stock[] {

    this.stockService.getStockList(word).toPromise()
       .then(data => {
         console.log(data);

         this.articles  = data['_embedded'].stocks;


       });
       return (this.articles);
   }

   async excel(e) {

    // affecter deno et code article
    if (this.SelectedArticle !== null) {
      this.codeArticle = this.SelectedArticle.code ;
      this.denoArticle = this.SelectedArticle.design;
    }
    // affecter deno et code fournisseur
    if (this.SelectedFournisseur !== null) {
      this.codeFour = this.SelectedFournisseur.code;
      this.denoFournisseur = this.SelectedFournisseur.deno;
    }
    // les méthodes afficher pour les 4 cas
    if ( (this.SelectedArticle === null ) &&
    (this.SelectedFournisseur === null  ) ) {
      console.log('cas4');
      await this.mouveService.getRapportAchat4(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB')).toPromise().then(
        (data) => {
          console.log(data);
          this.achats = data['_embedded'].rapportAchats;
          this.achatsTraitement =  data['_embedded'].rapportAchats;
          this.lenght = this.achats.length ;
          console.log(this.achats);

        }
      );
     } else  if ( (this.SelectedArticle !== null ) &&
    (this.SelectedFournisseur !== null ) ) {
      await this.mouveService.getRapportAchat3(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeArticle, this.codeFour).toPromise().then(
       (data) => {
         console.log(data);
         this.achats = data['_embedded'].rapportAchats;
         this.lenght = this.achats.length ;
         this.achatsTraitement =  data['_embedded'].rapportAchats;
       }
     );
      console.log('cas3');
     } else  if ( (this.SelectedArticle === null ) &&
    (this.SelectedFournisseur !== null  ) ) {
      await this.mouveService.getRapportAchat2(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeFour).toPromise().then(
       (data) => {
         console.log(data);
         this.achats = data['_embedded'].rapportAchats;
         this.achatsTraitement =  data['_embedded'].rapportAchats;
         this.lenght = this.achats.length ;
       }
     );
      console.log('cas2');
     } else   if ( (this.SelectedArticle !== null ) &&
     (this.SelectedFournisseur === null ) ) {
      await this.mouveService.getRapportAchat1(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeArticle).toPromise().then(
       (data) => {
         this.achats = data['_embedded'].rapportAchats;
         this.achatsTraitement =  data['_embedded'].rapportAchats;


       }
     );
     this.lenght = this.achats.length ;
       console.log('cas1');
      }


// test affichage grid
      if (this.lenght === 0 ) {

        this.valideShow = false;
        this.ngselectDisabled = true ;
        this.dateDisabled = false;
        this.achats = null;
        this.achatsTraitement = null;
        this.denoArticle = 'Tout ';
        this.denoFournisseur = 'Tout';
        this.ms = 'Aucun entrée trouvée !';
         this.ovo.show(e, document.getElementById('excel'));
         this.hidden = false;
      } else {


        if (this.valideShow ) {
          this.valideShow = true;
          this.ngselectDisabled = false ;
          this.dateDisabled = true;
          this.hidden = true;
        } else {
          this.valideShow = false;
          this.ngselectDisabled = true ;
          this.dateDisabled = false;
          this.hidden = false;
        }


            try {
              if (this.achats === undefined) {
              } else {
                const exportExcel = this.achats.map(obj => {
                  return {
                    'Référence': obj.codeMouve,
                    'Désignation': obj.designSt,
                    'Date': obj.dateMouve,
                    'Qte': obj.quantiteMouve,
                    'PU.HT': obj.prixMouve,
                    'Pièce Comm': obj.piece,
                    'Tiers': obj.denoFour
                  };
                });
                this.excelService.exportAsExcelFile(
                  exportExcel,
                  ' rapport entrées : ' + new Date().toLocaleDateString('en-GB')

                );
              }
            } catch {
              console.log(' methode genererExcel');
            }
          }
}



   async imprimer(e) {

      // affecter deno et code article
      if (this.SelectedArticle !== null) {
        this.codeArticle = this.SelectedArticle.code ;
        this.denoArticle = this.SelectedArticle.design;
      } else {
        this.codeArticle = '';
      }
      // affecter deno et code fournisseur
      if (this.SelectedFournisseur !== null) {
        this.codeFour = this.SelectedFournisseur.code;
        this.denoFournisseur = this.SelectedFournisseur.deno;
      } else {
        this.codeFour = '';
      }
      // les méthodes afficher pour les 4 cas
      if ( (this.SelectedArticle === null ) &&
      (this.SelectedFournisseur === null  ) ) {
        console.log('cas4');
        await this.mouveService.getRapportAchat4(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB')).toPromise().then(
          (data) => {
            console.log(data);
            this.achats = data['_embedded'].rapportAchats;
            this.achatsTraitement =  data['_embedded'].rapportAchats;
            this.lenght = this.achats.length ;
            console.log(this.achats);

          }
        );
       } else  if ( (this.SelectedArticle !== null ) &&
      (this.SelectedFournisseur !== null ) ) {
        await this.mouveService.getRapportAchat3(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
        this.codeArticle, this.codeFour).toPromise().then(
         (data) => {
           console.log(data);
           this.achats = data['_embedded'].rapportAchats;
           this.lenght = this.achats.length ;
           this.achatsTraitement =  data['_embedded'].rapportAchats;
         }
       );
        console.log('cas3');
       } else  if ( (this.SelectedArticle === null ) &&
      (this.SelectedFournisseur !== null  ) ) {
        await this.mouveService.getRapportAchat2(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
        this.codeFour).toPromise().then(
         (data) => {
           console.log(data);
           this.achats = data['_embedded'].rapportAchats;
           this.achatsTraitement =  data['_embedded'].rapportAchats;
           this.lenght = this.achats.length ;
         }
       );
        console.log('cas2');
       } else   if ( (this.SelectedArticle !== null ) &&
       (this.SelectedFournisseur === null ) ) {
        await this.mouveService.getRapportAchat1(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
        this.codeArticle).toPromise().then(
         (data) => {
           this.achats = data['_embedded'].rapportAchats;
           this.achatsTraitement =  data['_embedded'].rapportAchats;


         }
       );
       this.lenght = this.achats.length ;
         console.log('cas1');
        }


  // test affichage grid
        if (this.lenght === 0 ) {

          this.valideShow = false;
          this.ngselectDisabled = true ;
          this.dateDisabled = false;
          this.achats = null;
          this.achatsTraitement = null;
          this.denoArticle = 'Tout ';
          this.denoFournisseur = 'Tout';
          this.ms = 'Aucun entrée trouvée !';
           this.ovo.show(e, document.getElementById('apperc'));
           this.hidden = false;
        } else {
          if (this.valideShow ) {
            this.valideShow = true;
            this.ngselectDisabled = false ;
            this.dateDisabled = true;
            this.hidden = true;
          } else {
            this.valideShow = false;
            this.ngselectDisabled = true ;
            this.dateDisabled = false;
            this.hidden = false;
          }




       /// créer doc jspdf
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
      doc1.text('SOCIETE.:  ' + this.societe.societe, 9, 15);

      doc1.setFontSize(22);
      doc1.setFontStyle('bold');
      doc1.setFontStyle('Arial');
      doc1.text('RAPPORT DES ENTREES AU STOCK', 52, 30);
      doc1.setFontSize(14);
      doc1.setFontStyle('bold');
      doc1.setFontStyle('Arial');
      doc1.text('Du : ' + this.from.toLocaleDateString('en-GB') , 9, 37) ;
      doc1.text('Au : ' + this.to.toLocaleDateString('en-GB') , 50, 37) ;
      doc1.text('Fournisseur : ' + this.denoFournisseur , 9, 44) ;
      doc1.text('Article : ' + this.denoArticle , 9, 52) ;

      /// entete tableau
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      doc1.line(9, 60, 205, 60);
      doc1.text('Référence', 10, 65);
        doc1.text('Désignation', 42, 65);
        doc1.text('Date', 97, 65);
        doc1.text('Qte', 113, 65);
        doc1.text('PU. HT', 124, 65);
        doc1.text('Pièce Com.', 138, 65);
        doc1.text('Tiers', 162, 65);
        doc1.line(9, 70, 205, 70);

        //// cors du tableau
        let y = 75;
        let numPage = 1;
        if ( this.achatsTraitement === null || this.achatsTraitement === undefined) {
        } else {
          for (this.tab_achat of this.achatsTraitement) {

            this.totalHt = this.totalHt + Number(this.tab_achat.prixMouve);
            if (this.tab_achat.denoFour === null || String(this.tab_achat.denoFour) === '') {
              this.tab_achat.denoFour = '';
            }
            if (this.tab_achat.designSt === null || String(this.tab_achat.designSt) === '') {
              this.tab_achat.designSt = '';
            }
            if (this.tab_achat.codeMouve === null || String(this.tab_achat.codeMouve) === '') {
              this.tab_achat.codeMouve = '';
            }
            if (this.tab_achat.dateMouve === null || String(this.tab_achat.dateMouve) === '') {
              this.tab_achat.dateMouve = '';
            }
            if (this.tab_achat.quantiteMouve === null || String(this.tab_achat.quantiteMouve) === '') {
              this.tab_achat.quantiteMouve = '';
            }
            if (this.tab_achat.prixMouve === null || String(this.tab_achat.prixMouve) === '') {
              this.tab_achat.denoFour = '';
            }
            if (this.tab_achat.piece === null || String(this.tab_achat.piece) === '') {
              this.tab_achat.piece = '';
            }
         //   console.log(this.tab_achat);

            doc1.setFontSize(7);
            doc1.setFontStyle('Arial');
            doc1.text(this.tab_achat.codeMouve, 10, y);
            doc1.text(this.tab_achat.designSt, 42, y);
            doc1.text(this.tab_achat.dateMouve.substring(0, 19), 97, y);
            doc1.text(this.tab_achat.quantiteMouve, 114, y);
            doc1.text(this.tab_achat.prixMouve, 126, y);
            doc1.text(this.tab_achat.piece, 138, y);
            doc1.text(this.tab_achat.denoFour, 162, y);
            y = y + 7;
            if (y > 277) {
              doc1.line(9, 283, 205, 283);
             doc1.setFontSize(10);
              doc1.setFontStyle('normal');
             doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
               numPage++;

              doc1.addPage();
              doc1.line(9, 12, 205, 12);
              doc1.setFontSize(10);
              doc1.setFontStyle('bold');
             doc1.text('Référence', 10, 17);
             doc1.text('Désignation', 42, 17);
             doc1.text('Date', 97, 17);
             doc1.text('Qte', 114, 17);
             doc1.text('PU. HT', 124, 17);
             doc1.text('Pièce Com.', 138, 17);
             doc1.text('Tiers', 162, 17);
         // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(9, 20, 205, 20);
           y = 26;
            }

          }

        }
        doc1.line(9, 283, 205, 283);
        doc1.setFontSize(10);
         doc1.setFontStyle('normal');
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

      ////

        window.open(doc1.output('bloburl'), '_blank');

   }
  }
//// méthode afficher
   async Afficher(e) {

    // initialisation
    this.afficherClicked = true;
    this.achats = new Array();
    this.wasInside = true;
    this.ovo.hide();

const nbrjour = this.dayDiff(this.from, this.to);
console.log('nombre des jours ', nbrjour);


    if (this.SelectedArticle !== null || this.SelectedFournisseur !== null || Number(nbrjour) <= 31) {
    // affecter deno et code article
    if (this.SelectedArticle !== null) {
      this.codeArticle = this.SelectedArticle.code ;
      this.denoArticle = this.SelectedArticle.design;
    }
    // affecter deno et code fournisseur
    if (this.SelectedFournisseur !== null) {
      this.codeFour = this.SelectedFournisseur.code;
      this.denoFournisseur = this.SelectedFournisseur.deno;
    }
    // les méthodes afficher pour les 4 cas
    if ( (this.SelectedArticle === null ) &&
    (this.SelectedFournisseur === null  ) ) {
      console.log('cas4');
      await this.mouveService.getRapportAchat4(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB')).toPromise().then(
        (data) => {
          console.log(data);
          this.achats = data['_embedded'].rapportAchats;
          this.achatsTraitement =  data['_embedded'].rapportAchats;
          this.lenght = this.achats.length ;
          console.log(this.achats);

        }
      );
     } else  if ( (this.SelectedArticle !== null ) &&
    (this.SelectedFournisseur !== null ) ) {
      await this.mouveService.getRapportAchat3(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeArticle, this.codeFour).toPromise().then(
       (data) => {
         console.log(data);
         this.achats = data['_embedded'].rapportAchats;
         this.lenght = this.achats.length ;
         this.achatsTraitement =  data['_embedded'].rapportAchats;
       }
     );
      console.log('cas3');
     } else  if ( (this.SelectedArticle === null ) &&
    (this.SelectedFournisseur !== null  ) ) {
      await this.mouveService.getRapportAchat2(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeFour).toPromise().then(
       (data) => {
         console.log(data);
         this.achats = data['_embedded'].rapportAchats;
         this.achatsTraitement =  data['_embedded'].rapportAchats;
         this.lenght = this.achats.length ;
       }
     );
      console.log('cas2');
     } else   if ( (this.SelectedArticle !== null ) &&
     (this.SelectedFournisseur === null ) ) {
      await this.mouveService.getRapportAchat1(this.to.toLocaleDateString('en-GB'), this.from.toLocaleDateString('en-GB'),
      this.codeArticle).toPromise().then(
       (data) => {
         this.achats = data['_embedded'].rapportAchats;
         this.achatsTraitement =  data['_embedded'].rapportAchats;


       }
     );
     this.lenght = this.achats.length ;
       console.log('cas1');
      }


// test affichage grid
      if (this.lenght === 0 ) {

        this.valideShow = false;
        this.ngselectDisabled = true ;
        this.dateDisabled = false;
        this.achats = null;
        this.achatsTraitement = null;
        this.denoArticle = 'Tout ';
        this.denoFournisseur = 'Tout';
        this.ms = 'Aucun entrée trouvée !';
         this.ovo.show(e, document.getElementById('afficher'));
         this.hidden = false;
      } else {
          this.valideShow = true;
          this.ngselectDisabled = false ;
          this.dateDisabled = true;
          this.hidden = true;
      }




    } else {

      this.ms = 'Veuillez raffiner les critères !!';
      this.ovo.show(e, document.getElementById('afficher'));
      this.valideShow = false;
      this.ngselectDisabled = true ;
      this.dateDisabled = false;
      this.achats = null;
      this.achatsTraitement = null;
      this.denoArticle = 'Tout ';
      this.denoFournisseur = 'Tout';
      this.hidden = false;

    }



   }
   rowSelected() {
    this.readonlynom = true;
   this.readonly = true;
   if (this.grid.getSelectedRowIndexes()[0] >= 0) {
     const selected: any = this.grid.getSelectedRecords()[0];
     this.Selectedachat = selected ;

  }

 }
 async NvlSaisie() {
  // initialisation
   this.afficherClicked = false;
   this.achats = null;
   this.achatsTraitement = null;
   this.dateDisabled = false;
   this.ngselectDisabled = true;
   this.denoArticle = 'Tout ';
   this.denoFournisseur = 'Tout ';
   this.totalHt = 0;
   this.valideShow = false ;
   this.hidden = false;

 }

}
