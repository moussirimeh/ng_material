
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent, SearchSettingsModel,  ToolbarService, ResizeService
} from '@syncfusion/ej2-angular-grids';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ClientService } from '../services/client.service';
import { StockService } from '../services/stock.service';
import { FournisseurService } from '../services/fournisseur.service';
import { FamilleService } from '../services/famille.service';
import { SfamilleService } from '../services/sfamille.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { SecteurService } from '../services/secteur.service';
import { ZoneService } from '../services/zone.service';
import { RepresanService } from '../services/represan.service';
import { GroupeService } from '../services/groupe.service';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { globals } from '../../../environments/environment';
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
  selector: 'app-analyse-chiff-aff',
  templateUrl: './analyse-chiff-aff.component.html',
  styleUrls: ['./analyse-chiff-aff.component.scss'],
  providers: [ToolbarService, ResizeService]
})
export class AnalyseChiffAffComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  wasInside: boolean;
  index = 0;
  datedeb1: Date;
  datefin = new Date();

  groupes = new Array();


  tn;
  anneeCourante = new Date().getFullYear();
  annee_1 = this.anneeCourante - 1;
  annee_2 = this.anneeCourante - 2;
clt;
art;
four;
vend;
famil;
sfamil;
typoclt;
zone;
sect;
repres;
selectedclt;
liste = new Array();
clients =  new Array();
customAttributes: Object;
selectedItem;
placeholder = 'choisir un client';
items = new Array();
articles = new Array();
bindlabel;
  fournisseurs: any;
  familles: any;
  sousfamilles: any;
  secteurs: any;
  zones: any;
  vendeurs: any;
  representants: any;

  selectedChoix;
  public searchOptions: SearchSettingsModel;
  ngSelectItems = new Array();
  rechDeno: string;
  treeItems: any[];
  mindate: Date;
  maxDate: Date;
  readonly: boolean;
  btnafficher: boolean;
  btnappercu: boolean;


  @ViewChild('grid_1')
  public grid_1: GridComponent;

  mindate_1: Date;
  maxDate_1: Date;
  selectedChoix_1;
  items_1 = new Array();
  rechDeno_1: string;
  ngSelectItems_1 = new Array();
  bindlabel_1;
  selectedItem_1;
  placeholder_1 = 'choisir un client';
  datedeb1_1: Date;
  datefin_1 = new Date();


  @ViewChild('grid_2')
  public grid_2: GridComponent;

  mindate_2: Date;
  maxDate_2: Date;
  selectedChoix_2;
  items_2 = new Array();
  rechDeno_2: string;
  ngSelectItems_2 = new Array();
  bindlabel_2;
  selectedItem_2;
  placeholder_2 = 'choisir un client';
  datedeb1_2: Date;
  datefin_2 = new Date();
  readonly_1: boolean;
  btnafficher_1: boolean;
  btnappercu_1: boolean;
  readonly_2: boolean;
  btnafficher_2: boolean;
  btnappercu_2: boolean;
  societe: any;
  liste_2: any[];
  liste_1: any[];
  articles_1: any;
  articles_2: any[];
  clients_1: any[];
  clients_2: any[];



  constructor( private config: NgSelectConfig,
    private clientService: ClientService,
    private stockService: StockService,
    private fournisseurService: FournisseurService,
    private familleService: FamilleService,
    private vendeur1Service: Vendeur1Service,
    private secteurService: SecteurService,
    private sfamilleService: SfamilleService,
    private zoneService: ZoneService,
    private  mouveService: MouveService ,
    private  mouve1Service: Mouve1Service ,
    private  mouve2Service: Mouve2Service ,
    private represanService: RepresanService) {

    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
    this.anneeCourante = new Date().getFullYear();
    this.annee_1 = this.anneeCourante - 1;
    this.annee_2 = this.anneeCourante - 2;


   }


   async ngOnInit() {

    this.tn = {
      firstDayOfWeek: 0,
      dayNames: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche'
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


    await this.clientService
    .getClientsListOrdByDeno()
    .subscribe(
   data => {
      this.clients  = data['_embedded'].clients;
    }),
    (data => {
      console.log('error reload data clients');
    })
    , () => {};
console.log('liste des clients ',  this.clients );


    this.selectedChoix = 'clt';
    this.selectedChoix_1 = 'clt';
    this.selectedChoix_2 = 'clt';





    this.btnafficher = true;
    this.btnafficher_1 = true;
    this.btnafficher_2 = true;
    this.readonly = false;
    this.readonly_1 = false;
    this.readonly_2 = false;


    this.datedeb1 = new Date(new Date().getFullYear(), 0, 1);
    this.datedeb1_1 = new Date(new Date().getFullYear() - 1, 0, 1);
    this.datefin_1 =  new Date(new Date().getFullYear() - 1, 11, 31);

    this.datedeb1_2 = new Date(new Date().getFullYear() - 2, 0, 1);
    this.datefin_2 =  new Date(new Date().getFullYear() - 2, 11, 31);

    this.mindate = new Date(new Date().getFullYear(), 0, 1);
    this.maxDate = new Date(new Date().getFullYear(), 11, 31);

    this.mindate_1 = new Date(new Date().getFullYear() - 1, 0, 1);
    this.maxDate_1 = new Date(new Date().getFullYear() - 1, 11, 31);


    this.mindate_2 = new Date(new Date().getFullYear() - 2, 0, 1);
    this.maxDate_2 = new Date(new Date().getFullYear() - 2, 11, 31);



    this.selectedItem = null;
    this.selectedItem_1 = null;
    this.selectedItem_2 = null;
    this.customAttributes = { class: 'customcss' };
this.groupes = [
  {
    id: '0',
    deno: 'N'
  },
  {
    id: '1',
    deno: 'M'
  },
  {
    id: '2',
    deno: 'I'
  },
  {
    id: '3',
    deno: 'S'
  },
 { id: '4',
  deno: 'P'
}

];



  }


   async imprimer () {
    // initailisation
    let titre: string ;

      /// créer doc jspdf
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');

      // this.societe = globals.societe;
      this.societe = globals.societe;
      console.log('societe ', this.societe);

      doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
      switch (this.selectedChoix) {

        case 'clt': {
         titre = 'Client';
        }break;
        case 'art': {
          titre = 'Article';

        }break;
        case 'four': {
          titre = 'Fournisseur';
        }break;

        case 'vend': {
          titre = 'Vendeur';
        }break;

        case 'famil': {
          titre = 'Famille';
        }break;

        case 'sfamil': {
          titre = 'Sous famille';
        }break;
        case 'typoclt': {
          titre = 'Typologie client';
        }break;

        case 'zone': {
          titre = 'Zone';
        }break;
        case 'sect': {

          titre = 'Secteur';

        }break;
        case 'repres': {
          titre = 'Represantant';

        }break;

      }

      const temps = new Date().toLocaleDateString('en-GB');
      doc1.text('Tunis, le : '  + temps, 165, 17);


      doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.text('Chiffre d\'affaires par '  + titre, 50, 27);


        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
        doc1.text('Du  :  ' + this.datedeb1.toLocaleDateString('en-GB') , 9, 35);
        doc1.text('au :  ' + this.datefin.toLocaleDateString('en-GB'), 43, 35);


         // entete du  tableau
         doc1.setFontStyle('bold');
         doc1.line(9, 40, 205, 40);
         doc1.setFontSize(12);
         doc1.setFontStyle('bold');
         doc1.text('CA EN DT', 10, 45);
         doc1.text('Marge', 60, 45);
         doc1.text('CODE', 90, 45);
         doc1.text('DESIGNATION', 140, 45);

     // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 48, 205, 48);

      let y = 52;
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
        const numPage = 1;
      if (this.liste.length > 0) {
        let numPage = 1;
        for (const obj of this.liste) {

          doc1.setFontSize(9);
          doc1.setFontStyle('Arial');
          doc1.text(obj.ca, 49, y, 'right');
          doc1.text(obj.marg, 73, y, 'right');
          doc1.text(obj.code, 91, y);
          doc1.text(obj.deno, 141, y);

          y = y + 7;
          if (y > 277) {
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

            numPage++;
            doc1.addPage();
            doc1.line(9, 12, 205, 12);
           doc1.setFontSize(10);
           doc1.setFontStyle('bold');
           doc1.setFontSize(12);
           doc1.setFontStyle('bold');
           doc1.text('CA EN DT', 10, 17);
           doc1.text('Marge', 60, 17);
           doc1.text('CODE', 90, 17);
           doc1.text('DESIGNATION', 140, 17);
       // creer la ligne
         doc1.setFontStyle('bold');
         doc1.line(9, 20, 205, 20);
         y = 24;
          }


          }
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');


    }

  }
  async imprimer_1 () {
    // initailisation
    let titre: string ;

      /// créer doc jspdf
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');

      // this.societe = globals.societe;
      this.societe = globals.societe;
      console.log('societe ', this.societe);

      doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
      switch (this.selectedChoix_1) {

        case 'clt': {
         titre = 'Client';
        }break;
        case 'art': {
          titre = 'Article';

        }break;
        case 'four': {
          titre = 'Fournisseur';
        }break;

        case 'vend': {
          titre = 'Vendeur';
        }break;

        case 'famil': {
          titre = 'Famille';
        }break;

        case 'sfamil': {
          titre = 'Sous famille';
        }break;
        case 'typoclt': {
          titre = 'Typologie client';
        }break;

        case 'zone': {
          titre = 'Zone';
        }break;
        case 'sect': {

          titre = 'Secteur';

        }break;
        case 'repres': {
          titre = 'Represantant';

        }break;

      }

      const temps = new Date().toLocaleDateString('en-GB');
      doc1.text('Tunis, le : '  + temps, 165, 17);


      doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.text('Chiffre d\'affaires par '  + titre, 50, 27);


        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
        doc1.text('Du  :  ' + this.datedeb1_1.toLocaleDateString('en-GB') , 9, 35);
        doc1.text('au :  ' + this.datefin_1.toLocaleDateString('en-GB'), 43, 35);


         // entete du  tableau
         doc1.setFontStyle('bold');
         doc1.line(9, 40, 205, 40);
         doc1.setFontSize(12);
         doc1.setFontStyle('bold');
         doc1.text('CA EN DT', 10, 45);
         doc1.text('Marge', 60, 45);
         doc1.text('CODE', 90, 45);
         doc1.text('DESIGNATION', 140, 45);

     // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 48, 205, 48);

      let y = 52;
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
        const numPage = 1;
      if (this.liste_1.length > 0) {
        let numPage = 1;
        for (const obj of this.liste_1) {

          doc1.setFontSize(9);
          doc1.setFontStyle('Arial');
          doc1.text(obj.ca, 49, y, 'right');
          doc1.text(obj.marg, 73, y, 'right');
          doc1.text(obj.code, 91, y);
          doc1.text(obj.deno, 141, y);

          y = y + 7;
          if (y > 277) {
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

            numPage++;
            doc1.addPage();
            doc1.line(9, 12, 205, 12);
           doc1.setFontSize(10);
           doc1.setFontStyle('bold');
           doc1.setFontSize(12);
           doc1.setFontStyle('bold');
           doc1.text('CA EN DT', 10, 17);
           doc1.text('Marge', 60, 17);
           doc1.text('CODE', 90, 17);
           doc1.text('DESIGNATION', 140, 17);
       // creer la ligne
         doc1.setFontStyle('bold');
         doc1.line(9, 20, 205, 20);
         y = 24;
          }


          }
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');


    }

  }

  async imprimer_2 () {
    // initailisation
    let titre: string ;

      /// créer doc jspdf
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');

      // this.societe = globals.societe;
      this.societe = globals.societe;
      console.log('societe ', this.societe);

      doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
      switch (this.selectedChoix_2) {

        case 'clt': {
         titre = 'Client';
        }break;
        case 'art': {
          titre = 'Article';

        }break;
        case 'four': {
          titre = 'Fournisseur';
        }break;

        case 'vend': {
          titre = 'Vendeur';
        }break;

        case 'famil': {
          titre = 'Famille';
        }break;

        case 'sfamil': {
          titre = 'Sous famille';
        }break;
        case 'typoclt': {
          titre = 'Typologie client';
        }break;

        case 'zone': {
          titre = 'Zone';
        }break;
        case 'sect': {

          titre = 'Secteur';

        }break;
        case 'repres': {
          titre = 'Represantant';

        }break;

      }

      const temps = new Date().toLocaleDateString('en-GB');
      doc1.text('Tunis, le : '  + temps, 165, 17);


      doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.text('Chiffre d\'affaires par '  + titre, 50, 27);


        doc1.setFontSize(12);
        doc1.setFontStyle('Arial');
        doc1.text('Du  :  ' + this.datedeb1_2.toLocaleDateString('en-GB') , 9, 35);
        doc1.text('au :  ' + this.datefin_2.toLocaleDateString('en-GB'), 43, 35);


         // entete du  tableau
         doc1.setFontStyle('bold');
         doc1.line(9, 40, 205, 40);
         doc1.setFontSize(12);
         doc1.setFontStyle('bold');
         doc1.text('CA EN DT', 10, 45);
         doc1.text('Marge', 60, 45);
         doc1.text('CODE', 90, 45);
         doc1.text('DESIGNATION', 140, 45);

     // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 48, 205, 48);

      let y = 52;
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
        const numPage = 1;
      if (this.liste_2.length > 0) {
        let numPage = 1;
        for (const obj of this.liste_2) {

          doc1.setFontSize(9);
          doc1.setFontStyle('Arial');
          doc1.text(obj.ca, 49, y, 'right');
          doc1.text(obj.marg, 73, y, 'right');
          doc1.text(obj.code, 91, y);
          doc1.text(obj.deno, 141, y);

          y = y + 7;
          if (y > 277) {
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

            numPage++;
            doc1.addPage();
            doc1.line(9, 12, 205, 12);
           doc1.setFontSize(10);
           doc1.setFontStyle('bold');
           doc1.setFontSize(12);
           doc1.setFontStyle('bold');
           doc1.text('CA EN DT', 10, 17);
           doc1.text('Marge', 60, 17);
           doc1.text('CODE', 90, 17);
           doc1.text('DESIGNATION', 140, 17);
       // creer la ligne
         doc1.setFontStyle('bold');
         doc1.line(9, 20, 205, 20);
         y = 24;
          }


          }
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');


    }

  }



nouvelleSaisie_1() {
    this.items_1 = new Array();
    this.liste_1 = new Array();
    this.grid_1.refresh();
    this.readonly_1 = false;
    this.btnafficher_1 = true;
    this.btnappercu_1 = false;
    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.datedeb1_1 = new Date(new Date().getFullYear() - 1, 0, 1);
    this.datefin_1 = new Date(new Date().getFullYear() - 1, 11, 31);

    this.selectedChoix_1 = 'clt';
    this.placeholder_1 = 'choisir un client';
  }

  nouvelleSaisie_2() {
    this.items_2 = new Array();
    this.liste_2 = new Array();
    this.grid_2.refresh();
    this.readonly_2 = false;
    this.btnafficher_2 = true;
    this.btnappercu_2 = false;
    this.selectedItem_2 = null;
    this.ngSelectItems_2 = new Array();
    this.datedeb1_2 = new Date(new Date().getFullYear() - 2, 0, 1);
    this.datefin_2 = new Date(new Date().getFullYear() - 2, 11, 31);

    this.selectedChoix_2 = 'clt';
    this.placeholder_2 = 'choisir un client';
  }


nouvelleSaisie() {
  this.items = new Array();
  this.liste = new Array();
  this.grid.refresh();
  this.readonly = false;
  this.btnafficher = true;
  this.btnappercu = false;
  this.selectedItem = null;
  this.ngSelectItems = new Array();

  this.datedeb1 = new Date(new Date().getFullYear(), 0, 1);
  this.datefin = new Date();

  this.selectedChoix = 'clt';
  this.placeholder = 'choisir un client';
}

changeSelectedItem() {


    console.log('selected item ', this.selectedItem);

     if (this.selectedItem !== undefined && this.selectedItem !== null) {
            switch (this.placeholder) {
              case 'choisir un represantant' : {
                this.rechDeno = this.selectedItem.deno;
              }break;
              case 'choisir un secteur' : {
                this.rechDeno = this.selectedItem.deno;
              }break;
              case 'choisir une zone' : {
                this.rechDeno = this.selectedItem.deno;
              }break;

              case 'choisir un groupe ' : {
                this.rechDeno = this.selectedItem.deno;
              }break;
              case 'choisir un vendeur ' : {
                this.rechDeno = this.selectedItem.deno;
              }break;
              case 'choisir un fournisseur ' : {
                this.rechDeno = this.selectedItem.deno;
              }break;
              case 'choisir un client' : {
                this.rechDeno = this.selectedItem.deno;
              }break;

                case 'choisir une famille ': {
                  this.rechDeno = this.selectedItem.nom;
                }break;

                case 'choisir une sous famille': {
                  this.rechDeno = this.selectedItem.nom;
                }break; // 'choisir un vendeur '
                case 'choisir un article': {
                  this.rechDeno = this.selectedItem.design;
                }break;
          }

      console.log('selected item ', this.selectedItem);


      this.grid.search(this.rechDeno);

      this.grid.selectRow(0, true);



     } else {
        this.items = this.liste ;
        this.grid.search('');
     }

   }
changeSelectedItem_1() {

    console.log('selected item ', this.selectedItem_1);

     if (this.selectedItem_1 !== undefined && this.selectedItem_1 !== null) {
            switch (this.placeholder_1) {
              case 'choisir un represantant' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;
              case 'choisir un secteur' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;
              case 'choisir une zone' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;

              case 'choisir un groupe ' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;
              case 'choisir un vendeur ' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;
              case 'choisir un fournisseur ' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;
              case 'choisir un client' : {
                this.rechDeno_1 = this.selectedItem_1.deno;
              }break;

                case 'choisir une famille ': {
                  this.rechDeno_1 = this.selectedItem_1.nom;
                }break;

                case 'choisir une sous famille': {
                  this.rechDeno_1 = this.selectedItem_1.nom;
                }break;
                // 'choisir un vendeur '
                case 'choisir un article': {
                  this.rechDeno_1 = this.selectedItem_1.design;
                }break;
          }

      console.log('selected item ', this.selectedItem_1);


      this.grid_1.search(this.rechDeno_1);
      this.index = 0;


     } else {
        this.items_1 = this.liste_1 ;
        this.grid_1.search('');
     }

   }
changeSelectedItem_2() {

    console.log('selected item ', this.selectedItem_2);

     if (this.selectedItem_2 !== undefined && this.selectedItem_2 !== null) {
            switch (this.placeholder_2) {
              case 'choisir un represantant' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;
              case 'choisir un secteur' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;
              case 'choisir une zone' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;

              case 'choisir un groupe ' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;
              case 'choisir un vendeur ' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;
              case 'choisir un fournisseur ' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;
              case 'choisir un client' : {
                this.rechDeno_2 = this.selectedItem_2.deno;
              }break;

                case 'choisir une famille ': {
                  this.rechDeno_2 = this.selectedItem_2.nom;
                }break;

                case 'choisir une sous famille': {
                  this.rechDeno_2 = this.selectedItem_2.nom;
                }break;
                // 'choisir un article '
                case 'choisir un article': {
                  this.rechDeno_2 = this.selectedItem_2.design;
                }break;
          }

      console.log('selected item ', this.selectedItem_2);


      this.grid_2.search(this.rechDeno_2);
      this.index = 0;


     } else {
        this.items_2 = this.liste_2 ;
        this.grid_2.search('');
     }

   }

async afficher() {
  this.selectedItem = null;
  this.items = new Array();
 // //  this.grid.refresh();

  this.liste = new Array();


  const d1 = this.datedeb1.toLocaleDateString('en-GB');
  const d2 = this.datefin.toLocaleDateString('en-GB');


  switch (this.selectedChoix) {
    case 'clt': {
      await this.mouveService.getCaMrgClient(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg client ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;

    case 'art': {
      await this.mouveService.getCaMrgStock(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg stock ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;
    case 'four': {
      await this.mouveService.getCaMrgFournisseur(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg Fournisseur ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });


    }break;

    case 'vend': {
      await this.mouveService.getCaMrgVendeur(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg Vendeur ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;

    case 'famil': {
      await this.mouveService.getCaMrgFamille(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg Famille ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;

    case 'sfamil': {
      await this.mouveService.getCaMrgSfamille(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg sous  Famille ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;
    case 'typoclt': {
      await this.mouveService.getCaMrgTypoClt(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg  clt ', data);
        this.items = data['_embedded'].chiffreAffMrgs;

      });

    }break;

    case 'zone': {
      await this.mouveService.getCaMrgZone(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg  zone ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;
    case 'sect': {

      await this.mouveService.getCaMrgSecteur(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg  Secteur ', data);
        this.items = data['_embedded'].chiffreAffMrgs;
      });

    }break;
    case 'repres': {
      await this.mouveService.getCaMrgRepresan(d1, d2)
      .toPromise()
      .then(data => {
        console.log('ca marg  Represantant ', data);
        this.items = data['_embedded'].chiffreAffMrgs;

      });


    }break;

  }
   if (this.items.length > 0) {
    for (const item of this.items ) {
      item.ca = Number(item.ca).toFixed(3);
      item.marg = Number(item.marg).toFixed(2);
      }
      this.readonly = true;
      this.btnafficher = false;


   }
   this.liste = this.items;
   // this.grid.search('');

   }
async afficher_1() {
    this.selectedItem_1 = null;
    this.items_1 = new Array();
   // //  this.grid.refresh();

    this.liste_1 = new Array();


    const d1 = this.datedeb1_1.toLocaleDateString('en-GB');
    const d2 = this.datefin_1.toLocaleDateString('en-GB');


    switch (this.selectedChoix_1) {
      case 'clt': {

        await this.mouve1Service.getCaMrgClient(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg client _1  ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;

        });


      }break;

      case 'art': {
        await this.mouve1Service.getCaMrgStock(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg _1 stock ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'four': {
        await this.mouve1Service.getCaMrgFournisseur(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg Fournisseur -1 ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });


      }break;

      case 'vend': {
        await this.mouve1Service.getCaMrgVendeur(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg Vendeur -1 ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });

      }break;

      case 'famil': {
        await this.mouve1Service.getCaMrgFamille(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg Famille -1 ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });

      }break;

      case 'sfamil': {
        await this.mouve1Service.getCaMrgSfamille(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg sous  Famille ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'typoclt': {
        await this.mouve1Service.getCaMrgTypoClt(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  clt -1 ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;

        });

      }break;

      case 'zone': {
        await this.mouve1Service.getCaMrgZone(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  zone -1 ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'sect': {

        await this.mouve1Service.getCaMrgSecteur(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  Secteur -1 ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'repres': {
        await this.mouve1Service.getCaMrgRepresan(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  Represantant -1  ', data);
          this.items_1 = data['_embedded'].chiffreAffMrgs;

        });


      }break;

    }
     if (this.items_1.length > 0) {
      for (const item of this.items_1 ) {
        item.ca = Number(item.ca).toFixed(3);
        item.marg = Number(item.marg).toFixed(2);
        }
        this.readonly_1 = true;
        this.btnafficher_1 = false;

     }
     this.liste_1 = this.items_1;
     // this.grid.search('');

     }
async afficher_2() {
    this.selectedItem_2 = null;
    this.items_2 = new Array();
   // //  this.grid.refresh();

    this.liste_2 = new Array();


    const d1 = this.datedeb1_2.toLocaleDateString('en-GB');
    const d2 = this.datefin_2.toLocaleDateString('en-GB');


    switch (this.selectedChoix_2) {
      case 'clt': {

        await this.mouve2Service.getCaMrgClient(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg client _2  ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;

        });


      }break;

      case 'art': {
        await this.mouve2Service.getCaMrgStock(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg _2 stock ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'four': {
        await this.mouve2Service.getCaMrgFournisseur(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg Fournisseur -2 ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });


      }break;

      case 'vend': {
        await this.mouve2Service.getCaMrgVendeur(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg Vendeur -2 ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });

      }break;

      case 'famil': {
        await this.mouve2Service.getCaMrgFamille(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg Famille -2 ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });

      }break;

      case 'sfamil': {
        await this.mouve2Service.getCaMrgSfamille(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg sous  Famille  -2', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'typoclt': {
        await this.mouve2Service.getCaMrgTypoClt(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  clt -2 ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;

        });

      }break;

      case 'zone': {
        await this.mouve2Service.getCaMrgZone(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  zone -2 ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'sect': {

        await this.mouve2Service.getCaMrgSecteur(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  Secteur -2 ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;
        });

      }break;
      case 'repres': {
        await this.mouve2Service.getCaMrgRepresan(d1, d2)
        .toPromise()
        .then(data => {
          console.log('ca marg  Represantant -2  ', data);
          this.items_2 = data['_embedded'].chiffreAffMrgs;

        });


      }break;

    }
     if (this.items_2.length > 0) {
      for (const item of this.items_2 ) {
        item.ca = Number(item.ca).toFixed(3);
        item.marg = Number(item.marg).toFixed(2);
        }
        this.readonly_2 = true;
        this.btnafficher_2 = false;

     }
     this.liste_2 = this.items_2;

     }



async clickRepresentant() {
    this.selectedItem = null;
    console.log('repres', this.selectedChoix);
    this.ngSelectItems = new Array();
    this.items = new Array();


    await this.represanService.getRepresansList()

    .toPromise()
    .then(data => {
      console.log('represan liste  ', data);

     this.ngSelectItems =  data['_embedded'].represans;
     this.bindlabel = 'deno';
     this.placeholder = 'choisir un represantant';
    });
   }
async clickRepresentant_1() {
    this.selectedItem_1 = null;
    console.log('repres', this.selectedChoix_1);
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();


    await this.represanService.getRepresansList()

    .toPromise()
    .then(data => {
      console.log('represan liste  ', data);

     this.ngSelectItems_1 =  data['_embedded'].represans;
     this.bindlabel_1 = 'deno';
     this.placeholder_1 = 'choisir un represantant';
    });
   }
async clickRepresentant_2() {
    this.selectedItem_2 = null;
    console.log('repres', this.selectedChoix_2);
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();


    await this.represanService.getRepresansList()

    .toPromise()
    .then(data => {
      console.log('represan liste  ', data);

     this.ngSelectItems_2 =  data['_embedded'].represans;
     this.bindlabel_2 = 'deno';
     this.placeholder_2 = 'choisir un represantant';
    });
   }


async clickSecteur() {
    this.selectedItem = null;
    console.log('sect ', this.selectedChoix);
    this.ngSelectItems = new Array();
    this.items = new Array();



    await this.secteurService.getSecteursList()
    .toPromise()
    .then(data => {
      console.log('secteur liste  ', data);

     this.ngSelectItems =  data['_embedded'].secteurs;
     this.bindlabel = 'deno';
     this.placeholder = 'choisir un secteur';
    });

   }
async clickSecteur_1() {
    this.selectedItem_1 = null;
    console.log('sect ', this.selectedChoix_1);
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();



    await this.secteurService.getSecteursList()
    .toPromise()
    .then(data => {
      console.log('secteur liste  ', data);

     this.ngSelectItems_1 =  data['_embedded'].secteurs;
     this.bindlabel_1 = 'deno';
     this.placeholder_1 = 'choisir un secteur';
    });

   }
async clickSecteur_2() {
    this.selectedItem_2 = null;
    console.log('sect ', this.selectedChoix_2);
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();



    await this.secteurService.getSecteursList()
    .toPromise()
    .then(data => {
      console.log('secteur liste  ', data);

     this.ngSelectItems_2 =  data['_embedded'].secteurs;
     this.bindlabel_2 = 'deno';
     this.placeholder_2 = 'choisir un secteur';
    });

   }


async  clickZone() {
  this.selectedItem = null;
  this.ngSelectItems = new Array();
  this.items = new Array();

    console.log('zone ', this.selectedChoix);
    await this.zoneService.getZonesList()
    .toPromise()
    .then(data => {
      console.log('zone liste  ', data);
     this.ngSelectItems =  data['_embedded'].zones;
    });
    //  this.grid.refresh();
    this.bindlabel = 'deno';
    this.placeholder = 'choisir une zone';
  }
async  clickZone_1() {
    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();

      console.log('zone ', this.selectedChoix_1);
      await this.zoneService.getZonesList()
      .toPromise()
      .then(data => {
        console.log('zone liste  ', data);
       this.ngSelectItems_1 =  data['_embedded'].zones;
      });
      //  this.grid.refresh();
      this.bindlabel_1 = 'deno';
      this.placeholder_1 = 'choisir une zone';
    }
async  clickZone_2() {
      this.selectedItem_2 = null;
      this.ngSelectItems_2 = new Array();
      this.items_2 = new Array();

        console.log('zone ', this.selectedChoix_2);
        await this.zoneService.getZonesList()
        .toPromise()
        .then(data => {
          console.log('zone liste  ', data);
         this.ngSelectItems_2 =  data['_embedded'].zones;
        });
        //  this.grid.refresh();
        this.bindlabel_2 = 'deno';
        this.placeholder_2 = 'choisir une zone';
    }



async clickTypologieclient() {

    this.selectedItem = null;
    this.ngSelectItems = new Array();
    this.items = new Array();

    console.log('typologie ', this.selectedChoix);

    this.ngSelectItems = this.groupes;
    this.bindlabel = 'deno';
    this.placeholder = 'choisir un groupe ';
    //  this.grid.refresh();
   }
async clickTypologieclient_1() {

    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();

    console.log('typologie ', this.selectedChoix_1);

    this.ngSelectItems_1 = this.groupes;
    this.bindlabel_1 = 'deno';
    this.placeholder_1 = 'choisir un groupe ';
    //  this.grid.refresh();
   }
async clickTypologieclient_2() {

    this.selectedItem_2 = null;
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();

    console.log('typologie ', this.selectedChoix_2);

    this.ngSelectItems_2 = this.groupes;
    this.bindlabel_2 = 'deno';
    this.placeholder_2 = 'choisir un groupe ';
    //  this.grid.refresh();
   }

async  clicksFamille() {

  this.selectedItem = null;
  this.ngSelectItems = new Array();
  this.items = new Array();

    console.log('sous famille ', this.selectedChoix);
    await this.sfamilleService.getSfamillesList()
    .toPromise()
    .then(data => {
      console.log('famille liste  ', data);

     this.ngSelectItems =  data['_embedded'].sfamilles;
     this.bindlabel = 'nom';
     this.placeholder = 'choisir une sous famille';
    });
    //  this.grid.refresh();
   }
async  clicksFamille_1() {

    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();

      console.log('sous famille ', this.selectedChoix_1);
      await this.sfamilleService.getSfamillesList()
      .toPromise()
      .then(data => {
        console.log('famille liste  ', data);

       this.ngSelectItems_1 =  data['_embedded'].sfamilles;
       this.bindlabel_1 = 'nom';
       this.placeholder_1 = 'choisir une sous famille';
      });

     }
async  clicksFamille_2() {

      this.selectedItem_2 = null;
      this.ngSelectItems_2 = new Array();
      this.items_2 = new Array();

        console.log('sous famille ', this.selectedChoix_2);
        await this.sfamilleService.getSfamillesList()
        .toPromise()
        .then(data => {
          console.log('famille liste  ', data);

         this.ngSelectItems_2 =  data['_embedded'].sfamilles;
         this.bindlabel_2 = 'nom';
         this.placeholder_2 = 'choisir une sous famille';
        });

       }

  async clickFamille() {

    this.selectedItem = null;
    this.ngSelectItems = new Array();
    this.items = new Array();
    console.log('famille ', this.selectedChoix);
    await this.familleService.getFamillesList()
    .toPromise()
    .then(data => {
      console.log('famille liste  ', data);

     this.ngSelectItems =  data['_embedded'].familles;
     this.bindlabel = 'nom';
     this.placeholder = 'choisir une famille ';
    });
    //  this.grid.refresh();
   }
  async clickFamille_1() {

    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();
    console.log('famille ', this.selectedChoix_1);
    await this.familleService.getFamillesList()
    .toPromise()
    .then(data => {
      console.log('famille liste  ', data);

     this.ngSelectItems_1 =  data['_embedded'].familles;
     this.bindlabel_1 = 'nom';
     this.placeholder_1 = 'choisir une famille ';
    });
    //  this.grid.refresh();
   }
  async clickFamille_2() {

    this.selectedItem_2 = null;
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();
    console.log('famille ', this.selectedChoix_2);
    await this.familleService.getFamillesList()
    .toPromise()
    .then(data => {
      console.log('famille liste  ', data);

     this.ngSelectItems_2 =  data['_embedded'].familles;
     this.bindlabel_2 = 'nom';
     this.placeholder_2 = 'choisir une famille ';
    });
    //  this.grid.refresh();
   }

 async   clickVendeur() {

  this.selectedItem = null;
  this.ngSelectItems = new Array();
  this.items = new Array();

    console.log('vend ', this.selectedChoix);
    await this.vendeur1Service.getVendeur1sList()
    .toPromise()
    .then(data => {
      console.log('vendeur liste  ', data);

     this.ngSelectItems =  data['_embedded'].vendeur1;
     this.bindlabel = 'deno';
     this.placeholder = 'choisir un vendeur ';
    });
    //  this.grid.refresh();
   }
 async   clickVendeur_1() {

    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();

      console.log('vend ', this.selectedChoix_1);
      await this.vendeur1Service.getVendeur1sList()
      .toPromise()
      .then(data => {
        console.log('vendeur liste  ', data);

       this.ngSelectItems_1 =  data['_embedded'].vendeur1;
       this.bindlabel_1 = 'deno';
       this.placeholder_1 = 'choisir un vendeur ';
      });
      //  this.grid.refresh();
     }
 async   clickVendeur_2() {

      this.selectedItem_2 = null;
      this.ngSelectItems_2 = new Array();
      this.items_2 = new Array();

        console.log('vend ', this.selectedChoix_2);
        await this.vendeur1Service.getVendeur1sList()
        .toPromise()
        .then(data => {
          console.log('vendeur liste  ', data);

         this.ngSelectItems_2 =  data['_embedded'].vendeur1;
         this.bindlabel_2 = 'deno';
         this.placeholder_2 = 'choisir un vendeur ';
        });
        //  this.grid.refresh();
       }


  async clickFournisseur() {
    this.selectedItem = null;
    this.ngSelectItems = new Array();
    this.items = new Array();

    console.log('fournisseur ', this.selectedChoix);
    await this.fournisseurService.getFourList()
    .toPromise()
    .then(data => {
      console.log('fournisseurs liste  ', data);

     this.ngSelectItems =  data['_embedded'].fournisseurs;
     this.bindlabel = 'deno';
     this.placeholder = 'choisir un fournisseur ';
    });
    //  this.grid.refresh();
   }
  async clickFournisseur_1() {
    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();

    console.log('fournisseur ', this.selectedChoix_1);
    await this.fournisseurService.getFourList()
    .toPromise()
    .then(data => {
      console.log('fournisseurs liste  ', data);

     this.ngSelectItems_1 =  data['_embedded'].fournisseurs;
     this.bindlabel_1 = 'deno';
     this.placeholder_1 = 'choisir un fournisseur ';
    });
    //  this.grid.refresh();
   }
  async clickFournisseur_2() {
    this.selectedItem_2 = null;
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();

    console.log('fournisseur ', this.selectedChoix_2);
    await this.fournisseurService.getFourList()
    .toPromise()
    .then(data => {
      console.log('fournisseurs liste  ', data);

     this.ngSelectItems_2 =  data['_embedded'].fournisseurs;
     this.bindlabel_2 = 'deno';
     this.placeholder_2 = 'choisir un fournisseur ';
    });
    //  this.grid.refresh();
   }


async rechercheClt(filterValue: string) {
  console.log('mot a rech ', filterValue);

  this.clients = new Array();
  this.ngSelectItems = new Array();
    await this.clientService
    .searchClientByDenoStartsWith(filterValue)
    .toPromise()
    .then(data => {
      this.clients  = data['_embedded'].clients;
    })
    .catch(data => {
      console.log('error reload data clients');
    })
    .finally(() => {

    });

    console.log('liste clients rech ', this.clients);


  this.ngSelectItems =  this.articles;
  console.log('liste clients rech   NG  ', this.ngSelectItems);

}

async rechercheClt_1() {
    if (this.clients.length > 0) {
      this.clients_1  = this.clients;
    }
}
async rechercheClt_2() {
  if (this.clients.length > 0) {
    this.clients_2  = this.clients;
  }
}



async rechercheArt(filterValue: string) {
  console.log('mot rech ', filterValue );

  this.articles  = new Array();
  await this.stockService
          .getStockByDesign(filterValue)
          .toPromise()
          .then(data => {
            console.log('data ', data);

            const articlesTmp = data['_embedded'].stocks;
            this.articles = articlesTmp;
          })
          .catch(data => {
            console.log('error reload data stocks');
          })
          .finally(() => {

          });

          console.log('result search ',  this.articles );

}

async rechercheArt_1(filterValue: string) {
  console.log('mot rech ', filterValue );

  this.articles_1  = new Array();
  await this.stockService
          .getStockByDesign(filterValue)
          .toPromise()
          .then(data => {
            console.log('data ', data);

            const articlesTmp = data['_embedded'].stocks;
            this.articles_1 = articlesTmp;
          })
          .catch(data => {
            console.log('error reload data stocks');
          })
          .finally(() => {
            // this.grid.refresh();
          });

          console.log('result search ',  this.articles_1 );


}

async rechercheArt_2(filterValue: string) {
  console.log('mot rech ', filterValue );

  this.articles_2  = new Array();
  await this.stockService
          .getStockByDesign(filterValue)
          .toPromise()
          .then(data => {
            console.log('data ', data);

            const articlesTmp = data['_embedded'].stocks;
            this.articles_2 = articlesTmp;
          })
          .catch(data => {
            console.log('error reload data stocks');
          })
          .finally(() => {
            // this.grid.refresh();
          });

          console.log('result search ',  this.articles_2 );



}

  async clickClient() {
    this.selectedItem = null;
    this.ngSelectItems = new Array();
    this.items = new Array();
    this.bindlabel = 'deno';
    this.placeholder = 'choisir un client';


     this.ngSelectItems =  this.clients;

   }
  async clickClient_1() {
    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();

    console.log('client ', this.selectedChoix_1);

    await this.clientService
    .getClientsList()
    .toPromise()
    .then(data => {
      this.ngSelectItems_1  = data['_embedded'].clients;

    })
    .catch(data => {
      console.log('error reload data clients');
    })
    .finally(() => {

    });

     this.bindlabel_1 = 'deno';
     this.placeholder_1 = 'choisir un client';
     //  this.grid.refresh();
   }
  async clickClient_2() {
    this.selectedItem_2 = null;
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();

    console.log('client ', this.selectedChoix_2);

    await this.clientService
    .getClientsList()
    .toPromise()
    .then(data => {
      this.ngSelectItems_2  = data['_embedded'].clients;

    })
    .catch(data => {
      console.log('error reload data clients');
    })
    .finally(() => {

    });

     this.bindlabel_2 = 'deno';
     this.placeholder_2 = 'choisir un client';
     //  this.grid.refresh();
   }


  async clickArticle() {
    this.placeholder = 'choisir un article';
    this.selectedItem = null;
    this.ngSelectItems = new Array();
    this.items = new Array();

       this.ngSelectItems =  this.articles;
       this.bindlabel = 'code';

   }
  async clickArticle_1() {
    this.placeholder_1 = 'choisir un article';
    this.selectedItem_1 = null;
    this.ngSelectItems_1 = new Array();
    this.items_1 = new Array();


    await this.stockService
    . getStockOrderByCode()
    .toPromise()
    .then(data => {
      this.ngSelectItems_1  = data['_embedded'].stocks;

    })
    .catch(data => {
      console.log('error reload data stocks');
    })
    .finally(() => {
    });


       this.bindlabel_1 = 'code';



   }
  async clickArticle_2() {
    this.placeholder_2 = 'choisir un article';
    this.selectedItem_2 = null;
    this.ngSelectItems_2 = new Array();
    this.items_2 = new Array();


    await this.stockService
    . getStockOrderByCode()
    .toPromise()
    .then(data => {
      this.ngSelectItems_2  = data['_embedded'].stocks;

    })
    .catch(data => {
      console.log('error reload data stocks');
    })
    .finally(() => {
    });


       this.bindlabel_2 = 'code';



   }


   public onSearchItem(word: string, item: any): boolean {
    if (item.deno !== undefined) {
      return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
     }
     if (item.nom !== undefined) {
      return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
     }

     if (item.design !== undefined) {
      return item.design.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
     }
 }


 public onSearchItemclt(word: string, item: any): boolean {

    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());


}


  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
     this.op.hide();
    }
    this.wasInside = false;
  }























  // tree resultat recherche
/*
   applyFilterParBindlabel() {
     console.log('BindLabeeeeeel ', this.bindlabel);
     console.log('recherch value  ', this.rechDeno);
    this.grid.search(this.rechDeno);

    this.treeItems = new Array();
    const tmp = this.items;
    switch (this.bindlabel) {
      case 'deno': {
         const sortedArray: any[] = tmp.sort((clt1, clt2) => {
          if (clt1.deno > clt2.deno) {
            return 1;
          }

          if (clt1.deno < clt2.deno) {
            return -1;
          }

          return 0;
        });
        this.treeItems = sortedArray;

      }break;

      case 'nom': {
        const sortedArray: any[] = tmp.sort((clt1, clt2) => {
          if (clt1.nom > clt2.nom) {
            return 1;
          }

          if (clt1.nom < clt2.nom) {
            return -1;
          }

          return 0;
        });
        this.treeItems = sortedArray;
        console.log('recherch nom  ',  this.treeItems);
      }break;

      case 'code': {
        const sortedArray: any[] = tmp.sort((clt1, clt2) => {
          if (clt1.code > clt2.code ) {
            return 1;
          }

          if (clt1.code < clt2.code) {
            return -1;
          }

          return 0;
        });
        this.treeItems = sortedArray;
        console.log('recherch code  ',  this.treeItems);
      }break;



      }
    }

*/



}
