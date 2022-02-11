import { Component, OnInit , ViewChild, HostListener, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { TableFinSaisieService } from '../services/tableFinSaisie.service';
import { TableFinService } from '../services/tableFin.service';
import { Achat0Service } from '../services/achat0.service';
import { BanqueService } from '../services/banque.service';
import {SteService} from '../services/ste.service';
import * as jspdf from 'jspdf';
import {
  GridComponent
} from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { isInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
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
  selector: 'app-tableau-de-bord',
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.scss']
})
export class TableauDeBordComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('dt')
  public table: Table;
  items2: any;
  clonedItems: any;
  listeBanqueff: any;
  blockedDocument: boolean;
  codebnq1: any;
  codebnq2: any;
  codebnq3: any;
  banque1;
  banque2;
  banque3;
  val1: string;
  val2: string;
  val3: string;
  btn1: boolean;
  liste0: any;
  ste: any;
  dateSave: any;
  label: string;
  btn2: boolean;
  liste2 = new Array();
  liste3: any;
  total: number;
  societe: any;
  recentItem: any;
  liste = new Array();
  constructor(private tableFinSaisieService: TableFinSaisieService,
              private achat0Service: Achat0Service,
              private banqueService: BanqueService,
              private tableFinService: TableFinService,
              private steService: SteService) { }

focus(item) {
this.recentItem = item;
console.log('receeeeent item ', this.recentItem );

}
blurVal(val, e) {

  const strval = String(Number(val.val1));

if (Number(strval) === null || Number(strval) === undefined || strval === 'NaN') {
 val.val1 = '0.000' ;
}

const strval2 = String(Number(val.val2));

if (Number(strval2) === null || Number(strval2) === undefined || strval2 === 'NaN') {
 val.val2 = '0.000';
}

const strval3 = String(Number(val.val3));

if (Number(strval3) === null || Number(strval3) === undefined || strval3 === 'NaN') {
 val.val3 = '0.000';
}



}
async MettreAjour(e) {
  this.liste0 = new Array();
  this.btn1 = true;
  this.btn2 = false;
await this.tableFinSaisieService.getableFinSaisie()
    .toPromise()
    .then(data => {
    this.liste = data['_embedded'].TableFinSaisie;
    this.liste0 = data['_embedded'].TableFinSaisie;
    });

this.val1 = this.banque1.deno;
this.val2 = this.banque2.deno;
this.val3 = this.banque3.deno;
}
async valider(e) {
this.blockedDocument = true;
console.log('blockedDocument ', this.blockedDocument);
for (const obj of this.liste) {

  await this.tableFinSaisieService.updateTableFinSaisie(obj)
  .subscribe(data => {
   console.log('update', data);
  });

}
await this.tableFinService.updateTablFinSaisieTabBrd()
.subscribe(data => {
  console.log('update', data);
 });

  this.blockedDocument = false;
  console.log('blockedDocument ', this.blockedDocument);
}




async visualiser() {

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
      doc1.text(date.toLocaleDateString('en-GB') , 153, 34);


      doc1.setFontSize(20);
      doc1.setFontStyle('bold');

      doc1.text('Tableau de Bord Financier ' , 70, 35);


             // entete du  tableau
             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.2);
             doc1.line(8, 40, 8, 199);

             doc1.setLineWidth(0.1);

             doc1.setFontStyle('bold');
             doc1.setDrawColor(0);
             doc1.setFillColor(220, 220, 220);
             doc1.rect(8, 40, 198, 7, 'FD');
             doc1.setFontStyle('bold');
             doc1.setFontSize(10);
             doc1.text('Rubrique'  , 11, 45);


             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.2);
             doc1.line(79, 40, 79, 199);


             doc1.setFontSize(10);
             if (this.banque1 !== null && this.banque1 !== undefined) {
              doc1.text(this.banque1.deno.substring(0, 14)  , 82, 45);
             }
             if (this.banque2 !== null && this.banque2 !== undefined) {
             doc1.text(this.banque2.deno.substring(0, 14)  , 118, 45) ;
             }
             if (this.banque3 !== null && this.banque3 !== undefined) {
             doc1.text(this.banque3.deno.substring(0, 14)  , 156, 45);
             }
             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.2);
             doc1.line(186, 40, 186, 199);
             doc1.setFontSize(10);
             doc1.text('Total'  , 195, 45);


             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.2);
             doc1.line(206, 40, 206, 199);
             doc1.setFontSize(13);
             doc1.setFontStyle('bold');

             let y = 53;
             const numPage = 1;
             doc1.setFontSize(10);
             doc1.setFontStyle('Arial');
             if (this.liste2.length > 0) {
             for (const bs of this.liste2) {
              doc1.setFontSize(11);
              doc1.setFontStyle('bold');
              doc1.text(bs.rubrique  , 11, y);
              doc1.setFontStyle('Arial');
              doc1.setFontSize(10);
              if (bs.val1 === null ) {
                bs.val1 = '';
              } else {
                bs.val1 = Number(bs.val1).toFixed(0);
              }
              doc1.text(bs.val1 , 116, y, 'right') ;
              if (bs.val2  === null ) {
                bs.val2  = '';
              } else {
                bs.val2 = Number(bs.val2).toFixed(0);
              }
              doc1.text(bs.val2   , 148, y, 'right');
              if (bs.val3  === null ) {
                bs.val3 = '';
              } else {
                bs.val3 = Number(bs.val3).toFixed(0);
              }
              doc1.text(bs.val3 , 184, y, 'right');
              if (bs.total === null ) {
                bs.total = '';
              } else {
                bs.total = Number( bs.total).toFixed(0);
              }
              doc1.text(bs.total  , 203, y, 'right');
              y = y + 2;
              doc1.setFontSize(72);
              doc1.setFontStyle('bold');
              doc1.setLineWidth(0.3);
              doc1.line(8, y, 206, y);
              y = y + 4;
             }
            }
             y = y + 4;
             if (this.liste2.length > 0) {
             const totcmdetrgfours = this.liste3[0].val1;
             doc1.setFontSize(12);
             doc1.setFontStyle('bold');
             doc1.text('Total cmd fours Etrgs :' , 10, y);
             doc1.setFontStyle('Arial');
             doc1.text( Number(totcmdetrgfours).toFixed(3) , 60, y);

             y = y + 2;
             doc1.setDrawColor(0);
             doc1.setFillColor(220, 220, 220);
             doc1.rect(8, y, 198, 8, 'FD');

             // LIGNE HORIZ
             doc1.setFontSize(72);
             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.3);
             doc1.line(8, y, 8, 263);


             doc1.setFontStyle('bold');
             doc1.setFontSize(14);
             doc1.text('Les ressources '  , 90, y + 5);

             doc1.setFontSize(72);
             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.3);
             doc1.line(110, y + 8, 110, 263);


             doc1.setFontSize(72);
             doc1.setFontStyle('bold');
             doc1.setLineWidth(0.3);
             doc1.line(206, y + 8, 206, 263);

             doc1.line(8, 263, 206, 263);
             y = y + 15;



             doc1.setFontStyle('Arial');
             doc1.setFontSize(11);
             doc1.text(this.liste3[1].rubrique , 10, y);
             doc1.text(Number(this.liste3[1].val1).toFixed(3) , 109, y, 'right');


             doc1.text(this.liste3[7].rubrique , 115, y);
             doc1.text(Number(this.liste3[7].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[2].rubrique , 10, y);
             doc1.text(Number(this.liste3[2].val1).toFixed(3) , 109, y, 'right');

             doc1.text(this.liste3[8].rubrique , 115, y);
             doc1.text(Number(this.liste3[8].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[3].rubrique , 10, y);
             doc1.text(Number(this.liste3[3].val1).toFixed(3) , 109, y, 'right');

             doc1.text(this.liste3[9].rubrique , 115, y);
             doc1.text(Number(this.liste3[9].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[4].rubrique , 10, y);
             doc1.text(Number(this.liste3[4].val1).toFixed(3) , 109, y, 'right');

             doc1.text(this.liste3[10].rubrique , 115, y);
             doc1.text(Number(this.liste3[10].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[5].rubrique , 10, y);
             doc1.text(Number(this.liste3[5].val1).toFixed(3) , 109, y, 'right');

             doc1.text(this.liste3[11].rubrique , 115, y);
             doc1.text(Number(this.liste3[11].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[6].rubrique , 10, y);
             doc1.text(Number(this.liste3[6].val1).toFixed(3) , 109, y, 'right');

             doc1.text(this.liste3[12].rubrique , 115, y);
             doc1.text(Number(this.liste3[12].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[13].rubrique , 115, y);
             doc1.text(Number(this.liste3[13].val1).toFixed(3) , 204, y, 'right');
             y = y + 5;
             doc1.text(this.liste3[14].rubrique , 115, y);
             doc1.text(Number(this.liste3[14].val1).toFixed(3) , 204, y, 'right');
             }



             doc1.line(10, 280, 205, 280, 'FD');
             doc1.setFontSize(12);
             doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
             window.open(doc1.output('bloburl'), '_blank');

}



async afficher(e) {

  this.liste3 = new Array();
  this.btn1 = false;
  this.btn2 = true;
  const date = new Date();
  let moisCourant = date.getMonth() + 2 ;
  const anneeCourant = date.getFullYear();
  let anneeCourante = Number(anneeCourant);
// teeeeeeeeest mois et annee
if (moisCourant === 13 ) {
  moisCourant = 1;
  anneeCourante = anneeCourante + 1;
}

 let moisSuivant = moisCourant + 1 ;
 let anneeSuivante = anneeCourante;

// console.log('mois 2 ', moisSuivant);

 if (moisSuivant  === 13 ) {
    moisSuivant  = 1;
    anneeSuivante  = anneeSuivante  + 1;
  }

// console.log('mois couraaaant', moisCourant);
// console.log('annee couraaaant', anneeCourante);
const mp1 = moisCourant.toString();
const mp2 = moisSuivant.toString();
const amp1 = anneeCourante.toString();
const amp2 = anneeSuivante.toString();
console.log('mp1 ', mp1);
console.log('mp2 ', mp2);
console.log('amp1 ', amp1);
console.log('amp2 ', amp2);


const date_courante = new Date().toLocaleDateString('en-GB');
console.log('date courante ', date_courante);
this.blockedDocument = true;
 await this.tableFinService.updateRang(date_courante, this.codebnq1, this.codebnq2, this.codebnq3, mp1, amp1, mp2, amp2)
 .toPromise().then(data => {console.log('updateRang  ', data); });
 this.blockedDocument = false;

this.liste2 = new Array() ;
 await this.tableFinService.listeByRangInf255().toPromise().then(data => {console.log('list inf 255 ', data['_embedded'].tableFinTotals);
 this.liste2 = data['_embedded'].tableFinTotals;

});
if (this.liste2.length > 0 ) {
  for (const ob of this.liste2) {
    ob.total = Number(ob.total);
    ob.val1 = Number(ob.val1);
    ob.val2 = Number(ob.val2);
    ob.val3 = Number(ob.val3);
  }
}


console.log('maaaaaaap liste 2 ', this.liste2);

await this.tableFinService.listeByRangSup255().toPromise().then(data => {console.log('list sup 255 ', data['_embedded'].TableFin);
this.liste3 = data['_embedded'].TableFin ;
});
if (this.liste3.length > 0) {
  for (const ob of this.liste3) {
    ob.val1 = Number(ob.val1);
  }
}

}



  async ngOnInit() {
    this.blockedDocument = false;
     this.btn1 = false;
// console.log('liste', this.liste);
await this.achat0Service.getListeBanqueOrderBYFF()
.toPromise()
.then(data => {
    console.log('data ', data);
    this.listeBanqueff = data;
    });




if (this.listeBanqueff !== null && this.listeBanqueff !== undefined) {
   this.codebnq1  = this.listeBanqueff[0][0];
   this.codebnq2  = this.listeBanqueff[1][0];
   this.codebnq3  = this.listeBanqueff[2][0];
 //  console.log('codeeee1', this.codebnq1);
 //  console.log('codeeee2', this.codebnq2);
 //  console.log('codeeee3', this.codebnq3);
}

 if (this.codebnq1 !== null && this.codebnq1 !== undefined) {
  await this.banqueService.getBanqueByCode(this.codebnq1)
  .toPromise()
  .then(data => {
    this.banque1 = data;
  });
  console.log('banquuuue 1 : ', this.banque1 );

}
if (this.codebnq2 !== null && this.codebnq2 !== undefined) {
  await this.banqueService.getBanqueByCode(this.codebnq2)
  .toPromise()
  .then(data => {

    this.banque2 = data;
  });
  console.log('banquuuue 2 : ', this.banque2 );

}
if (this.codebnq3 !== null && this.codebnq3 !== undefined) {
  await this.banqueService.getBanqueByCode(this.codebnq3)
  .toPromise()
  .then(data => {

    this.banque3 = data;
  });
  console.log('banquuuue 3 : ', this.banque3 );

}


  await this.steService.getSte()
      .toPromise()
      .then(data => {
         this.ste = data['_embedded'].ste[0];
         console.log('steee', this.ste);
      });
      this.dateSave = this.ste.datsave;
    this.label = 'Mettre a jour les donnees financieres du ' +  this.dateSave ;
  }





}
