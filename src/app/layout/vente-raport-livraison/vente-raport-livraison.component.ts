import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { ExcelService } from '../services/excel.service';
import {ClientService } from '../services/client.service';
import { Client} from '../services/client';
import {Vendeur1Service} from '../services/vendeur1.service';
import {Vendeur1} from '../services/vendeur1';
import {StockService} from '../services/stock.service';
import {Stock} from '../services/stock';
import {Zone} from '../services/zone';
import {ZoneService} from '../services/zone.service';
import { RecettesService } from '../services/recettes.service';
import { Recettes } from '../services/recettes';
import * as jspdf from 'jspdf';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import {MessageService} from 'primeng/components/common/messageservice';
import {RecettExcel} from '../services/recettExcel';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

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
  selector: 'app-vente-raport-livraison',
  templateUrl: './vente-raport-livraison.component.html',
  styleUrls: ['./vente-raport-livraison.component.scss'],
  providers: [ ExcelService, MessageService]
})

export class VenteRaportLivraisonComponent implements OnInit {
  cliqueaffichernvs: boolean;


  @ViewChild('opp')
  public opp: OverlayPanel;
  msgerror: string;
  readonly: boolean;
  affichegrid: boolean;

  constructor(private clientService: ClientService,
              private vendeurService: Vendeur1Service,
              private stockService: StockService,
              private zoneService: ZoneService,
              private recettesService: RecettesService,
              private steService: SteService ,
              private excelService: ExcelService,
              private messageService: MessageService,
              private config: NgSelectConfig

              ) {
                this.config.notFoundText = 'Aucun élément trouvé';
                this.config.clearAllText = 'Supprimer tous ';
              }
    cliquAfficher: boolean;
   wasInside: boolean;
   listClients: Client [];
   listeVendeurs: Vendeur1[];
   listeArticles: Stock[];
   listeZones: Zone[];
   listeRecettes: Recettes [];
 Rec: RecettExcel = {
    id: '',
    combine: '',
    date: '',
    livrObservat: '',
    bonSort: ''
};
tabexceel: RecettExcel[];


selectedClient:  Client;
selectedVendeur: Vendeur1;
selectedArticle: Stock;
selectedZone: Zone;

  public customAttributes: Object;
  tn: any;
  d1;
  d2;
  dat1: Date;
  dat2: Date;
  op;
  v;
  c ;
  opd;
  vd;
  cd ;
  zn;
  livr;
  listeRecettesAperc;
  listeRecettesExcel;
  ste: Ste;
  societe;
  date;

  recette: RecettExcel = {
            id: '',
            combine: '',
            date: '',
            livrObservat: '',
            bonSort: ''
  };

nouvelleSaisie() {
    this.cliquAfficher = false;
    this.readonly = false;
    this.listeRecettes = new Array();
    this.listeRecettesAperc  = new Array();
    this.listeRecettesExcel = new Array();
    this.affichegrid = false;
    this.cliqueaffichernvs = false;

  }
async  intialisationParametre() {
            this.cliqueaffichernvs = false;
            this.cliquAfficher = false;
            this.dat1 = new Date();
            this.dat2 = new Date();
            this.d1 = new Date().toLocaleTimeString();
            this.d2 = new Date().toLocaleTimeString();
            this.op = '';
            this.v = '';
            this.c = '';
            this.opd = '';
            this.vd = '';
            this.cd = '';
            this.zn = '';
            this.livr = '1';
            this.readonly = false;
  }
 async ngOnInit() {
              this.ChargerClient();
              this.ChargerVendeurs();
              this.ChargerZones();
              this.ChargerArticles();
               //  this.ChargerArticles();
                  this.intialisationParametre();
                    // parametrage du calendrier
                    this.customAttributes = { class: 'customcss' };
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
@HostListener('document:click')
          clickout() {
            if (!this.wasInside) {
              this.messageService.clear();
              if (this.opp !== null && this.opp !== undefined) {
                this.opp.hide();
              }

            }
            this.wasInside = false;
  }
async ChargerClient () {
           await this.clientService.searchClientByDenoStartsWith('')
            .toPromise()
            .then(data => {
               this.listClients = data['_embedded'].clients;
               console.log('liste clients: ', this.listClients );
               console.log('nombre des clients ', this.listClients.length);

            });
    }

public onSearchClients(word: string): Client[] {
console.log('word rech ', word);

 this.clientService.searchClientByDenoStartsWith(word)
  .toPromise()
  .then(data => {
     this.listClients = data['_embedded'].clients;
     console.log('liste clients: ', this.listClients );
     console.log('nombre des clients ', this.listClients.length);

  });
      return  this.listClients;
}

async ChargerVendeurs () {
              await this.vendeurService.getVendeur1sList()
              .toPromise()
              .then(data => {
                this.listeVendeurs = data['_embedded'].vendeur1;
              });
    }

onSearchVendeur(word: string, item: Vendeur1): boolean {
             return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }
async ChargerArticles () {
          await this.stockService
          .getStockList('')
          .toPromise()
          .then(data => {
            this.listeArticles = data['_embedded'].stocks;
          });
    }

public onSearchArticles(word: string): Stock[] {

            this.stockService.getStockList(word)
            .toPromise()
            .then(data => {
              this.listeArticles = data['_embedded'].stocks;
            });
            return  this.listeArticles;
    }

async ChargerZones () {
              await this.zoneService.getZonesList()
                .toPromise()
                .then(data => {
                    this.listeZones = data['_embedded'].zones;
              });
    }
public onSearchZones(word: string, item: Zone): boolean {
         return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }
fermerListClient() {
            this.listClients = new Array();
   }
fermerlisteVendeurs() {
            this.listeVendeurs = new Array();
   }

fermerlisteArticle() {
            this.listeArticles = new Array();
   }
fermerlisteZones() {
            this.listeZones = new Array();
   }
validationChamps() {
            if (this.dat1 === undefined || String(this.dat1) === 'undefined' || this.dat1 === null || String(this.dat1) === 'null' ) {
              this.d1 = '';
            } else {
              this.d1 = this.dat1.toLocaleDateString('en-GB');
            }

            if (this.dat2 === undefined || String(this.dat2) === 'undefined' || this.dat2 === null || String(this.dat2) === 'null' ) {
              this.d2 = '';
            } else {
              this.d2 = this.dat2.toLocaleDateString('en-GB');
            }


            if (this.selectedClient === undefined
                                              || this.selectedClient === null
                                              || String(this.op) === 'null'
                                              || String(this.op) === 'undefined'
                                              || this.op === undefined
                                              || this.op === null ) {
              this.op = '';
              this.opd = '';
            } else {
              this.op = this.selectedClient.code;
              this.opd = this.selectedClient.deno;
            }

            if (this.selectedVendeur === undefined
                                                  || this.selectedVendeur === null
                                                  || String(this.v) === 'null'
                                                  || String(this.v) === 'undefined'
                                                  || this.v === undefined
                                                  || this.v === null
                                                   ) {
              this.v = '';
              this.vd = '';
            } else {
              this.v = this.selectedVendeur.code;
              this.vd = this.selectedVendeur.deno;
            }

            if (this.selectedArticle === undefined
                                                || this.selectedArticle === null
                                                || String(this.c) === 'null'
                                                || String(this.c) === 'undefined'
                                                || this.c === undefined
                                                || this.c === null) {
              this.c = '';
              this.cd = '';
            } else {
              this.c = this.selectedArticle.code;
              this.cd = this.selectedArticle.design;
            }

              if (this.selectedZone === undefined
                                                || this.selectedZone === null
                                                || String(this.zn) === 'null'
                                                || String(this.zn) === 'undefined'
                                                || this.zn === undefined
                                                || this.zn === null) {
                this.zn = '';
              } else {
                this.zn = this.selectedZone.code;
              }
}

async afficher(e) {
 // this.cliqueaffichernvs = true;
  this.wasInside = true;
  this.listeRecettes = new Array();
  this.listeRecettesAperc  = new Array();
  this.listeRecettesExcel = new Array();
  this.readonly = true;
  this.validationChamps();
          try {
            let item: any;
              if (this.livr === '3' || this.livr === '1') {
                      await this.recettesService.getRecRapLivraisonLivrTout(this.d1, this.d2, this.op, this.v, this.c, this.zn, this.livr)
                      .toPromise()
                      .then( data => {
                        this.listeRecettes = data['_embedded'].rapportLivraisons;
                        this.listeRecettesAperc  = data['_embedded'].rapportLivraisons;
                        this.listeRecettesExcel = data['_embedded'].rapportLivraisons;

                              if (this.listeRecettes !== undefined) {
                                                for (item of this.listeRecettes ) {
                                                  if ((this.livr === '3') && (item.bonSort === ''
                                                                                                || item.bonSort === null
                                                                                                || item.bonSort === undefined )
                                                                           && (item.livrObservat === ''
                                                                                                || item.livrObservat === null
                                                                                                ||  item.livrObservat === undefined ) ) {
                                                          item.etat = 'Non livré';
                                                          console.log('etat', item.etat);
                                                  } else {
                                                          item.etat = 'Livré';
                                                          console.log('etat', item.etat);
                                                  }
                                              }

                              }


                      });
              } else {
                 if (this.livr === '2') {
                        await this.recettesService.getRecRapLivraisonNonLivr(this.d1, this.d2, this.op, this.v, this.c, this.zn, this.livr)
                        .toPromise()
                        .then( data => {
                          this.listeRecettes = data['_embedded'].rapportLivraisons;

                          if (this.listeRecettes !== undefined) {
                          for ( item of this.listeRecettes ) {
                            item.etat = 'Non livré';
                          }
                        }
                          this.listeRecettesAperc  = data['_embedded'].rapportLivraisons;
                          this.listeRecettesExcel = data['_embedded'].rapportLivraisons;
                         });
                }
                }

                if (this.listeRecettes === undefined || this.listeRecettes.length === 0 ) {

                          this.msgerror = 'aucune livraison avec ces critères !';
                          this.opp.show(e, document.getElementById('aff'));
                           this.cliquAfficher = false;
                           this.affichegrid = false;
                           this.readonly = false;
                           this.cliqueaffichernvs = false;

                } else {
                  this.cliquAfficher = true;
                  this.affichegrid = true;
                  this.cliqueaffichernvs = true;
                }


        } catch {
              console.log(' methode afficher ');
            }

}

async appercu() {
          this.cliqueaffichernvs = true;
          this.cliquAfficher = true;
          this.readonly = true;
          console.log(this.op);
          // this.validationChamps();
          console.log(this.op);
          console.log(this.opd);
          if (this.listeRecettesAperc === undefined) {

          } else {
            try {
              const doc1 = new jspdf();
                  doc1.setFontSize(12);
                  doc1.setFontStyle('Arial');
                    // recupérer les données de la sociéte
                    await this.steService
                            .getSte()
                            .toPromise()
                            .then(data => {
                              this.ste = data['_embedded'].ste;
                              this.societe = this.ste[0];
                              console.log(this.societe);
                     });
           doc1.text('Société  : ' + this.societe.societe, 10, 20);

           doc1.setFontSize(12);
           doc1.setFontStyle('Arial');
           // récuperer la date et le temps du systeme
           const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
           this.date = new Date().toLocaleDateString('en-GB');


           doc1.text('Tunis, le :  '  + this.date + '  ' + temps, 130, 20);
           doc1.setFontSize(22);
           doc1.setFontStyle('bold');
           doc1.setFontStyle('Arial');
           doc1.text('Liste des livraisons', 70, 30);
           doc1.setFontStyle('Arial');
           doc1.setFontSize(12);
           doc1.text('Du :', 10, 40); doc1.text(this.d1, 20, 40);
           doc1.text('Au :', 60, 40); doc1.text(this.d2, 70, 40);
           doc1.text('Client :', 120, 40); doc1.text(this.opd, 140, 40);
           doc1.text('Vendeur :', 10, 46); doc1.text(this.vd, 30, 46);
           doc1.text('Article :', 120, 46); doc1.text(this.cd, 140, 46);
             // entete du  tableau
             doc1.setFontSize(13);
             doc1.setFontStyle('bold');
             doc1.line(9, 50, 205, 50);
             doc1.setFontSize(13);
             doc1.setFontStyle('bold');
             doc1.text('Pièce', 10, 57);
             doc1.text('Date', 60, 57);
             doc1.text('Observation de livraison', 100, 57);
             doc1.text('Numero de B/S', 170, 57);
             // creer la ligne
             doc1.setFontSize(13);
             doc1.setFontStyle('bold');
             doc1.line(9, 60, 205, 60);


             let y = 65;
             let numPage = 1;
             doc1.setFontSize(10);
             doc1.setFontStyle('Arial');
             for (this.recette of this.listeRecettesAperc) {
               doc1.setFontSize(11);
               doc1.setFontStyle('Arial');
               doc1.text(this.recette.combine, 10, y);
               doc1.text(this.recette.date, 60, y);

               if ( this.recette.livrObservat === null ||  String(this.recette.livrObservat) === 'null') {
                 this.recette.livrObservat = '';
               } else {
                 doc1.text(this.recette.livrObservat, 100, y);
               }

               if (this.recette.bonSort === null || String(this.recette.bonSort) === 'null' ) {
                 this.recette.bonSort = '';
               } else {
                 doc1.text(this.recette.bonSort, 170, y);
               }

               y = y + 7;
               // passer a une nouvelle page
               if (y > 277) {
                 doc1.line(10, y - 3, 200, y - 3, 'FD');
                 doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                 numPage++;
                 doc1.addPage();
                 // entete tableau
                 doc1.setFontStyle('bold');
                 doc1.line(9, 10, 205, 10);
                 doc1.setFontSize(13);
                 doc1.setFontStyle('bold');
                 doc1.text('Pièce', 10, 17);
                 doc1.text('Date', 60, 17);
                 doc1.text('Observation de livraison', 100, 17);
                 doc1.text('Numero de B/S', 170, 17);

                 // creer une ligne
                 doc1.setFontStyle('bold');
                 doc1.line(9, 21, 205, 21);
                 y = 32;
               }
             }
             doc1.line(10, 280, 200, 280, 'FD');
             doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
             window.open(doc1.output('bloburl'), '_blank');


   } catch {
             console.log(' methode apperçu');

           }
  }
  this.cliqueaffichernvs = true;
}


  genererExcel(args): void {
    try {
       if ( this.listeRecettesExcel === undefined) {

       } else {
         const exportExcel = this.listeRecettesExcel.map(
          obj => {
              return {
                  'Pièce' : obj.combine,
                  'Date': obj.date,
                  'Bon de Sortie': obj.bonSort,
                  'Observation de livraison': obj.livrObservat
              };
          }
      );
        this.excelService.exportAsExcelFile(exportExcel, 'Rapport de livraison ' + this.date);
       }
      } catch {
        console.log(' methode genererExcel');

      }

}


}
