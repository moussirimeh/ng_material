import { Component, OnInit, ViewChild } from '@angular/core';
import { FactureService } from '../services/facture.service';
import * as jspdf from 'jspdf';
import { DatePipe } from '@angular/common';
import { OverlayPanel } from 'primeng/primeng';
import { HostListener } from '@angular/core';
import { globals } from 'src/environments/environment';

@Component({
  selector: 'app-ventes-suspension-tva',
  templateUrl: './ventes-suspension-tva.component.html',
  styleUrls: ['./ventes-suspension-tva.component.scss'],
  providers: [DatePipe]
})
export class VentesSuspensionTvaComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  datedebut = new Date ();
  datefin = new Date ();
  minDate = new Date (2010 , 12, 1 );
  readonly: boolean ;
  tn: any;
  listeVente: any;
  showConfirm = false;
  societe: string;
  TotauxMontant = 0;
  TotauxTimbre = 0;
  TotauxTTC = 0;
  adresse: string;
  msg: string;
  wasInside: any;
  constructor(
    private factureService: FactureService ,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.TotauxMontant = 0;
    this.TotauxTimbre = 0;
    this.TotauxTTC = 0;
    this.readonly = false ;
    this.showConfirm = false ;
    this.datedebut = new Date ();
    this.datefin = new Date ();
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
       this.op.hide();
  }
  async afficher(e) {

    console.log('dateFin', this.datefin);
    console.log('datedebut' , this.datedebut.toLocaleDateString('en-GB'));
    await this.factureService
    .listeVentesSuspensionTva(this.datedebut.toLocaleDateString('en-GB'), this.datefin.toLocaleDateString('en-GB'))
    .toPromise()
    .then(data => {
      this.listeVente = data;
    });
    console.log('listevente : ' , this.listeVente );
    if (this.listeVente.length !== 0) {
      const doc1 = new jspdf();
      doc1.setFontSize(11);
      doc1.setFontStyle('Arial');
      this.societe = globals.societe;
      this.adresse = globals.adresse;
      doc1.text('Société :  ' + this.societe, 9, 15);
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
      doc1.text('Ventes En Suspension de TVA', 50, 30);
      doc1.setFontStyle('Arial');
      doc1.setFontSize(11);
     doc1.setTextColor(0, 0, 0);
     doc1.text('Du : ' + this.datedebut.toLocaleDateString('en-GB') + ' au: ' + this.datefin.toLocaleDateString('en-GB'), 9, 40);

     // entete du  tableau
     doc1.setFontStyle('bold');
     doc1.line(9, 45, 205, 45);
     doc1.line(9, 45, 9, 277);
     doc1.line(205, 45, 205, 277);
     doc1.setFontStyle('bold');
     doc1.setTextColor(0, 0, 0);
     doc1.text('N°Fct', 11, 50);
     doc1.text('Date', 24, 50);
     doc1.text('Nom client', 41, 50);
     doc1.text('CodeTVA', 148, 50, 'right');
     doc1.text('Mnt HT', 155, 50);
     doc1.text('Timbre', 185, 50, 'right');
     doc1.text('Mnt TTC', 204, 50, 'right');
     // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 53, 205, 53);
     let y = 62;
     let  numPage = 1;
     this.TotauxMontant = 0;
     this.TotauxTimbre = 0;
     this.TotauxTTC = 0;
     for ( let i = 0 ; i < this.listeVente.length; i++) {
       const obj = this.listeVente[i];
        console.log('obj', obj);
        console.log('obj', obj);
         doc1.setFontStyle('Arial');
         doc1.text(obj[0], 11, y, 'left');
         const dateformat: string = this.datePipe.transform(obj[1], 'dd/MM/yyyy');
         doc1.text(dateformat, 22, y, 'left');
         doc1.text(obj[2], 41, y, 'left');
         doc1.text(obj[3], 150, y, 'right');
         doc1.text(Number(obj[4]).toFixed(3), 168, y, 'right');
         this.TotauxMontant = this.TotauxMontant + Number(obj[4] );
         doc1.text(Number(obj[5]).toFixed(3), 183, y, 'right');
         this.TotauxTimbre = this.TotauxTimbre + obj[5] ;
         doc1.text(Number(obj[6]).toFixed(3), 204, y, 'right');
         this.TotauxTTC = this.TotauxTTC + obj[6] ;
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
           doc1.text('N°Fct', 11, 17);
           doc1.text('Date', 24, 17);
           doc1.text('Nom Client', 41, 17);
           doc1.text('CodeTVA', 148, 17, 'right');
           doc1.text('Mnt HT', 168, 17, 'right');
           doc1.text('Timbre', 183, 17, 'right');
           doc1.text('Mnt TTC', 204, 17, 'right');
           // creer la ligne
           doc1.line(9, 20, 205, 20);
           y = 24;
         }
     }

     doc1.setFontStyle('Arial');
     doc1.text('Totaux :', 11, y);
     doc1.text(Number(this.TotauxMontant).toFixed(3), 168, y, 'right');
     doc1.text(Number(this.TotauxTimbre).toFixed(3), 183, y, 'right');
     doc1.text(Number(this.TotauxTTC).toFixed(3), 204, y, 'right');
     doc1.text('Nombre de Facture :' + this.listeVente.length, 11, y + 7);
     doc1.line(9, 277, 205, 277);
     doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
     window.open(doc1.output('bloburl'), '_blank');

    } else {
      this.msg = 'Aucun avoir pour cette date !! ';
      this.op.show(e, document.getElementById('btn'));
    }
  }

}
