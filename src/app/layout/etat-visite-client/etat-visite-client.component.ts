import { Component, OnInit, ViewChild } from '@angular/core';
import { ExcelExportProperties, GridComponent, SearchSettingsModel, ToolbarItems } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Client } from '../services/client';
import { ClientService } from '../services/client.service';
import { ExcelService } from '../services/excel.service';
import { Represan } from '../services/represan';
import { RepresanService } from '../services/represan.service';
import { TableVisiteService } from '../services/table-visite.service';
import * as jspdf from 'jspdf';
import { NgSelectConfig } from '@ng-select/ng-select';
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
  selector: 'app-etat-visite-client',
  templateUrl: './etat-visite-client.component.html',
  styleUrls: ['./etat-visite-client.component.scss'] ,
  providers: [ExcelService],
})
export class EtatVisiteClientComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  public searchOptions: SearchSettingsModel;
  datedeb = new Date();
  datedebut = new Date (this.datedeb.getFullYear() , 0, 1 );
  datefin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  readonly: boolean ;
  tn: any;
  clients = new Array();
  SelectedClients: any;
  codeclient: any;
  listeRepresan = new Array();
  SelectedRepresan: any ;
  disabledbtn: boolean;
  dataupdate: number ;
  listeTablevisit = new Array() ;
  public toolbarOptions: ToolbarItems[];
  listeTablevisit2: any;
  societe: string;
  constructor(
    private clientService: ClientService ,
    private represanService: RepresanService ,
    private tablevisite: TableVisiteService ,
    private excelService: ExcelService ,
    private config: NgSelectConfig ,
  ) { this.config.notFoundText = 'Aucun élément trouvé';
     this.config.clearAllText = 'Supprimer tous';
    }

  ngOnInit() {
    this.readonly = false ;
    this.SelectedClients = '';
    this.SelectedRepresan = '';
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


  async chargerClient() {
    if ( this.clients.length === 0 ) {
      await this.clientService
      .getClientsListByOrderByDeno()
      .toPromise()
      .then( data => {
        this.clients = data['_embedded'].clients ;
        console.log('listeclient = ', this.clients);

      }) ;
    }
  }
  changeClients() {
    console.log('selectedclient =', this.SelectedClients);

    if (this.SelectedClients !== null && this.SelectedClients !== undefined) {
     this.codeclient = this.SelectedClients ;
    } else { this.codeclient = '' ; }
  }
  public onSearchClients(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  async chargerRepresan() {
    if (this.listeRepresan.length === 0) {
      await this.represanService
        .getRepresansListOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des representants ', data);
          this.listeRepresan = data['_embedded'].represans;
        });
    }
  }

  changeRepresan() {}
  public onSearchRepresan(word: string, item: Represan): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  async Afficher() {

    await this.tablevisite.updateTableVisit(this.SelectedClients , this.SelectedRepresan , this.datedebut.toLocaleDateString('en-GB'))
    .toPromise()
    .then((data) => {
      this.dataupdate = data ;
      console.log('update **** ' , this.dataupdate);
    });

    await this.tablevisite.findByOrderByDesignClt()
    .toPromise()
    .then((data) => {
      this.listeTablevisit = data['_embedded'].tablVisit ;
      console.log('listeTablevisite **** ' , this.listeTablevisit);
    });

    for (let i = 0 ; i < this.listeTablevisit.length ; i++) {
      this.listeTablevisit[i].valOfr = Number(this.listeTablevisit[i].valOfr).toFixed(0);
      this.listeTablevisit[i].valsatisf = Number(this.listeTablevisit[i].valsatisf).toFixed(0);
      this.listeTablevisit[i].objectif = Number(this.listeTablevisit[i].objectif).toFixed(0);
      this.listeTablevisit[i].caAnC = Number(this.listeTablevisit[i].caAnC).toFixed(0);
      this.listeTablevisit[i].caAn1 = Number(this.listeTablevisit[i].caAn1).toFixed(0);
      this.listeTablevisit[i].caAn2 = Number(this.listeTablevisit[i].caAn2).toFixed(0);


    }
    this.disabledbtn = true ;
    this.readonly = true ;
  }
  Initialiser()  {
    this.SelectedClients = '' ;
    this.SelectedRepresan = '' ;
    this.datedebut = new Date() ;
  }
  async Excel() {
  if (this.listeTablevisit.length === 0) {
    await this.tablevisite.updateTableVisit(this.SelectedClients , this.SelectedRepresan , this.datedebut.toLocaleDateString('en-GB'))
    .toPromise()
    .then((data) => {
      this.dataupdate = data ;
      console.log('update **** ' , this.dataupdate);
    });

    await this.tablevisite.findByOrderByDesignClt()
    .toPromise()
    .then((data) => {
      this.listeTablevisit2 = data['_embedded'].tablVisit ;
      console.log('listeTablevisite **** ' , this.listeTablevisit);
    });
   try {
    let nomFich;
       nomFich = 'ListeEtatVisiteClient';
    const exportExcel = this.listeTablevisit2.map(obj => {
      return {
        'Design_clt': obj.designClt,
        'Rep_clt': obj.repClt,
        'Nbvisit': obj.nbVisit,
        'NbOfr': obj.nbOfr,
        'ValOfr': Number(obj.valOfr).toFixed(0),
        'ValStf': Number(obj.valsatisf).toFixed(0),
        'Objectif': Number(obj.objectif).toFixed(0),
        'Ca_an_c': Number(obj.caAnC).toFixed(0),
        'Ca_an_1': Number(obj.caAn1).toFixed(0),
        'Ca_an_2': Number(obj.caAn2).toFixed(0),
        'Creance': Number(obj.creance).toFixed(0),
        'Retard': Number(obj.retard).toFixed(0),
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
console.log('okkkk');
const excelExportProperties: ExcelExportProperties = {
  fileName: 'ListeEtatVisiteClient' + ' : ' + new Date().toLocaleDateString('en-GB') + '.xlsx'
};
this.grid.excelExport(excelExportProperties);
}
}
  nouvelleSaisie() {
    this.SelectedClients = '' ;
    this.SelectedRepresan = '' ;
    this.datedebut = new Date() ;
    this.listeTablevisit = new Array();
    this.disabledbtn = false ;
    this.readonly = false ;
  }
  Apercu() {
    const doc1 = new jspdf();
    doc1.setFontSize(12);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     const datedujour = new Date().toLocaleDateString('en-GB') ;
     doc1.setFontStyle('bold');
     doc1.text('Rapport des visites Edite le: '  + datedujour + ' ' + temps , 50, 15);
     doc1.setFontSize(9);
     // entete du  tableau
     doc1.setFontStyle('Arial');
     doc1.line(1, 25, 209, 25);
     doc1.line(1, 25, 1, 277);
     doc1.line(209, 25, 209, 277);
     doc1.setTextColor(0, 0, 0);
     doc1.text('DesignCclt', 2, 30);
     doc1.text('RepClt', 60, 30);
     doc1.text('Nbvisit', 90, 30, 'right');
     doc1.text('NbOfr', 100, 30, 'right');
     doc1.text('ValOfr', 110, 30 , 'right');
     doc1.text('ValStf', 120, 30, 'right');
     doc1.text('Object', 135, 30, 'right');
     doc1.text('CaAnC', 150, 30, 'right');
     doc1.text('CaAn1', 165, 30, 'right');
     doc1.text('CaAn2', 180, 30, 'right');
     doc1.text('Creance', 195, 30, 'right');
     doc1.text('Retard', 205, 30, 'right');
     // creer la ligne
     doc1.line(1, 33, 209, 33);
     let y = 37;
     let  numPage = 1;
       for (const obj of this.listeTablevisit) {
         doc1.setFontSize(8);
         doc1.setFontStyle('Arial');
         doc1.text(obj.designClt, 2, y);
         doc1.text(obj.repClt, 60, y);
         doc1.text(obj.nbVisit, 90, y, 'right');
         doc1.text(obj.nbOfr, 100, y, 'right');
         doc1.text(Number(obj.valOfr).toFixed(0), 110, y, 'right');
         doc1.text(Number(obj.valsatisf).toFixed(0), 120, y, 'right');
         doc1.text(Number(obj.objectif).toFixed(0), 135, y, 'right');
         doc1.text(Number(obj.caAnC).toFixed(0), 150, y, 'right');
         doc1.text(Number(obj.caAn1).toFixed(0), 165, y, 'right');
         doc1.text(Number(obj.caAn2).toFixed(0), 180, y, 'right');
         doc1.text(Number(obj.creance).toFixed(0), 195, y, 'right');
         doc1.text(Number(obj.retard).toFixed(0), 205, y, 'right');
         y = y + 7;
         if (y > 277) {
           doc1.line(1, 277, 209, 277);
           doc1.setFontSize(10);
           doc1.setFontStyle('bold');
           doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
           numPage++;
           doc1.addPage();
           doc1.line(1, 12, 209, 12);
           doc1.line(1, 12, 1, 277);
           doc1.line(209, 12, 209, 277);
           doc1.setFontSize(9);
           doc1.setFontStyle('bold');
           doc1.setTextColor(0, 0, 0);
           doc1.text('DesignCclt', 2, 17);
           doc1.text('RepClt', 60, 17);
           doc1.text('Nbvisit', 90, 17, 'right');
           doc1.text('NbOfr', 100, 17, 'right');
           doc1.text('ValOfr', 110, 17 , 'right');
           doc1.text('ValStf', 120, 17, 'right');
           doc1.text('Object', 135, 17, 'right');
           doc1.text('CaAnC', 150, 17, 'right');
           doc1.text('CaAn1', 165, 17, 'right');
           doc1.text('CaAn2', 180, 17, 'right');
           doc1.text('Creance', 195, 17, 'right');
           doc1.text('Retard', 205, 17, 'right');
           // creer la ligne
           doc1.setFontStyle('bold');
           doc1.line(1, 20, 209, 20);
           y = 24;
         }

       }

       doc1.line(1, 277, 209, 277);
       doc1.setFontSize(10);
       doc1.setFontStyle('bold');
       doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
       window.open(doc1.output('bloburl'), '_blank');
  }
}
