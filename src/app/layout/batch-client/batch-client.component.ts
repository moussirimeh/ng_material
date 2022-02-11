import { Component, OnInit, Input , ViewChild, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';

import { NgSelectConfig } from '@ng-select/ng-select';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import { ZoneService } from '../services/zone.service';
import { RecouvService } from '../services/recouv.service';
import { BrouService } from '../services/brou.service';
import {
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
  RowSelectEventArgs
} from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { globals } from 'src/environments/environment';

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
  selector: 'app-batch-client',
  templateUrl: './batch-client.component.html',
  styleUrls: ['./batch-client.component.scss']
})
export class BatchClientComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  tn;
  datefin1;
  msgerror: string;
  public customAttributes: Object;
 visibleBtnAfficher: boolean;
 liste = new  Array();
 datedebut = new Date(new Date().getFullYear(), 0, 1);
 datefin = new Date();
  selectedRec: any;
  codeRec: string;
  selectedZone: any;
  codeZn: string;
  readonly: boolean;
  listeZone = new Array();
  listeRec = new Array();
  wasInside: boolean;

  totDebit = '0.000';
  totCredit = '0.000';
  solde = '0.000';
  societe: string;
  liste_triée: any[];
  sortedArray: any[];
  nomModule: string;
  listeBatch: any[];
  listePdf: any[];

  constructor(  private config: NgSelectConfig,
                private recouvService: RecouvService,
                private zoneService:  ZoneService,
                private brouService: BrouService ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';

  }
  // event listener to click
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }
// recherche item dans ng-select
  public onSearchItem(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

 async ngOnInit() {
  this.nomModule = globals.selectedMenu;
  console.log('nom Module ', this.nomModule);

  this.totDebit = '0.000';
  this.totCredit = '0.000';
  this.solde = '0.000';
    this.visibleBtnAfficher = true;
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
    this.datedebut = new Date(new Date().getFullYear(), 0, 1);
// chargement des zones
    await this.zoneService
    .getZonesList()
    .toPromise()
    .then((data) => {
      this.listeZone = data['_embedded'].zones;
    })
     .catch(data => {
      console.log('erreur lors de chargement des zones' , data);
    })
    .finally(() => {
      console.log('chargement des zones est terminé');

    });
   // chargement des des recouvreurs
    await this.recouvService
      .getRecouvsList()
      .toPromise()
      .then((data) => {
        this.listeRec = data['_embedded'].recouvs;
      })
      .catch(data => {
        console.log('erreur lors de chargement des recouvreurs', data);
      })
      .finally(() => {
        console.log('chargement des recouvreurs est terminé');

      });
  }

  changeRec() {

    if (this.selectedRec === null || this.selectedRec === undefined) {
      this.codeRec = '';
      console.log('code rec', this.codeRec + '...');

       } else {
        this.codeRec = this.selectedRec.code;
        console.log('code rec', this.codeRec);
    }
}

changeZone() {

  if (this.selectedZone === null || this.selectedZone === undefined) {
    this.codeZn = '';
    console.log('code zn', this.codeZn + '...');

     } else {
      this.codeZn = this.selectedZone.code;
      console.log('code zn', this.codeZn);
  }
}


  init() {
    this.datefin = new Date();
    this.datedebut = new Date(new Date().getFullYear(), 0, 1);
    this.selectedRec = null;
    this.selectedZone = null;
    this.codeRec = '';
    this.codeZn = '';
    this.totDebit = '0.000';
    this.totCredit = '0.000';
    this.solde = '0.000';


  }
 async afficher(e) {
    this.wasInside = true;
    this.totDebit = '0.000';
    this.totCredit = '0.000';
    this.solde = '0.000';
    if ((this.datedebut !== null && this.datedebut !== undefined) && (this.datefin !== null && this.datefin !== undefined)) {
      const d1 = this.datedebut.toLocaleDateString('en-GB');
      const d2 = this.datefin.toLocaleDateString('en-GB');
      if (this.codeZn === undefined || this.codeZn === null) {
        this.codeZn = '';
      }
      if (this.codeRec === undefined || this.codeRec === null) {
        this.codeRec = '';
      }
      this.liste = new Array();
      //  chargement des batch clients
      if (this.nomModule === 'Batch Client Cont') {
        await this.brouService.getBatchClientCont(d1, d2, this.codeZn, this.codeRec)
        .toPromise()
        .then(data => {
          console.log('liste batch client cont ', data['_embedded'].batchClients);
          this.liste =  data['_embedded'].batchClients;
        })
        .catch(data => {
          console.log('erreur lors de chargement des engagements client cont (batch client) cont' , data);
        })
        .finally(() => {
          console.log('chargement des engagements client cont (batch client cont) est terminé');
        });


      } else {
        await this.brouService.getBatchClient(d1, d2, this.codeZn, this.codeRec)
        .toPromise()
        .then(data => {
          console.log('liste batch client ', data['_embedded'].batchClients);
          this.liste =  data['_embedded'].batchClients;
        })
        .catch(data => {
          console.log('erreur lors de chargement des engagements client (batch client)' , data);
        })
        .finally(() => {
          console.log('chargement des engagements client (batch client)est terminé');
        });

      }
      this.listeBatch = new Array();

      if (this.liste.length === 0 ) {
          this.msgerror = 'Aucun engagement trouvé avec ces critères !!';
          this.op.show(e, document.getElementById('bafich'));
          this.visibleBtnAfficher = true;

      } else {
        let totDebit = 0;
        let totCredit = 0;
        for (const obj of this.liste) {
          if (obj.sens === 'D') {
            obj.tel = Number(obj.montant);
           totDebit = totDebit + Number(obj.montant);
            obj.montant = 0;
          } else {
            obj.tel = 0;
            obj.montant = Number(obj.montant);
            totCredit = totCredit + Number(obj.montant);
          }

        }
        const s = totDebit -  totCredit;
        this.solde = s.toFixed(3);



        this.visibleBtnAfficher = false;
        this.readonly = true;

      }

    }


  }

 NouvelleSaisie() {
    this.visibleBtnAfficher = true;
    this.readonly = false;

  }

  async visualiser(e) {
    this.listePdf = new Array() ;



      const d1 = this.datedebut.toLocaleDateString('en-GB');
      const d2 = this.datefin.toLocaleDateString('en-GB');
      if (this.codeZn === undefined || this.codeZn === null) {
        this.codeZn = '';
      }
      if (this.codeRec === undefined || this.codeRec === null) {
        this.codeRec = '';
      }



    if (this.nomModule === 'Batch Client Cont') {
      await this.brouService.getBatchClientCont(d1, d2, this.codeZn, this.codeRec)
      .toPromise()
      .then(data => {
        console.log('liste batch client cont ', data['_embedded'].batchClients);
        this.listePdf  =  data['_embedded'].batchClients;
      })
      .catch(data => {
        console.log('erreur lors de chargement des engagements client cont (batch client) cont' , data);
      })
      .finally(() => {
        console.log('chargement des engagements client cont (batch client cont) est terminé');
      });


    } else {
      await this.brouService.getBatchClient(d1, d2, this.codeZn, this.codeRec)
      .toPromise()
      .then(data => {
        console.log('liste batch client ', data['_embedded'].batchClients);
        this.listePdf  =  data['_embedded'].batchClients;
      })
      .catch(data => {
        console.log('erreur lors de chargement des engagements client (batch client)' , data);
      })
      .finally(() => {
        console.log('chargement des engagements client (batch client)est terminé');
      });

    }
    if (this.listePdf.length === 0 ) {
      this.msgerror = 'Aucun engagement trouvé avec ces critères !!';
      this.op.show(e);
      this.visibleBtnAfficher = true;
  } else {
    let totDebit = 0;
    let totCredit = 0;
    for (const obj of this.listePdf) {
      if (obj.sens === 'D') {
       totDebit = totDebit + Number(obj.montant);
      } else {
        totCredit = totCredit + Number(obj.montant);
      }
    }
    const s = totDebit -  totCredit;
    this.solde = s.toFixed(3);
    this.totCredit = totCredit.toFixed(3);
    this.totDebit = totDebit.toFixed(3);
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
       this.societe = globals.societe;
       /*if (globals.societe !== null && globals.societe !== undefined) {
        this.societe = globals.societe;
       }*/

      doc1.text('SOCIETE...: ' + this.societe, 10, 20);
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      doc1.setTextColor(48, 48, 48);
      const date = new Date();
      doc1.text('Tunis, le ' + date.toLocaleDateString('en-GB') , 160, 25);


      doc1.setFontSize(20);
      doc1.setFontStyle('bold');
     // doc1.setTextColor(0, 51, 153);
     if (this.nomModule === 'Batch Client Cont') {
      doc1.text('Engagements des clients contentieux' , 50, 33);
     } else {
      doc1.text('Engagements des clients' , 70, 33);
     }



      // les critères de recherche
      doc1.setFontSize(12);
      doc1.setFontStyle('bold');
    //  doc1.setTextColor(48, 48, 48);
    doc1.text('Zone :'  , 10, 43);
    doc1.setFontStyle('Arial');
    let zn = '';
    if (this.selectedZone !== null && this.selectedZone !== undefined) {
    zn = this.selectedZone.deno;
    }
     doc1.text( zn , 40, 43);
     doc1.setFontStyle('bold');
    doc1.text('Recouvreur :'  , 10, 48);
    let rec = '';
    if (this.selectedRec !== null && this.selectedRec !== undefined) {
    rec = this.selectedRec.deno;
    }
    doc1.setFontStyle('Arial'); doc1.text( rec, 40, 48);


    doc1.setFontStyle('bold');
      doc1.text('Période du : ' + this.datedebut.toLocaleDateString('en-GB') , 10, 55);
      doc1.text('au : ' + this.datefin.toLocaleDateString('en-GB') , 60, 55);




             // entete du  tableau



             let y = 60;

             let numPage = 1;





             let j = 0;
           while (j < this.listePdf .length) {
              doc1.setFontSize(60);
              doc1.setFontStyle('bold');
              doc1.setLineWidth(0.3);
              doc1.line(9, y, 206, y);
              y = y + 5;
              doc1.setFontSize(10);
              doc1.setFontStyle('bold'); doc1.text('Client :', 10, y);
              doc1.setFontStyle('Arial'); doc1.text(this.listePdf [j].compte, 26, y); doc1.text(this.listePdf [j].deno, 41, y);
             // doc1.setFontStyle('bold'); doc1.text('Adresse : ', 96, y);
            //  doc1.setFontStyle('Arial'); doc1.text(this.listePdf [j].adresse, 110, y);
              doc1.setFontStyle('bold'); doc1.text('Tel : ', 145, y);

              doc1.setFontStyle('Arial');
               if (this.listePdf [j].tel !== null) {doc1.text(this.listePdf [j].tel, 154, y); } else {
                doc1.text('', 154, y);
               }
               doc1.setFontStyle('bold'); doc1.text('Reg : ', 175, y);
               doc1.setFontStyle('Arial');
               if (this.listePdf [j].reg !== null) {doc1.text(this.listePdf [j].reg, 185, y); } else {
                doc1.text('', 185, y);
               }


              y = y + 5;
              doc1.setFontStyle('bold'); doc1.setFontSize(10);
                                         doc1.text('Date :', 10, y);
                                         doc1.text('Pièce :', 33, y);
                                         doc1.text('Numero :', 58, y);
                                         doc1.text('Mt Débit :', 88, y);
                                         doc1.text('Mt Crédit :', 120, y);
                                         doc1.text('Observation :', 150, y);

              y = y + 5;
              let sommDeb = 0;
              let sommCred = 0;
              let i = j;
              while (i < this.listePdf .length  && this.listePdf[j].compte === this.listePdf[i].compte) {
                if (y > 270) {
                  doc1.setLineWidth(0.2);
                  doc1.line(10, 282, 200, 282, 'FD');
                  doc1.setFontStyle('Arial');
                  doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                  numPage++;
                  doc1.addPage();
                  y = 17;
                 } else {
                doc1.setFontStyle('Arial');
                doc1.setFontSize(10);
              //  console.log('item piece numero ', this.listePdf [i].numero);
              if (this.listePdf [i].date !== null && this.listePdf [i].date !== undefined ) {
                doc1.text(this.listePdf [i].date, 10, y);
                } else {
                  doc1.text('', 10, y);
                }


                if (this.listePdf [i].piece !== null && this.listePdf [i].piece !== undefined ) {
                doc1.text(this.listePdf [i].piece, 33, y);
                } else {
                  doc1.text('', 33, y);
                }
                if (this.listePdf [i].numero !== null && this.listePdf [i].numero !== undefined ) {
                  doc1.text(this.listePdf [i].numero, 60, y);
                } else {
                  doc1.text('', 60, y);
                }

                if (this.listePdf [i].sens === 'D') {
                  sommDeb = sommDeb + Number(this.listePdf[i].montant);
                  const deb = Number(this.listePdf[i].montant).toFixed(3);
                 doc1.text(deb, 104, y, 'right');
                } else {
                  const d = '0.000';
                  doc1.text(d, 104, y, 'right');
                }
               if (this.listePdf [i].sens === 'C') {
                sommCred = sommCred + Number(this.listePdf[i].montant);
                 const cred = Number(this.listePdf[i].montant).toFixed(3);
                doc1.text(cred, 137, y, 'right');
               } else {
                 const c = '0.000';
                 doc1.text(c, 137, y, 'right');
               }
                if (this.listePdf [i].libelle !== null && this.listePdf [i].libelle !== undefined ) {
                  doc1.text(this.listePdf [i].libelle, 151, y);
                } else {
                  doc1.text('', 151, y);
                }
                y = y + 7;
                i++;
              }

               }

               doc1.setFontStyle('bold'); doc1.setFontSize(11);
               doc1.text('Totaux :', 10, y);
               doc1.text(sommDeb.toFixed(3), 104, y, 'right');
               doc1.text(sommCred.toFixed(3), 137, y, 'right');
                const solde = Number(sommDeb) - Number(sommCred);
                doc1.text(solde.toFixed(3), 198, y, 'right');
               y = y + 5;



               // i++;
                j = i;


                if (y > 270) {
                  doc1.setLineWidth(0.2);
                  doc1.line(10, 282, 200, 282, 'FD');
                  doc1.setFontStyle('Arial');
                  doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                  numPage++;
                  doc1.addPage();
                  y = 17;
                 }
              }
           //   y = y + 5;
              doc1.setFontSize(60);
              doc1.setFontStyle('bold');
              doc1.setLineWidth(0.3);
              doc1.line(9, y, 206, y);
              y = y + 5;
              if (y > 270) {
                doc1.setLineWidth(0.2);
                doc1.line(10, 282, 200, 282, 'FD');
                doc1.setFontStyle('Arial');
                doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                numPage++;
                doc1.addPage();
                y = 17;
               }
              doc1.setFontStyle('bold'); doc1.setFontSize(11);
              doc1.text('Total Débit :', 10, y);
              doc1.setFontStyle('Arial');
              doc1.text(this.totDebit, 70, y, 'right');
              y = y + 7;
              if (y > 270) {
                doc1.setLineWidth(0.2);
                doc1.line(10, 282, 200, 282, 'FD');
                doc1.setFontStyle('Arial');
                doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                numPage++;
                doc1.addPage();
                y = 17;
               }
              doc1.setFontStyle('bold'); doc1.setFontSize(11);
              doc1.text('Total Crédit :', 10, y);
              doc1.setFontStyle('Arial');
              doc1.text(this.totCredit, 70, y, 'right');

              y = y + 7;
              if (y > 270) {
                doc1.setLineWidth(0.2);
                doc1.line(10, 282, 200, 282, 'FD');
                doc1.setFontStyle('Arial');
                doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                numPage++;
                doc1.addPage();
                y = 17;
               }
              doc1.setFontStyle('bold'); doc1.setFontSize(11);
              doc1.text('Total Créance :', 10, y);
              doc1.setFontStyle('Arial');
              doc1.text(this.solde, 70, y, 'right');
              if (y > 270) {
                doc1.setLineWidth(0.2);
                doc1.line(10, 282, 200, 282, 'FD');
                doc1.setFontStyle('Arial');
                doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                numPage++;
                doc1.addPage();
                y = 17;
               }
              doc1.setLineWidth(0.2);
              doc1.setFontSize(10);
              doc1.setFontStyle('Arial');
             doc1.line(10, 280, 205, 280, 'FD');
             doc1.setFontStyle('Arial');
             doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
             window.open(doc1.output('bloburl'), '_blank');

            }

  }

}
