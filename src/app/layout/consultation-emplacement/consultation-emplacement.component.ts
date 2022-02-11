import { Component, OnInit, ViewChild , HostListener } from '@angular/core';
import { GridComponent, SearchSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { MouveinventService } from '../services/mouveinvent.service';
import { OverlayPanel } from 'primeng/primeng';
import * as jspdf from 'jspdf';
import { SteService } from '../services/ste.service';
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
  selector: 'app-consultation-emplacement',
  templateUrl: './consultation-emplacement.component.html',
  styleUrls: ['./consultation-emplacement.component.scss']
})
export class ConsultationEmplacementComponent implements OnInit {
  selectionOptions: SelectionSettingsModel;
  @ViewChild('grid1')
  public grid1: GridComponent;
  public searchOptions: SearchSettingsModel;
  readonly = false ;
  emplacement: string;
  btnaff = false ;
  dateServeur: Date;
  year: number;
  month: number;
  dateinvent: string;
  liste = new Array() ;
  invent: string;
  @ViewChild('op')
  public op: OverlayPanel;
  msg: String;
  wasInside: any;
  codearticle: string ;
  constructor(
    private mouveinventService: MouveinventService ,
    private steService: SteService
  ) { }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {

      this.op.hide();
    }
    this.wasInside = false;
  }

  ngOnInit() {
    document.getElementById('emplacement').focus();
  }
  async afficher(e) {
    this.wasInside = true;
    await this.steService
    .getDateServeur()
    .toPromise()
    .then((data: string) => (this.dateServeur = new Date(data)));
     this.year = this.dateServeur.getFullYear();
     this.month = this.dateServeur.getMonth() + 1;
     this.dateinvent = String(this.year).substring(2, 4) ;

     if (this.month === 1) {
      this.dateinvent = String(Number(this.dateinvent) - 1) ;
     }
     console.log('year ***** ' + String(this.year).length);
     console.log('dateinvent ***** ' + this.dateinvent);
    this.invent = 'INVENT' + this.dateinvent ;
    const combine = this.invent + ' ' + this.emplacement ;
    console.log('combine ****' , combine );

    await this.mouveinventService
    .getEmlacementInvt(combine)
    .toPromise()
    .then((data) => {
      console.log('liste inventaire ', data);
      this.liste = data['_embedded'].emplacementInventaires;
    });

    if (this.liste.length !== undefined && this.liste !== null &&  this.liste.length > 0) {
    for (let i = 0 ; i < this.liste.length ; i++) {
      this.liste[i].quantite = Number(this.liste[i].quantite).toFixed(0) ;
      this.liste[i].qtestk = Number(this.liste[i].qtestk).toFixed(0) ;
    }
    this.btnaff = true ;
} else { this.msg = ' Emplacement Inéxistant  !' ;
this.op.show(e, document.getElementById('emp')) ; }






  }


  initialiser() {
    this.btnaff = false ;
    this.liste = new Array() ;
    this.op.hide();
  }
  recherche() {
    console.log('code **** ' , this.codearticle );
    const findrowIndex = this.liste.findIndex((el) => (el.code).toUpperCase() >= (this.codearticle).toUpperCase());
    console.log('****index grid*****', findrowIndex);
    this.grid1.selectRows([findrowIndex]);
  }

  async Apercu() {
    const doc1 = new jspdf();
    doc1.setFontSize(10);
     let temps = String(new Date().getUTCHours() + 1);
     temps = temps + ':' + String(new Date().getUTCMinutes());
     temps = temps + ':' + String(new Date().getUTCSeconds());
     console.log('datedu jour ', temps );
     await this.steService
    .getDateServeur()
    .toPromise()
    .then((data: string) => (this.dateServeur = new Date(data)));
     doc1.setFontStyle('bold');
     doc1.text('Liste des articles dans l\'emplacement : '  + this.emplacement + '   Editée le  ' + this.dateServeur.toLocaleDateString()
     + '  ' + temps , 40, 15);
     doc1.setFontSize(12);
     // entete du  tableau
     doc1.setFontStyle('bold');
     doc1.line(1, 25, 209, 25);
     doc1.line(1, 25, 1, 277);
     doc1.line(209, 25, 209, 277);
     doc1.setTextColor(0, 0, 0);
     doc1.text('N°', 2, 30);
     doc1.text('Code', 15, 30);
     doc1.text('Designation', 80, 30);
     doc1.text('Qteinv', 163, 30, 'right');
     doc1.text('Qtestock', 203, 30 , 'right');
     // creer la ligne
     doc1.line(1, 33, 209, 33);
     let y = 37;
     let  numPage = 1;
        for (let i = 0 ; i < this.liste.length ; i++) {
         doc1.setFontSize(10);
         doc1.setFontStyle('Arial');
         doc1.text(String(i + 1), 2, y);
         doc1.text(this.liste[i].code, 15, y);
         doc1.text(this.liste[i].design, 80, y);
         doc1.text(this.liste[i].quantite, 160, y, 'right');
         doc1.text(this.liste[i].qtestk, 200, y, 'right');

         y = y + 7;
         if (y > 277) {
           doc1.line(1, 277, 209, 277);
           doc1.setFontSize(12);
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
           doc1.text('N°', 2, 17);
           doc1.text('Code', 15, 17);
           doc1.text('Designation', 80, 17);
           doc1.text('Qteinv', 163, 17, 'right');
           doc1.text('Qtestock', 203, 17 , 'right');
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
