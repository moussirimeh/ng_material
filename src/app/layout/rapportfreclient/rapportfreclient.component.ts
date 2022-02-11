import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ClientService } from '../services/client.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { RapportfacturecltService } from '../services/rapportfactureclt.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import * as jspdf from 'jspdf';
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
  selector: 'app-rapportfreclient',
  templateUrl: './rapportfreclient.component.html',
  styleUrls: ['./rapportfreclient.component.scss']
})
export class RapportfreclientComponent implements OnInit {
  date_debut = new Date ();
  date_fin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  tn: any;
  readonly: boolean;
  apercuBTn = false ;
  listeClients = new Array();
  selected_clt: any;
  code_clt = '';
  Num_fact = '';

  TtHTC = 0;
  TtRemC = 0;
  TtNetC = 0;

  TtHTD = 0;
  TtRemD = 0;
  TtNetD = 0;

  TtHTfc = '';
  TtRemfc = '';
  TtNetfc = '';

  TtHTdt = '';
  TtRemdt = '';
  TtNetdt = '';

  TtHT = '';
  TtRem = '';
  TtNet = '';
  ste: Ste;
  societe: any;
  adresse: string;
  ville: string;
  tel: string;
  fax: string;
  email: string;

  listesumsensC = new Array();
  listesumsensD = new Array();
  listefacture = new Array();
  listesumsensttC = new Array();
  listesumsensttD = new Array();
  datasourceGrid: any[];
  listeBonsLivraision = new Array();
  datasourceGrid1: any[];
  datedebut: string;
  datefin: string;
  sensclt: string ;
  @ViewChild('grid')
  public grid: GridComponent;
 constructor(
 private clientService: ClientService,
 private config: NgSelectConfig ,
 private steService: SteService,
 private rapportfacturecltService: RapportfacturecltService,


  ) {
    this.config.notFoundText = 'Aucun élement trouvé' ;
    this.config.clearAllText = 'Supprimer tous ';
    }




  async chargerClients() {
    if (this.listeClients.length === 0) {
      await this.clientService
        .getClientsListByOrderByDeno()
        .toPromise()
        .then((data) => {
          console.log('liste des clients ', data['_embedded'].clients);

          this.listeClients = data['_embedded'].clients;
        });
    }
  }
  async changeClient() {
    if (this.selected_clt !== null && this.selected_clt !== undefined) {
       this.code_clt = this.selected_clt.code;
   } else {
      this.code_clt = '';
  }
  }




  public onSearchDeno(word: string, item): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }


  async afficher() {
  this.datefin = this.date_fin.toLocaleDateString('en-GB');
  this.datedebut = this.date_debut.toLocaleDateString('en-GB');
    console.log('DateDeb ****' , this.datedebut);
    console.log('Datefin ****' , this.datefin);

  if (this.code_clt !== '' ) {
    await this.rapportfacturecltService.GetfactureClt( this.datedebut, this.datefin, this.code_clt)
    .toPromise()
    .then((data) => {
    
     this.listefacture = data['_embedded'].rapportFactureClts;
  
     console.log('GetfactureClt ****' , data);
     console.log('listefacture ****' , data);
    });
  } else {
    await this.rapportfacturecltService.GetfactureClttout( this.datedebut, this.datefin)
    .toPromise()
    .then((data) => {
     this.listefacture = data['_embedded'].rapportFactureClts;
   
     console.log('GetfactureClttout ****' , data);
    });
  }

    this.TtHTfc = '';
    this.TtRemfc = '';
    this.TtNetfc = '';

    this.TtHTdt = '';
    this.TtRemdt = '';
    this.TtNetdt = '';

    this.TtHT = '';
    this.TtRem = '';
    this.TtNet = '';

    for ( let i = 0 ; i < this.listefacture.length; i++) {
      this.listefacture[i].mntHT = Number(this.listefacture[i].mntHT).toFixed(3);
      this.listefacture[i].mntNet = Number(this.listefacture[i].mntNet).toFixed(3);
      this.listefacture[i].mntRemise = Number(this.listefacture[i].mntRemise).toFixed(3);
     }
    this.datasourceGrid = this.listefacture ;
    console.log('dataaaaaa********' , this.datasourceGrid);
    
  
    
     this.grid.selectRows([0]);

     if (this.code_clt !== '' ) {
     await this.rapportfacturecltService.GetSumTotalselectSensC( this.datedebut, this.datefin, this.code_clt)
     .toPromise()
     .then((data) => {
       this.TtHTC = Number.parseFloat(  data.sumHT );
       this.TtRemC = Number.parseFloat( data.sumRemise );
       this.TtNetC = Number.parseFloat( data.sumNet );

      console.log('GetSumTotalselectSensC ****' , data);

      } );
    } else {
      await this.rapportfacturecltService.GetSumTotalSensC( this.datedebut, this.datefin)
      .toPromise()
      .then((data) => {
        this.TtHTC = Number.parseFloat(  data.sumHT );
        this.TtRemC = Number.parseFloat( data.sumRemise );
        this.TtNetC = Number.parseFloat( data.sumNet );

       console.log('GetSumTotalSensC ****' , data);
      } );
    }

    if (this.code_clt !== '' ) {
      await this.rapportfacturecltService.GetSumTotalselectSensD( this.datedebut, this.datefin, this.code_clt)
      .toPromise()
      .then((data) => {
       this.TtHTD = Number.parseFloat(  data.sumHT);
        this.TtRemD = Number.parseFloat(  data.sumRemise );
         this.TtNetD = Number.parseFloat(  data.sumNet );

       console.log('GetSumTotalselectSensD ****' , data);

       } );


    } else {
      await this.rapportfacturecltService.GetSumTotalSensD( this.datedebut, this.datefin)
      .toPromise()
      .then((data) => {
       this.TtHTD = Number.parseFloat(  data.sumHT);
        this.TtRemD = Number.parseFloat(  data.sumRemise );
         this.TtNetD = Number.parseFloat(  data.sumNet );

       console.log('GetSumTotalSensD ****' , data);

       } );
    }

    this.TtHTfc =  (this.TtHTC -  this.TtHTD).toFixed(3);
    this.TtRemfc =  (this.TtRemC -  this.TtRemD).toFixed(3);
    this.TtNetfc = (this.TtNetC -  this.TtNetD).toFixed(3);

    this.TtHT = this.TtHTfc;
    this.TtRem =    this.TtRemfc;
    this.TtNet = this.TtNetfc;



  }


  ngOnInit() {
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
  async onRowSelect(event) {

   console.log('select', event, event.data);

   if (event.data !== undefined && event.data !== null) {
   
    this.Num_fact = event.data.numFacture;

    await this.rapportfacturecltService.GetDetailFact( this.datedebut, this.datefin, this.Num_fact)
    .toPromise()
    .then((data) => {
     this.listeBonsLivraision = data['_embedded'].rapDetailFacts;
     console.log('listeBonsLivraision ****' , data);  });
     //this.listeBonsLivraision.mntHT=this.listeBonsLivraision.mntHT.toFixed(3);
     //this.listeBonsLivraision.mntNet=this.listeBonsLivraision.mntNet.toFixed(3);
     for ( let i = 0 ; i < this.listeBonsLivraision.length; i++) {
      this.listeBonsLivraision[i].mntHT = Number(this.listeBonsLivraision[i].mntHT).toFixed(3);
      this.listeBonsLivraision[i].mntNet = Number(this.listeBonsLivraision[i].mntNet).toFixed(3);
      this.listeBonsLivraision[i].mntRemise = Number(this.listeBonsLivraision[i].mntRemise).toFixed(3);
     }
     this.datasourceGrid1 = this.listeBonsLivraision;
    

     await this.rapportfacturecltService.GetSumTotalDetail( this.datedebut, this.datefin, this.Num_fact)
     .toPromise()
     .then((data) => {
      this.TtHTdt = Number.parseFloat(  data.sumHT).toFixed(3);
      this.TtRemdt = Number.parseFloat(  data.sumRemise ).toFixed(3);
      this.TtNetdt = Number.parseFloat(  data.sumNet ).toFixed(3);

      console.log('GetSumTotalDetail ****' , data);

      } );
    }
   }

  onRowUnselect() {

   // this.currentAgenda = '';
  this.listeBonsLivraision = [];
  this. Num_fact = '';
  }

   async Apercu() {
    const doc1 = new jspdf();
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    await this.steService
        .getSte()
        .toPromise()
        .then((data) => {
          this.societe = data['_embedded'].ste[0];
        });
    doc1.text('SOCIETE..:  ' + this.societe.societe, 9, 15);
        doc1.text('ADRESSE..:  ' + this.societe.adresse, 9, 20);
        doc1.text('VILLE....:  ' + this.societe.ville, 9, 25);
        doc1.text('TEL......:  ' + this.societe.tel, 9, 30);
        doc1.text('FAX......:  ' + this.societe.fax, 9, 35);
        doc1.text('E-MAIL...:  ' + this.societe.email, 9, 40);
    doc1.setFontSize(10);
    doc1.setFontStyle('arial');
    let temps = String(new Date().getUTCHours() + 1);
           temps = temps + ':' + String(new Date().getUTCMinutes());
           temps = temps + ':' + String(new Date().getUTCSeconds());
      console.log('datedu jour ', temps );

      const datedujour = new Date().toLocaleDateString('en-GB') ;
      doc1.text('Tunis, le : '  + datedujour + ' ' + temps , 152, 50);
      // doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.setTextColor(9, 4, 161);
      doc1.setFontSize(15);
      doc1.text('Analyse Péroidique Des Factures ', 50, 60);
      doc1.setFontStyle('Arial');
      doc1.setFontSize(10);
      doc1.setTextColor(0, 0, 0);
      doc1.text('Péroide  Du : ' + this.date_debut.toLocaleDateString('en-GB') + ' au: ' + this.date_fin.toLocaleDateString('en-GB'), 9, 70);

      this.datefin = this.date_fin.toLocaleDateString('en-GB');
      this.datedebut = this.date_debut.toLocaleDateString('en-GB');
        console.log('DateDeb ****' , this.datedebut);
        console.log('Datefin ****' , this.datefin);

    // entete du  tableau
     doc1.setFontStyle('bold');
     doc1.setFontSize(9);
     doc1.line(9, 75, 205, 75);
     doc1.line(9, 75, 9, 277);
     doc1.line(205, 75, 205, 277);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
     doc1.text('Client', 10, 80);
     doc1.text('RaisonSociale', 43, 80, 'right');
     doc1.text('N Fact', 85, 80);
     doc1.text('Date', 95, 80);
     doc1.text('Type', 118, 80, 'right');
     doc1.text('Montant HT', 140, 80, 'right');
     doc1.text('Remise', 160, 80, 'right');
     doc1.text('Net', 180, 80, 'right');
     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 83, 205, 83);
     let y = 90;
     let  numPage = 1;
     for ( let i = 0 ; i < this.listefacture.length; i++) {
      const obj = this.listefacture[i];
       console.log('obj', obj);
        doc1.setFontStyle('Arial');
        doc1.setFontSize(9);
        doc1.text(obj.codeclt, 10, y, 'left');
        doc1.text(obj.raisonSocial, 23, y, 'left');
        doc1.text(obj.numFacture, 85 , y, 'left');
        doc1.text(obj.date, 95, y, 'left');
        doc1.text(obj.sensUI, 112, y, 'left');
        doc1.text(obj.mntHT , 125, y, 'left');
        doc1.text(obj.mntRemise, 150, y, 'left');
        doc1.text(obj.mntNet, 175, y, 'left');
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
          doc1.text('Client', 10, 17);
          doc1.text('RaisonSociale', 43, 17, 'right');
          doc1.text('N Fact', 85, 17);
          doc1.text('Date', 95, 17);
          doc1.text('Type', 118, 17, 'right');
          doc1.text('Montant HT', 140, 17, 'right');
          doc1.text('Remise', 160, 17, 'right');
          doc1.text('Net', 180, 17, 'right');
          // creer la ligne
          doc1.line(9, 20, 205, 20);

          y = 24;
        }


    }
    doc1.setFontStyle('bold');
    doc1.setFontSize(14);
    doc1.text('Total ' , 9 , y);
    // + this.TtHT + '' + this.TtRem + '' + this.TtNet
    doc1.setFontStyle('bold');
    doc1.setFontSize(10);
    doc1.text(this.TtHT  , 125 , y);
    doc1.text(this.TtRem , 150 , y);
    doc1.text(this.TtNet , 175 , y);
    doc1.line(9, 277, 205, 277);
    doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
    window.open(doc1.output('bloburl'), '_blank');
   }

  // *ngIf="apercuBTn"

  async handleChange(e) {
    const index = e.index;
    console.log('indice', index);
 if (index === 0) {
    this.TtHT = this.TtHTfc;
    this.TtRem =    this.TtRemfc;
    this.TtNet = this.TtNetfc;
    this.apercuBTn = false ;

  } else {
    this.TtHT = this.TtHTdt;
    this.TtRem = this.TtRemdt;
    this.TtNet = this.TtNetdt;
     this.apercuBTn = true ;
 }

}
}



