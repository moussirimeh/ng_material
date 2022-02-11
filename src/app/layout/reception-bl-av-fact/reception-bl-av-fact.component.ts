import { Component, OnInit, ViewChild, HostListener  } from '@angular/core';
import { GridComponent, RowSelectEventArgs, EditSettingsModel  } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import * as jspdf from 'jspdf';
import {RecettesService} from '../services/recettes.service';
import { Recettes } from '../services/recettes';
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
import {
  ExcelExportProperties,
  ToolbarService,
  ToolbarItems,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-reception-bl-av-fact',
  templateUrl: './reception-bl-av-fact.component.html',
  styleUrls: ['./reception-bl-av-fact.component.scss'],
  providers: [DatePipe, ExcelService, ToolbarService]
})
export class ReceptionBlAvFactComponent implements OnInit {

  constructor(private config: NgSelectConfig ,
    private datePipe: DatePipe,
    private excelService: ExcelService,
    private recettesService: RecettesService) {this.config.notFoundText = 'Aucun élement trouvé' ;
  this.config.clearAllText = 'Supprimer tous '; }
  @ViewChild('grid')
 public grid: GridComponent;
 @ViewChild('grid2')
  public grid2: GridComponent;

   @ViewChild('grid3')
   public grid3: GridComponent;


   @ViewChild('gridSelctionnee')
   public gridSelctionnee: GridComponent;
  @ViewChild('op')
   public op: OverlayPanel;
   msg: String;
   wasInside: any;

   public sortOptions: object;
   public editSettings: EditSettingsModel;


  tn: any ;
  maxDate: Date;
  dateDisabled = false;
  to = new Date ();
  Total: string ;
  Total1: string ;
  Total2: string ;
  date1 = new Date();
  date2 = new Date();
  datasourceGrid: any[];
  datasourceGrid1: any[];
  datasourceGrid2: any[];
  listeObservNull = new Array();
  listeObservL = new Array();
  listeObservS = new Array();

  somlisteObservNull: string;
  somlisteObservL: string;
  somlisteObservS: string;

  defaultdatdebut = new Date();
  from = new Date (this.defaultdatdebut.getFullYear() , 0, 1 );
  typeObservNull: any;
  typeObservL: any;
  typeObservS: any;

  readonly: boolean;
  affichBTn: boolean;
  afficherRech = false;

     // pour commit (Cas Production)
    societeChamem = globals.societe === 'CHAMAM DIVISION GROS';
    societeEQMD = globals.societe === 'EQUIPEMENT MODERNE F.INDUSTRIE';

  // pour test devlopement
  // societeChamem = false;
  // societeEQMD = true;

  // liste Rech document
  codeTypeeObservNull: string;
  codeTypeeObservL: string;
  codeTypeeObservS: string;
  NumeroObservNull: String ;
  NumeroObservL: String ;
  NumeroObservS: String ;
  listeType = new Array();
  typeItems = new Array() ;
  selectedGridObservNull: any;
  selectedGridObservL: any;
  selectedGridObservS: any;
  societe: string;
  adresse: string;
  isRefresh = false;

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.op.hide();
    }
    this.wasInside = false;
  }






  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  changeTypeObservNull() {
    if (
      this.typeObservNull !== null &&
      this.typeObservNull  !== undefined
    ) {
      switch (this.typeObservNull) {
        case 0:
          this.codeTypeeObservNull = 'B/L';
          break;
        case 1:
          this.codeTypeeObservNull = 'AVOIR';
          break;
        case 2:
          this.codeTypeeObservNull = 'FACTURE C';
          break;
      }
      document.getElementById(`rechdocObservNull`).focus();
    } else {
      this.codeTypeeObservNull = '';
    }
  }
  changeTypeObservL() {
    if (
      this.typeObservL !== null &&
      this.typeObservL  !== undefined
    ) {
      switch (this.typeObservL) {
        case 0:
          this.codeTypeeObservL = 'B/L';
          break;
        case 1:
          this.codeTypeeObservL = 'AVOIR';
          break;
        case 2:
          this.codeTypeeObservL = 'FACTURE C';
          break;
      }
      document.getElementById(`rechdocObservL`).focus();
    } else {
      this.codeTypeeObservL = '';
    }
  }

  changeTypeObservS() {
    if (
      this.typeObservS !== null &&
      this.typeObservS  !== undefined
    ) {
      switch (this.typeObservS) {
        case 0:
          this.codeTypeeObservS = 'B/L';
          break;
        case 1:
          this.codeTypeeObservS = 'AVOIR';
          break;
        case 2:
          this.codeTypeeObservS = 'FACTURE C';
          break;
      }
    } else {
      this.codeTypeeObservS = '';
    }
  }

  ngOnInit() {

    this.codeTypeeObservNull = '';
    this.codeTypeeObservL = '';
    this.codeTypeeObservS = '';
    this.typeItems = [
      { id: 0, deno: 'B/L' },
      { id: 1, deno: 'AVOIR' },
      { id: 2, deno: 'FACTURE C' },
    ];
    console.log('types = ', this.typeItems);


    // traduire la calendrier en francais
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
  // recherche document
  async getByCombine(e) {
    console.log('entree');

  }

  verifierNumero() {
    // this.messageService.clear();
    // this.op.visible = false;
    const num: string = String(this.NumeroObservNull);
    this.NumeroObservNull = num;

    if (this.NumeroObservNull === 'null') {
      this.NumeroObservNull = '';
    } else {
      switch (this.NumeroObservNull.length) {
        case 1: {
          this.NumeroObservNull = '0000' + this.NumeroObservNull;
          break;
        }
        case 2: {
          this.NumeroObservNull = '000' + this.NumeroObservNull;
          break;
        }
        case 3: {
          this.NumeroObservNull = '00' + this.NumeroObservNull;
          break;
        }
        case 4: {
          this.NumeroObservNull = '0' + this.NumeroObservNull;
          break;
        }
        default: {
          break;
        }
      }
    }
  }
  verifierNumeroL() {
    // this.messageService.clear();
    // this.op.visible = false;
    const num: string = String(this.NumeroObservL);
    this.NumeroObservL = num;

    if (this.NumeroObservL === 'null') {
      this.NumeroObservNull = '';
    } else {
      switch (this.NumeroObservL.length) {
        case 1: {
          this.NumeroObservL = '0000' + this.NumeroObservL;
          break;
        }
        case 2: {
          this.NumeroObservL = '000' + this.NumeroObservL;
          break;
        }
        case 3: {
          this.NumeroObservL = '00' + this.NumeroObservL;
          break;
        }
        case 4: {
          this.NumeroObservL = '0' + this.NumeroObservL;
          break;
        }
        default: {
          break;
        }
      }
    }
  }

 async afficheritemeObservNull(e) {

    const findrow = this.datasourceGrid.filter((elm, idx) =>
    elm.combine.includes(this.codeTypeeObservNull) &&
    elm.combine.includes(this.NumeroObservNull ))[0];

    if (
      findrow !== null &&
      findrow  !== undefined
    ) {
      const findrowIndex = this.datasourceGrid.findIndex(elm => elm.id ===  findrow.id);
      this.grid.selectedRowIndex = findrowIndex;
    } else {
      this.wasInside = true;
       this.msg = 'ce document n/existe pas';
       this.op.show(e, document.getElementById('rechdocObservNull'));
    }
  }

  async afficheritemeObservL(e) {


    const findrow = this.datasourceGrid1.filter((elm, idx) =>
    elm.combine.includes(this.codeTypeeObservL) &&
    elm.combine.includes(this.NumeroObservL ))[0];

    if (
      findrow !== null &&
      findrow  !== undefined
    ) {
      const findrowIndex = this.datasourceGrid1.findIndex(elm => elm.id ===  findrow.id);
      this.grid2.selectedRowIndex = findrowIndex;
    } else {
      this.wasInside = true;
      this.msg = 'ce document n/existe pas';
      this.op.show(e, document.getElementById('rechdocObservL'));
    }
  }

  async afficheritemeObservS(e) {


    const findrow = this.datasourceGrid2.filter((elm, idx) =>
    elm.combine.includes(this.codeTypeeObservS) &&
    elm.combine.includes(this.NumeroObservS ))[0];

    if (
      findrow !== null &&
      findrow  !== undefined
    ) {
      const findrowIndex = this.datasourceGrid2.findIndex(elm => elm.id ===  findrow.id);
      this.grid3.selectedRowIndex = findrowIndex;
    } else {
      this.wasInside = true;
      this.msg = 'ce document n/existe pas';
      this.op.show(e, document.getElementById('rechdocObservS'));
    }
  }
   // methode afficher
 async selectFirstIndxGridObservNull(e) {
  if (this.datasourceGrid !== null && this.datasourceGrid !== undefined
    && this.datasourceGrid.length >= 1 && this.isRefresh  === true  ) {
      this.grid.selectRows([0]);
    }

 }
 async selectFirstIndxGridObservL(e) {

    if (this.datasourceGrid1 !== null && this.datasourceGrid1 !== undefined
      && this.datasourceGrid1.length >= 1 && this.isRefresh  === true  ) {
        this.grid2.selectRows([0]);
      }
 }
 async selectFirstIndxGridObservS(e) {

      if (this.datasourceGrid2 !== null && this.datasourceGrid2 !== undefined
        && this.datasourceGrid2.length >= 1 && this.isRefresh  === true  ) {
          this.grid3.selectRows([0]);
        }
 }

  async Afficher (e) {
    if ( e !== undefined) {
      this.isRefresh  = false;
    }
    this.affichBTn = true ;
    // console.log('date 1 ', this.from.toLocaleDateString('en-GB'));
    // console.log('date 2 ', this.to.toLocaleDateString('en-GB'));
    // Remplir les 3 Grid
    if (this.societeChamem === true) {
      await this.recettesService.getBLAVOIRNonRecuFA(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
      .toPromise()
      .then(data => {
        this.listeObservNull = data['_embedded'].receptionBonsLivraisions;
        console.log('liste ', this.listeObservNull);
       });
    } else {
      await this.recettesService.getBLAVOIRNonRecu(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
      .toPromise()
      .then(data => {
        this.listeObservNull = data['_embedded'].receptionBonsLivraisions;
        console.log('liste ', this.listeObservNull);
       });
    }

    this.datasourceGrid = this.listeObservNull;

    if (this.societeChamem === true) {
      await this.recettesService.getBLAvoirFA(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
      .toPromise()
      .then(data => {
        this.listeObservL = data['_embedded'].receptionBonsLivraisions;
        console.log('liste ', this.listeObservL);
    });
    } else {
      await this.recettesService.getBLAvoir(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
      .toPromise()
      .then(data => {
        this.listeObservL = data['_embedded'].receptionBonsLivraisions;
        console.log('liste ', this.listeObservL);
    });
    }

    this.datasourceGrid1 = this.listeObservL;


        await this.recettesService.getBLAvoirRecuNonFact(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
        .toPromise()
        .then(data => {
          this.listeObservS = data['_embedded'].receptionBonsLivraisions;
          console.log('liste ', this.listeObservS );
      });
          this.datasourceGrid2 = this.listeObservS ;


        //  somme Net
        this.somlisteObservNull = (((this.listeObservNull
        .filter(item => item.combine.includes('B/L'))
        .reduce((sum: number, current) => sum + Number.parseFloat( current.net), 0))
        - ( this.listeObservNull
        .filter(item => item.combine.includes('AVOIR'))
        .reduce((sum: number, current) => sum + Number.parseFloat( current.net) , 0)))).toFixed(3);

        this.somlisteObservL = ((this.listeObservL
          .filter(item => item.combine.includes('B/L'))
          .reduce((sum: number, current) => sum + Number.parseFloat( current.net), 0))
          - ( this.listeObservL
          .filter(item => item.combine.includes('AVOIR'))
          .reduce((sum: number, current) => sum + Number.parseFloat( current.net), 0))).toFixed(3);

          this.somlisteObservS = ((this.listeObservS
            .filter(item => item.combine.includes('B/L'))
            .reduce((sum: number, current) => sum + Number.parseFloat( current.net), 0))
            - ( this.listeObservS
            .filter(item => item.combine.includes('AVOIR'))
            .reduce((sum: number, current) => sum + Number.parseFloat( current.net), 0))).toFixed(3);
  }

  async doubleclickGridObservL(e) {
    if (!this.societeChamem) {
    console.log(' this.selectedGridObserL  ',  this.selectedGridObservL );
     if ( this.selectedGridObservL !== null &&  this.selectedGridObservL !== undefined) {

      const recetteslivrObserv =  {id :  this.selectedGridObservL.id
        , livrObserv : null , date : this.selectedGridObservL.date };

      await this.recettesService.updatelivrObserv(recetteslivrObserv)
      .toPromise()
      .then(data => {
        console.log('liste ', data['_embedded'] );
    });
    this.isRefresh = true;
    // refresh les 3 grid
     this.Afficher(undefined);
     // this.datasourceGrid.push(this.selectedDocument1);
     // this.datasourceGrid1.splice(this.datasourceGrid1.indexOf(this.selectedDocument1), 1);
     // this.grid.refresh();
     // this.grid2.refresh();
     }
    }
    }


    async doubleclickGridObservNull(e) {
      console.log(' this.selectedGridObservNull  ',  this.selectedGridObservNull );
       if ( this.selectedGridObservNull !== null &&  this.selectedGridObservNull !== undefined) {
        // this.datasourceGrid1.push(this.selectedDocument2);
        // this.datasourceGrid.splice(this.datasourceGrid.indexOf(this.selectedDocument2), 1);
       // this.grid.refresh();
       // this.grid2.refresh();
       const recetteslivrObserv =  {id :  this.selectedGridObservNull.id
        , livrObserv : 'L' , date : this.selectedGridObservNull.date
        };

       await this.recettesService.updatelivrObserv(recetteslivrObserv)
       .toPromise()
       .then(data => {
         console.log('liste ', data['_embedded'] );
     });
     this.isRefresh = true;
     this.Afficher(undefined);

       }

      }

      async deplacerFromGridObservL(e) {
        if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
          const selected: any = this.grid2.getSelectedRecords()[0];
          if ( selected !== null &&   selected !== undefined) {
           const recetteslivrObserv =  {id :  selected.id
            , livrObserv : 'S' , date : selected.date
            };

           await this.recettesService.updatelivrObserv(recetteslivrObserv)
           .toPromise()
           .then(data => {
             console.log('liste ', data['_embedded'] );
         });
         this.isRefresh = true;
         this.Afficher(undefined);

        }

        }
      }

      rowSelectedDocument_GridObservNull(e) {
        if (this.grid.getSelectedRowIndexes()[0] >= 0) {
          const selected: any = this.grid.getSelectedRecords()[0];
          this.selectedGridObservNull = selected;

        }
        console.log('selected doc Grid ObservNull ', this.selectedGridObservNull  );

      }


      rowSelectedDocument_GridObservL(e) {
      if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
        const selected: any = this.grid2.getSelectedRecords()[0];
        this.selectedGridObservL = selected;

      }
      console.log('selected doc Grid Observ L ', this.selectedGridObservL  );

    }





  async doubleclickGridObservS(e) {
    if (!this.societeChamem) {
    console.log(' this.selectedGridObservS  ',  this.selectedGridObservS );
     if ( this.selectedGridObservS !== null &&  this.selectedGridObservS !== undefined) {

      const selectedGridObservS =  {id :  this.selectedGridObservS.id
        , livrObserv : 'L' , date : this.selectedGridObservS.date  };

      await this.recettesService.updatelivrObserv(selectedGridObservS)
      .toPromise()
      .then(data => {
        console.log('liste ', data['_embedded'] );
    });

    // refresh les 3 grid
    this.isRefresh = true;
     this.Afficher(undefined);

     }
    }
    }


    rowSelectedDocument_GridObservS(e) {
    if (this.grid3.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid3.getSelectedRecords()[0];
      this.selectedGridObservS = selected;

    }
    console.log('selected doc Grid Observ S ', this.selectedGridObservS  );

  }

Doubleclick(e) {

}

rowSelected(args: RowSelectEventArgs) {
  if (this.grid.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.grid.getSelectedRecords()[0];

  }
}

  async ApercuobservNull(e) {
     console.log('okkkkkkkkkkkkkkkk');
     await this.recettesService.getBLAVOIRNonRecu(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
     .toPromise()
     .then(data => {
       this.listeObservNull = data['_embedded'].receptionBonsLivraisions;
       console.log('liste ', this.listeObservNull);
      });

      const doc1 = new jspdf();
      doc1.setFontSize(11);
      doc1.setFontStyle('Arial');
      this.societe = globals.societe;
      this.adresse = globals.adresse;
      doc1.text('Société :  ' + this.societe, 9, 15);
      doc1.text('Adresse:  ' + this.adresse, 9, 22);
      let temps = String(new Date().getUTCHours() + 1);
           temps = temps + ':' + String(new Date().getUTCMinutes());
           temps = temps + ':' + String(new Date().getUTCSeconds());
      console.log('datedu jour ', temps );

      const datedujour = new Date().toLocaleDateString('en-GB') ;
      doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
      // doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.setTextColor(9, 4, 161);
      doc1.setFontSize(15);
      doc1.text('Liste des B/L Non Parvenue Au Responsable Facturation ', 50, 30);
      doc1.setFontStyle('Arial');
      doc1.setFontSize(11);
     doc1.setTextColor(0, 0, 0);
     doc1.text('Du : ' + this.from.toLocaleDateString('en-GB') + ' au: ' + this.to.toLocaleDateString('en-GB'), 9, 40);
     if (this.listeObservNull.length !== 0) {
     // entete du  tableau
     doc1.setFontStyle('bold');
     doc1.setFontSize(9);
     doc1.line(9, 45, 205, 45);
     doc1.line(9, 45, 9, 277);
     doc1.line(205, 45, 205, 277);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
     doc1.text('Piéce', 10, 50);
     doc1.text('Date', 35 , 50);
     doc1.text('Code Client', 54, 50);
     doc1.text('Nom Client', 88, 50, 'right');
     doc1.text('Net', 140, 50, 'right');
     doc1.text('Vendeur', 164, 50, 'right');

     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 53, 205, 53);
     let y = 62;
     let  numPage = 1;
     for ( let i = 0 ; i < this.listeObservNull.length; i++) {
      const obj = this.listeObservNull[i];
       console.log('obj', obj);
        doc1.setFontStyle('Arial');
        doc1.setFontSize(9);
        doc1.text(obj.combine, 10, y, 'left');
        doc1.text(obj.date, 35, y, 'left');
        doc1.text(obj.operateur, 55 , y, 'left');
        doc1.text(obj.denoClt, 73, y, 'left');
        doc1.text(obj.net , 135, y, 'left');
        doc1.text(obj.denoVend, 153, y, 'left');

        y = y + 7;
        if (y > 277) {
          doc1.line(9, 277, 205, 277);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          doc1.line(9, 12, 205, 12);
          doc1.line(9, 12, 9, 277);
          doc1.line(205, 12, 205, 277);
          doc1.setFontStyle('bold');
          doc1.setTextColor(0, 0, 0);
          doc1.text('Piéce', 10, 17);
          doc1.text('Date', 35, 17);
          doc1.text('Code Client', 54, 17);
          doc1.text('Nom Client', 88, 17, 'right');
          doc1.text('Net', 140, 17, 'right');
          doc1.text('Vendeur', 164, 17, 'right');


          // creer la ligne
          doc1.line(9, 20, 205, 20);
          y = 24;
        }
    }
   }
   window.open(doc1.output('bloburl'), '_blank');
}


async ApercuobservL(e) {
  console.log('okkkkkkkkkkkkkkkk');
  await this.recettesService.getBLAvoir(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
  .toPromise()
  .then(data => {
    this.listeObservL = data['_embedded'].receptionBonsLivraisions;
    console.log('liste ', this.listeObservL);
});

   const doc1 = new jspdf();
   doc1.setFontSize(11);
   doc1.setFontStyle('Arial');
   this.societe = globals.societe;
   this.adresse = globals.adresse;
   doc1.text('Société :  ' + this.societe, 9, 15);
   doc1.text('Adresse:  ' + this.adresse, 9, 22);
   let temps = String(new Date().getUTCHours() + 1);
        temps = temps + ':' + String(new Date().getUTCMinutes());
        temps = temps + ':' + String(new Date().getUTCSeconds());
   console.log('datedu jour ', temps );

   const datedujour = new Date().toLocaleDateString('en-GB') ;
   doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
   // doc1.setFontSize(24);
   doc1.setFontStyle('bold');
   doc1.setTextColor(9, 4, 161);
   doc1.setFontSize(15);
   doc1.text('Liste des B/L Non Parvenue Au Responsable Facturation ', 50, 30);
   doc1.setFontStyle('Arial');
   doc1.setFontSize(11);
  doc1.setTextColor(0, 0, 0);
  doc1.text('Du : ' + this.from.toLocaleDateString('en-GB') + ' au: ' + this.to.toLocaleDateString('en-GB'), 9, 40);
  if (this.listeObservL.length !== 0) {
  // entete du  tableau
  doc1.setFontStyle('bold');
  doc1.setFontSize(9);
  doc1.line(9, 45, 205, 45);
  doc1.line(9, 45, 9, 277);
  doc1.line(205, 45, 205, 277);
  doc1.setFontStyle('bold');
  doc1.setTextColor(0, 0, 0);
  doc1.text('Piéce', 10, 50);
  doc1.text('Date', 35 , 50);
  doc1.text('Code Client', 54, 50);
  doc1.text('Nom Client', 88, 50, 'right');
  doc1.text('Net', 140, 50, 'right');
  doc1.text('Vendeur', 164, 50, 'right');

  // creer la ligne
  doc1.setFontStyle('bold');
  doc1.line(9, 53, 205, 53);
  let y = 62;
  let  numPage = 1;
  for ( let i = 0 ; i < this.listeObservL.length; i++) {
   const obj = this.listeObservL[i];
    console.log('obj', obj);
     doc1.setFontStyle('Arial');
     doc1.setFontSize(9);
     doc1.text(obj.combine, 10, y, 'left');
     doc1.text(obj.date, 35, y, 'left');
     doc1.text(obj.operateur, 55 , y, 'left');
     doc1.text(obj.denoClt, 73, y, 'left');
     doc1.text(obj.net , 135, y, 'left');
     doc1.text(obj.denoVend, 153, y, 'left');

     y = y + 7;
     if (y > 277) {
       doc1.line(9, 277, 205, 277);
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       numPage++;
       doc1.addPage();
       doc1.line(9, 12, 205, 12);
       doc1.line(9, 12, 9, 277);
       doc1.line(205, 12, 205, 277);
       doc1.setFontStyle('bold');
       doc1.setTextColor(0, 0, 0);
       doc1.text('Piéce', 10, 17);
       doc1.text('Date', 35, 17);
       doc1.text('Code Client', 54, 17);
       doc1.text('Nom Client', 88, 17, 'right');
       doc1.text('Net', 140, 17, 'right');
       doc1.text('Vendeur', 164, 17, 'right');


       // creer la ligne
       doc1.line(9, 20, 205, 20);
       y = 24;
     }
 }
 }
 window.open(doc1.output('bloburl'), '_blank');
}


async ApercuobservS(e) {
  console.log('okkkkkkkkkkkkkkkk');
  await this.recettesService.getBLAvoirRecuNonFact(this.from.toLocaleDateString('en-GB') , this.to.toLocaleDateString('en-GB'))
        .toPromise()
        .then(data => {
          this.listeObservS = data['_embedded'].receptionBonsLivraisions;
          console.log('listeS**** ', this.listeObservS );
      });

   const doc1 = new jspdf();
   doc1.setFontSize(11);
   doc1.setFontStyle('Arial');
   this.societe = globals.societe;
   this.adresse = globals.adresse;
   doc1.text('Société :  ' + this.societe, 9, 15);
   doc1.text('Adresse:  ' + this.adresse, 9, 22);
   let temps = String(new Date().getUTCHours() + 1);
        temps = temps + ':' + String(new Date().getUTCMinutes());
        temps = temps + ':' + String(new Date().getUTCSeconds());
   console.log('datedu jour ', temps );

   const datedujour = new Date().toLocaleDateString('en-GB') ;
   doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 15);
   // doc1.setFontSize(24);
   doc1.setFontStyle('bold');
   doc1.setTextColor(9, 4, 161);
   doc1.setFontSize(15);
   doc1.text('Liste des B/L (Non Facturable ) Parvenue Au Responsable Facturation ', 20, 30);
   doc1.setFontStyle('Arial');
   doc1.setFontSize(11);
  doc1.setTextColor(0, 0, 0);
  doc1.text('Du : ' + this.from.toLocaleDateString('en-GB') + ' au: ' + this.to.toLocaleDateString('en-GB'), 9, 40);
  if (this.listeObservS.length !== 0) {
  // entete du  tableau
  doc1.setFontStyle('bold');
  doc1.setFontSize(9);
  doc1.line(9, 45, 205, 45);
  doc1.line(9, 45, 9, 277);
  doc1.line(205, 45, 205, 277);
  doc1.setFontStyle('bold');
  doc1.setTextColor(0, 0, 0);
  doc1.text('Piéce', 10, 50);
  doc1.text('Date', 35 , 50);
  doc1.text('Code Client', 54, 50);
  doc1.text('Nom Client', 88, 50, 'right');
  doc1.text('Net', 140, 50, 'right');
  doc1.text('Vendeur', 164, 50, 'right');

  // creer la ligne
  doc1.setFontStyle('bold');
  doc1.line(9, 53, 205, 53);
  let y = 62;
  let  numPage = 1;

  for ( let i = 0 ; i < this.listeObservS.length; i++) {
   const obj = this.listeObservS[i];
    console.log('obj', obj);
     doc1.setFontStyle('Arial');
     doc1.setFontSize(9);
     doc1.text(obj.combine, 10, y, 'left');
     doc1.text(obj.date, 35, y, 'left');
     doc1.text(obj.operateur, 55 , y, 'left');
     doc1.text(obj.denoClt, 73, y, 'left');
     doc1.text(obj.net , 135, y, 'left');
     doc1.text(obj.denoVend, 153, y, 'left');

     y = y + 7;
     if (y > 277) {
       doc1.line(9, 277, 205, 277);
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       numPage++;
       doc1.addPage();
       doc1.line(9, 12, 205, 12);
       doc1.line(9, 12, 9, 277);
       doc1.line(205, 12, 205, 277);
       doc1.setFontStyle('bold');
       doc1.setTextColor(0, 0, 0);
       doc1.text('Piéce', 10, 17);
       doc1.text('Date', 35, 17);
       doc1.text('Code Client', 54, 17);
       doc1.text('Nom Client', 88, 17, 'right');
       doc1.text('Net', 140, 17, 'right');
       doc1.text('Vendeur', 164, 17, 'right');


       // creer la ligne
       doc1.line(9, 20, 205, 20);
       y = 24;
     }
 }
 }
 window.open(doc1.output('bloburl'), '_blank');
}

gererExcelobsNull() {
  const exportExcel = this.datasourceGrid.map(obj => {
    return {
      'Piéce': obj.combine,
      'Date': obj.date,
      'Code Client': obj. operateur,
      'Nom Client': obj.denoClt,
      'Vendeur ': obj.denoVend,
      'Net ': obj.net,

    };
  });
  this.excelService.exportAsExcelFile(
    exportExcel,
   'B/L AVOIR  ' + new Date().toLocaleDateString('en-GB')

  );
  }
  gererExcelobsl() {
    const exportExcel = this.datasourceGrid1.map(obj => {
      return {
        'Piéce': obj.combine,
        'Date': obj.date,
        'Code Client': obj. operateur,
        'Nom Client': obj.denoClt,
        'Vendeur ': obj.denoVend,
        'Net ': obj.net,

      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
     'B/L AVOIR  ' + new Date().toLocaleDateString('en-GB')

    );
    }
    gererExcelobsS() {
      const exportExcel = this.datasourceGrid2.map(obj => {
        return {
          'Piéce': obj.combine,
          'Date': obj.date,
          'Code Client': obj. operateur,
          'Nom Client': obj.denoClt,
          'Vendeur ': obj.denoVend,
          'Net ': obj.net,

        };
      });
      this.excelService.exportAsExcelFile(
        exportExcel,
       'B/L AVOIR  ' + new Date().toLocaleDateString('en-GB')

      );
      }


}
