import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Vendeur1Service } from '../services/vendeur1.service';
import { ZoneService } from '../services/zone.service';
import { ClientService } from '../services/client.service';
import {RecettesService} from '../services/recettes.service';
import {MouveService} from '../services/mouve.service';
import { ExcelService } from '../services/excel.service';
import { DuplicataComponent } from '../duplicata/duplicata.component';
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
  selector: 'app-bl-en-cours',
  templateUrl: './bl-en-cours.component.html',
  styleUrls: ['./bl-en-cours.component.scss'],
  providers: [  ExcelService]
})
export class BlEnCoursComponent implements OnInit {
  @ViewChild(DuplicataComponent) Duplicata;
  public customAttributes: Object;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  msg = '';
  codeUtils = '';
  tn;
  public sortOptions: object;
  btninit: boolean;
  readonly: boolean;
  selectedVend;
  vendeurs;
  hidden: boolean;
  dateDebut = new Date();
  dateFin = new Date();
  wasInside: boolean;
  selected;
  doubleclick: boolean;
  affichGrid: boolean;
  liste = new Array();
  listVend: any;
  zones: any;
  selectedZone: any;
  clients: any;
  selectedClient;
  rc = new Array('R', 'C');
  selectedRC;
  duplicata: boolean;
  societe: any;
  btnafficher: boolean;
  selectedBL: any;
  detailBLEnCours: any;
  listeMouve: any;
  numeroBL: any;
  disabledduplic: boolean;
  detailBLEnCourscode = '';
  detailBLEnCoursdate = '';
  detailBLEnCoursoperateur = '';
  detailBLEnCoursvendeur = '';
  detailBLEnCoursdenoClt = '';
  detailBLEnCoursref = '';
  detailBLEnCoursvilleClt = '';
  detailBLEnCourscodeTvaClt = '';

  detailBLEnCoursremise: any;
  detailBLEnCoursht: any;
  detailBLEnCoursnet: any;
  detailBLEnCoursbase10: any;
  detailBLEnCoursbase17: any;
  detailBLEnCoursbase29: any;
  displayDupicata = false;
  constructor(
    private excelService: ExcelService,
    private recettesService: RecettesService,
    private mouveService: MouveService,
    private config: NgSelectConfig,
    private vendeur1Service: Vendeur1Service,
    private clientService: ClientService,
    private zoneService: ZoneService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
    this.dateDebut.setDate(1);
    this.dateDebut.setMonth(0);

  }

  nouvelSaisie2() {
    this.doubleclick = true;
  }
  appercu2() {

  }
  annulerSelection() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.op.hide();
    }
  }
  changeDuplicata() {
    if (this.selected[0] === true) {
      this.duplicata = true;
    } else {
      this.duplicata = false;
    }
 console.log('duplicata ', this.duplicata );

  }

  async Doubleclick(e) {
    this.op.hide();
    this.wasInside = true;
    this.displayDupicata = true;
    const selectedRow: any = this.grid.getSelectedRecords()[0];
    this.Duplicata.nature = String(selectedRow.combine).substr(0, 9);
    this.Duplicata.combine = String(selectedRow.combine).substr(9, 14);
    this.Duplicata.hideButtonNvlSaisie = true;
    this.Duplicata.afficher(e);
    this.displayDupicata = true;
  }

  rowSelected() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedBL = selected;
     // this.selectedstkmrq.code = this.selectedstock.code;
    }
  }



  initialiser() {
    this.selected = [];
    this.dateFin = new Date();
    this.dateDebut = new Date(this.dateFin.getFullYear(), 0, 1);
    this.hidden = true;
    this.selectedClient = null;
    this.selectedRC = null;
    this.selectedVend = null;
    this.selectedZone = null;

  }

async excel(e) {
  this.wasInside = true;
  this.op.hide();
  let d1: string;
  let d2: string;
  let d3: string;
  let d4: string;
  let d5: string;
  let d6: string;



   if (this.dateDebut !== null && this.dateDebut !== undefined) {
     d1 = this.dateDebut.toLocaleDateString('en-GB');
   } else {
     d1 = '';
   }

   if (this.dateFin !== null && this.dateFin !== undefined) {
     d2 = this.dateFin.toLocaleDateString('en-GB');
   } else {
     d2 = '';
   }
   if (this.selectedVend !== null && this.selectedVend !== undefined) {
     d3 = this.selectedVend.code;
   } else {
     d3 = '';
   }
   if (this.selectedZone !== null && this.selectedZone !== undefined) {
     d4 = this.selectedZone.code;
   } else {
     d4 = '';
   }

   if (this.selectedClient !== null && this.selectedClient !== undefined) {
     d5 = this.selectedClient.code;
   } else {
     d5 = '';
   }
   if (this.selectedRC !== null && this.selectedRC !== undefined) {
     d6 = this.selectedRC;
   } else {
     d6 = '';
   }

    await this.recettesService.getblEnCours(d1, d2, d3, d4, d5, d6)
    .toPromise()
    .then(data => {
      console.log('bl en cours ', data);
      this.liste = data['_embedded'].blEnCourses;
    });
  try {
    if (this.liste.length === 0) {
      this.affichGrid = false;
      this.msg = 'aucun B/L en cours avec ces critères ';
      this.op.show(e);
      this.readonly = false;
      this.btninit = false;
    } else {
      for (const bl of this.liste) {
        bl.net = Number(bl.net);
      }
      const exportExcel = this.liste;

      this.excelService.exportAsExcelFile(
        exportExcel,
        ' bl en cours non factures : ' + new Date().toLocaleDateString('en-GB')

      );
    }
  } catch {
    console.log(' methode genererExcel');
  }
}



 async afficher(e) {
  this.wasInside = true;
  this.op.hide();
  let d1: string;
  let d2: string;
  let d3: string;
  let d4: string;
  let d5: string;
  let d6: string;



   if (this.dateDebut !== null && this.dateDebut !== undefined) {
     d1 = this.dateDebut.toLocaleDateString('en-GB');
   } else {
     d1 = '';
   }

   if (this.dateFin !== null && this.dateFin !== undefined) {
     d2 = this.dateFin.toLocaleDateString('en-GB');
   } else {
     d2 = '';
   }
   if (this.selectedVend !== null && this.selectedVend !== undefined) {
     d3 = this.selectedVend.code;
   } else {
     d3 = '';
   }
   if (this.selectedZone !== null && this.selectedZone !== undefined) {
     d4 = this.selectedZone.code;
   } else {
     d4 = '';
   }

   if (this.selectedClient !== null && this.selectedClient !== undefined) {
     d5 = this.selectedClient.code;
   } else {
     d5 = '';
   }
   if (this.selectedRC !== null && this.selectedRC !== undefined) {
     d6 = this.selectedRC;
   } else {
     d6 = '';
   }

    await this.recettesService.getblEnCours(d1, d2, d3, d4, d5, d6)
    .toPromise()
    .then(data => {
      console.log('bl en cours ', data);
      this.liste = data['_embedded'].blEnCourses;
    });


    if (this.liste.length > 0 && this.liste.length <= 500) {
      for (const bl of this.liste) {
        bl.net = Number(bl.net);
      //  bl.date = new Date(bl.date );
      }
      this.affichGrid = true;
      this.btnafficher = true;
      this.readonly = true;
      this.btninit = true;

    } else {

      if (this.liste.length >  500) {
        this.affichGrid = false;
        this.msg = 'Veuillez raffiner les  critères de recherche !! ';
        this.op.show(e, document.getElementById('affichBtn'));
        this.readonly = false;
        this.btninit = false;
      } else {
        this.affichGrid = false;
        this.msg = 'aucun B/L en cours avec ces critères ';
        this.op.show(e, document.getElementById('affichBtn'));
        this.readonly = false;
        this.btninit = false;
      }
    }

 }
 async appercu(e) {
  this.wasInside = true;
  this.op.hide();
  try {
    let d1: string;
    let d2: string;
    let d3: string;
    let d4: string;
    let d5: string;
    let d6: string;

          if (this.dateDebut !== null && this.dateDebut !== undefined) {
            d1 = this.dateDebut.toLocaleDateString('en-GB');
          } else {
            d1 = '';
          }

          if (this.dateFin !== null && this.dateFin !== undefined) {
            d2 = this.dateFin.toLocaleDateString('en-GB');
          } else {
            d2 = '';
          }
          if (this.selectedVend !== null && this.selectedVend !== undefined) {
            d3 = this.selectedVend.code;
          } else {
            d3 = '';
          }
          if (this.selectedZone !== null && this.selectedZone !== undefined) {
            d4 = this.selectedZone.code;
          } else {
            d4 = '';
          }

          if (this.selectedClient !== null && this.selectedClient !== undefined) {
            d5 = this.selectedClient.code;
          } else {
            d5 = '';
          }
          if (this.selectedRC !== null && this.selectedRC !== undefined) {
            d6 = this.selectedRC;
          } else {
            d6 = '';
          }

      await this.recettesService.getblEnCours(d1, d2, d3, d4, d5, d6)
      .toPromise()
      .then(data => {
        console.log('bl en cours ', data);
        this.liste = data['_embedded'].blEnCourses;
      });



      if (this.liste.length > 0) {
        let sommeMontant = 0;
        for (const obj of this.liste) {
                sommeMontant = sommeMontant + Number(obj.net);
        }


      //   bl.net = Number(bl.net).toFixed(3);

            const doc1 = new jspdf();
                doc1.setFontSize(12);
                doc1.setFontStyle('Arial');
         // recupérer les données de la sociéte

                            // this.societe = globals.societe;
                            this.societe = globals.societe;
                            console.log(this.societe);

         doc1.text('Société  : ' + this.societe, 10, 20);
         doc1.setFontSize(22);
         doc1.setFontStyle('Arial');
         doc1.setFontStyle('bold');
         doc1.setTextColor(0, 51, 153);
         doc1.text('Liste des B/L non encore facturés ', 50 , 32);

         doc1.setFontSize(12);
         doc1.setFontStyle('Arial');
         doc1.setTextColor(48, 48, 48);
         const dateimpression = new Date().toLocaleDateString('en-GB');
         doc1.text('Tunis le : ' + dateimpression, 166 , 32);

         doc1.setFontStyle('bold');
         // doc1.text('Date d\'échéance : ' + this.datefin1.toLocaleDateString('en-GB'), 10, 40);

           doc1.text('Du : ' , 10, 40);
           doc1.text( 'Au : ' , 43, 40);
           doc1.setFontStyle('Arial');
           doc1.text(this.dateDebut.toLocaleDateString('en-GB'), 20, 40);
           doc1.text(  this.dateFin.toLocaleDateString('en-GB') , 53, 40);

           doc1.text('Vendeur : ', 78, 40);
         if (this.selectedVend !== null && this.selectedVend !== undefined) {
           doc1.setFontStyle('bold');

           doc1.setFontStyle('Arial');
           doc1.text( this.selectedVend.deno, 97, 40);
         }

         doc1.text('Client : ' , 10, 49);
         if (this.selectedClient !== null && this.selectedClient !== undefined) {
           doc1.setFontStyle('bold');

           doc1.setFontStyle('Arial');
           doc1.text( this.selectedClient.deno, 28, 49);
         }
         doc1.text('Zone : ', 100, 49);
         if (this.selectedZone !== null && this.selectedZone !== undefined) {
           doc1.setFontStyle('bold');

           doc1.setFontStyle('Arial');
           doc1.text( this.selectedZone.deno, 115, 49);
         }
         doc1.text('Type Commande : ', 160, 49);
         if (this.selectedRC !== null && this.selectedRC !== undefined) {
           doc1.setFontStyle('bold');
           doc1.setFontStyle('Arial');
           doc1.text(this.selectedRC, 197, 49);
         }



          let  numPage = 1;
           doc1.setFontSize(12);
           doc1.setFontStyle('Arial');
           let y = 54;
             // entete du  tableau
                          doc1.setFontStyle('bold');
                          doc1.setLineWidth(0.15);
                          doc1.line(9, y, 208, y);
                           y = y + 6;

                        doc1.setFontSize(12);
                        doc1.setFontStyle('bold');
                        doc1.text('Code Client', 10, y);
                        doc1.text('Nom Client', 35, y);
                        doc1.text('Numéro B/L ', 85, y);
                        doc1.text('Date', 120, y);
                        doc1.text('B.Commande', 145, y);
                        doc1.text('Montant TTC', 180, y);

                        y = y + 3;
                        // creer une ligne
                        doc1.setFontStyle('bold');
                        doc1.setLineWidth(0.15);
                        doc1.line(9, y, 208, y);
                        y = y + 6;

                 doc1.setFontSize(10);
                 doc1.setFontStyle('Arial');
                for (const item of this.liste) {
                  doc1.text(item.operateur, 10, y);
                  doc1.text(item.denoClt.substring(0, 19), 36, y);
                  doc1.text(item.combine, 85, y);
                  doc1.text(item.date, 120, y);
                  if (item.ref === null) {
                    item.ref = '';
                    }
                  doc1.text(item.ref, 145, y);

                  if (item.net === null) {
                    item.net = '';
                    } else {
                      item.net =  Number(item.net).toFixed(3) ;
                    }
                  doc1.text(item.net, 205, y, 'right');

                  y = y + 7;





            // passer a une nouvelle page
            if (y > 277) {
                      doc1.setLineWidth(0.15);
                      doc1.line(5, 285, 206, 285, 'FD');
                      doc1.setFontStyle('bold');
                      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
                      numPage++;
                      doc1.addPage();
                      y = 15;
                      doc1.setFontStyle('bold');
                      doc1.setLineWidth(0.15);
                      doc1.line(9, y, 208, y);
                       y = y + 6;

                    doc1.setFontSize(12);
                    doc1.setFontStyle('bold');
                    doc1.text('Code Client', 10, y);
                    doc1.text('Nom Client', 35, y);
                    doc1.text('Numéro B/L ', 85, y);
                    doc1.text('Date', 120, y);
                    doc1.text('B.Commande', 145, y);
                    doc1.text('Montant TTC', 180, y);
                    y = y + 3;
                    doc1.setLineWidth(0.15);
                    doc1.line(9, y, 208, y);
                    y = y + 5;
                    doc1.setFontSize(10);
                    doc1.setFontStyle('Arial');
                 } else {

                 }
               }

               y = y + 5;
               doc1.setLineWidth(0.15);
               doc1.line(5, y, 206, y, 'FD');
               doc1.setFontStyle('bold');
               y = y + 5;
               doc1.setFontSize(14);
               doc1.text('TOTAL TTC :', 140, y);
               doc1.text(sommeMontant.toFixed(3), 205, y, 'right');
             //  sommeMontant
             doc1.setFontSize(10);
               doc1.setLineWidth(0.15);
               doc1.line(5, 285, 206, 285, 'FD');
               doc1.setFontStyle('bold');
               doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

            window.open(doc1.output('bloburl'), '_blank');





      } else {

        this.affichGrid = false;
        this.msg = 'aucun B/L en cours avec ces critères ';
        this.op.show(e);
        this.readonly = false;
        this.btninit = false;
      }


} catch {
      console.log(' methode apperçu');

    }

}
  async chargerClient() {
    await this.clientService
      .getClientListOrdinairesOrderByDeno()
      .toPromise()
      .then((data) => {
       this.clients = data['_embedded'].clients;
      });
  }
  public onSearchClient(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
 }
  async chargerZone() {
    // charger les zones
    await this.zoneService
      .getZoneByDeno()
      .toPromise()
      .then((data) => {
        this.zones = data['_embedded'].zones;
      });
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }
  public onSearchVendeur(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async ChargerVendeurs() {
    await this.vendeur1Service
      .getVendeur1ByDeno()
      .toPromise()
      .then((data) => {
        console.log(data);

        this.listVend = data['_embedded'].vendeur1;
      });
  }

  changeDate() {
    console.log('selected date ', this.selected);
    if (this.selected[0] === true) {
      this.hidden = false;
    } else {
      this.hidden = true;
      this.dateDebut = null;
      this.dateFin = null;
    }
  }
  nouvelSaisie() {
    this.btninit = false;
    this.readonly = false;
    this.affichGrid = false;
    this.btnafficher = false;
  }

  async ngOnInit() {
    this.displayDupicata = false;
    this.customAttributes = { class: 'customcss' };
    this.codeUtils = localStorage.getItem('login');
    console.log('User ', this.codeUtils);
    this.sortOptions = {
      columns: [{ field: 'operateur', direction: 'Descending'}
    ],
    };
    this.doubleclick = true;
    this.btnafficher = false;
    this.readonly = false;
    this.btninit = false;

     this.chargerClient();
    this.chargerZone();
    this.ChargerVendeurs();
    this.affichGrid = false;
    this.hidden = true;
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
  }
}
