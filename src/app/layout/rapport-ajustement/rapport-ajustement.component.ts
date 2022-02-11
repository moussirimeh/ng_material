import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import {StockService} from '../services/stock.service';
import {MouveService} from '../services/mouve.service';
import {Stock} from '../services/stock';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { SteService } from '../services/ste.service';

import {
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
  RowSelectEventArgs
} from '@syncfusion/ej2-angular-grids';
import * as jspdf from 'jspdf';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ExcelService } from '../services/excel.service';
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
  selector: 'app-rapport-ajustement',
  templateUrl: './rapport-ajustement.component.html',
  styleUrls: ['./rapport-ajustement.component.scss'],
  providers: [ ExcelService]
})
export class RapportAjustementComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('opp')
  public opp: OverlayPanel;
  msgerror: string;
  afficherbtn: boolean;
  readonly: boolean;
  public customAttributes: Object;
  tn: any;
  dat1: Date;
  dat2 = new Date();
  listRef = new Array();
  selectedRef;
  affichegrid: boolean;
  liste;
  codeArtcl: any;
  btnNouvelSaisie: boolean;
  ste: any;
  societe: any;
  wasInside: any;
  listes: any;

  constructor( private config: NgSelectConfig,
               private stockService: StockService,
               private mouveService: MouveService,
               private steService: SteService,
               private excelService: ExcelService ) {
                this.config.notFoundText = 'Aucun élément trouvé';
                this.config.clearAllText = 'Supprimer tous ';
                }

async ChargerArticles() {
  if (this.listRef.length === 0 ) {
    this.listes = new Array();
                  await this.stockService
                  .getStockList('')
                  .toPromise()
                  .then(data => {
                    this.listRef = data['_embedded'].stocks;
                    this.listes = data['_embedded'].stocks;
                  });
       } else {
        this.listRef = this.listes;
       }
  }


  public onSearchItem(word: string, item: any): boolean {

      return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
    }

public onSearchArticles(word: string): Stock[] {

                    this.stockService.getStockList(word)
                    .toPromise()
                    .then(data => {
                      this.listRef = data['_embedded'].stocks;
                    });
                    return  this.listRef;
            }

changearticle() {
        if (this.selectedRef === null || this.selectedRef === undefined) {
          this.codeArtcl = '';
          console.log('code artcl', this.codeArtcl + '...');

           } else {
            this.codeArtcl = this.selectedRef.code;
            console.log('code artcl', this.codeArtcl);
        }
}

async visualiser() {
  this.readonly = true;
  // creer le document pdf

    const doc1 = new jspdf();
    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');
    await this.steService.getSte()
              .toPromise()
              .then(data => {
                  this.ste = data['_embedded'].ste;
                  this.societe = this.ste[0];

                     });
    doc1.text('SOCIETE...: ' + this.societe.societe , 10, 20);
    doc1.setFontSize(12);
    doc1.setFontStyle('Arial');
    doc1.setTextColor(48, 48, 48);
    const date = new Date();
    doc1.text('Tunis, le ' + date.toLocaleDateString('en-GB') , 160, 25);


    doc1.setFontSize(18);
    doc1.setFontStyle('bold');
    doc1.setTextColor(0, 51, 153);
    doc1.setFontStyle('Arial');
    doc1.text('Rapport des Ajustements du Stock' , 70, 35);


           // entete du  tableau
           doc1.setFontSize(72);
           doc1.setFontStyle('bold');
           doc1.setLineWidth(0.5);
           doc1.line(9, 40, 206, 40);

           doc1.setFontStyle('bold');

           doc1.setFontSize(11);
           doc1.setFontStyle('Arial');
           doc1.setTextColor(48, 48, 48);
           doc1.text('Numéro'  , 11, 45);
           doc1.text('Date'  , 41, 45);
           doc1.text('Code'  , 65, 45) ;
           doc1.text('Désignation'  , 100, 45);
           doc1.text('Quantité'  , 140, 45);
           doc1.text('Justification'  , 160, 45);

           doc1.setFontSize(72);
           doc1.setFontStyle('bold');
           doc1.setLineWidth(0.5);
           doc1.line(9, 50, 206, 50);
           doc1.setFontSize(13);
           doc1.setFontStyle('bold');

           let y = 55;
           let numPage = 1;
           doc1.setFontSize(10);
           doc1.setFontStyle('Arial');
           for (const bs of this.liste) {
            doc1.setFontSize(9);
            doc1.setFontStyle('Arial');
            doc1.text(bs.numero  , 11, y);
            if (bs.date === null ) {
              bs.date = '';
            }
            doc1.text(bs.date  , 42, y) ;
            if (bs.code === null ) {
              bs.code = '';
            }
            doc1.text(bs.code  , 66, y);
            if (bs.design === null ) {
              bs.design = '';
            }
            doc1.text(bs.design.substring(0, 19)  , 101, y);
            if (bs.quantite === null ) {
              bs.quantite = '';
            }
            doc1.text(bs.quantite  , 141, y);

            if (bs.sortieLib === null ) {
              bs.sortieLib = '';
            }
            doc1.text(bs.sortieLib.substring(0, 20)  , 161, y);
            y = y + 7;

             // passer a une nouvelle page
             if (y > 277) {
              doc1.line(10, y - 3, 200, y - 3, 'FD');
              doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
              numPage++;
              doc1.addPage();
              // entete tableau
              doc1.setFontStyle('bold');
              doc1.setLineWidth(0.5);
              doc1.line(9, 10, 205, 10);

              doc1.setFontSize(10);



           doc1.setFontSize(11);
           doc1.setFontStyle('Arial');
           doc1.setTextColor(48, 48, 48);
           doc1.text('Numéro'  , 11, 17);
           doc1.text('Date'  , 41, 17);
           doc1.text('Code'  , 65, 17) ;
           doc1.text('Désignation'  , 100, 17);
           doc1.text('Quantité'  , 140, 17);
           doc1.text('Justification'  , 160, 17);
              // creer la ligne
           doc1.setLineWidth(0.5);
           doc1.setFontStyle('bold');
           doc1.line(9, 20, 205, 20);
              y = 25;
            }

           }

           doc1.line(10, 280, 205, 280, 'FD');
           doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
           window.open(doc1.output('bloburl'), '_blank');



}







genererExcel(): void {
  this.readonly = true;
  try {
     if ( this.liste === undefined ) {

     } else {

       const exportExcel = this.liste.map(
        obj => {
            return {
                'Code mouvement' : obj.numero,
                'Date': obj.date,
                'Référence': obj.code,
                'Désignation': obj.design,
                'Quantité': obj.quantite,
                'Argumentation': obj.sortieLib

            };
        }
    );
      this.excelService.exportAsExcelFile(exportExcel, 'Ajustement_rapport_' + this.dat2.toLocaleDateString('en-GB'));
     }
    } catch {
      console.log(' methode genererExcel');

    }
  }


  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      if (this.opp !== null && this.opp !== undefined) {
        this.opp.hide();
      }

    }
    this.wasInside = false;
}

async afficher(e) {
      this.wasInside = true;
      if (this.dat1 === null) {
      } else {
        const date1 = this.dat1.toLocaleDateString('en-GB');
        if (this.dat2 === null) {
      } else {
        const date2 = this.dat2.toLocaleDateString('en-GB');
        await this.mouveService.rapportAjustements(date1, date2, this.codeArtcl)
        .toPromise()
        .then(data => {
          this.liste = data['_embedded'].rapportAjustements;
          console.log('ajustement', this.liste);

        });
      }
      if (this.liste.length > 0) {
        for (const obj of this.liste ) {

          if (obj.sens === 'C') {
            obj.quantite = '-' + obj.quantite;
          }
        }
        this.affichegrid = true;
        this.btnNouvelSaisie = true;
        this.readonly = true;
      } else {
        this.msgerror = 'aucun ajustement avec ces critères !';
                          this.opp.show(e, document.getElementById('btnaffch'));

      }

}
}

  async ngOnInit() {
    this.selectedRef = null;
    this.codeArtcl = '';
    this.btnNouvelSaisie = false;
    this.listRef = new Array();
    this.affichegrid = false;
    this.customAttributes = { class: 'customcss' };


/*
    await this.stockService
    .getStockOrderByCode()
    .toPromise()
    .then(data => {
      this.listRef = data['_embedded'].stocks;
    });

*/
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

    this.dat1 = new Date(new Date().getFullYear(), 0, 1);
  }

  nouvelleSaisie() {
    this.readonly = false;
    this.affichegrid = false;
    this.btnNouvelSaisie = false;
}
}
