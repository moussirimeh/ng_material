import { Component, OnInit , HostListener, ViewChild } from '@angular/core';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { RapportComptantService } from '../services/rapport-comptant.service';

import { OverlayPanel } from 'primeng/primeng';

registerLocaleData(localeFr);
@Component({
  selector: 'app-rapportreservation',
  templateUrl: './rapportreservation.component.html',
  styleUrls: ['./rapportreservation.component.scss']
})
export class RapportreservationComponent implements OnInit {
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  from = new Date ();
  maxDate: Date;
  to = new Date ();
  tn: any ;

 reservationvente: any;
  validedate = true;
  wasInside: boolean;
  
  tab_reserv: any ;
  TotalHt = 0;
  base0 = 0;
  base13 = 0;
  TVA13 = 0;
  base19 = 0;
  TVA19 = 0;
  base7 = 0;
  TVA7=0;
  timbre = 0;
  montantsttc = 0;
  nmrfacture;
  lenght = 0;
  progressValue;
  progressVisible = false;
  ste: Ste;
  societe: any;
  date = '';
  date1 = '';
  date2 = '';
  
  constructor( private steService: SteService,
    private rapportComptantService: RapportComptantService,
   
    ) { }

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
  
    this.from = new Date;
    this.to = new Date();
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ovo.hide();
    }
    this.wasInside = false;

  }
  async imprimer (e) {
    // initailisation
    this.ovo.hide();
    this.wasInside = true;
    this.progressValue = 0;
    this.progressVisible = true;
    this.TotalHt = 0;
    this.base0 = 0;
    this.base13 = 0;
    this.TVA13 = 0;
    this.base19 = 0;
    this.TVA19 = 0 ;
    this.base7 = 0;
    this.TVA7 = 0;
    this.timbre = 0;
    this.montantsttc = 0;
    
    this.validedate = true ;
    this.wasInside = true;
    if ( this.to > new Date()) {
      this.validedate = false ;
    }
   

      await this.rapportComptantService
      .getRapportReservation(
      this.from.toLocaleDateString('en-GB'), this.to.toLocaleDateString('en-GB'))
      .toPromise()
      .then(data => {
        this.reservationvente = data['_embedded'].rapportComptant;
       this.lenght = data['_embedded'].rapportComptant.length ;
        //console.log(data);
       
      });

      const doc1 = new jspdf();
      doc1.setFontSize(10);
      doc1.setFontStyle('Arial');

      await this.steService
                  .getSte()
                  .toPromise()
                  .then(data => {
                    this.ste = data['_embedded'].ste;
                    this.societe = this.ste[0];
                  });
      doc1.text('SOCIETE.:  ' + this.societe.societe, 9, 15);
      doc1.text('ADRESSE..:  ' + this.societe.adresse, 9, 20);
       const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                  this.date = new Date().toLocaleDateString('en-GB');
                  this.date1 = this.from.toLocaleDateString('en-GB');
                  this.date2 = this.to.toLocaleDateString('en-GB');
      doc1.text('Tunis, le : ' + this.date + '  ' + temps, 148, 15);

      doc1.setFontSize(18);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Rapport des Réservations', 60, 33);
        doc1.setFontSize(10);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Du  :  ' + this.date1 , 9, 47);
        doc1.text('au :  ' + this.date2, 43, 47);
         // entete du  tableau
         doc1.setFontSize(12);
         doc1.line(9, 50, 205, 50);
         doc1.setFontSize(10);

         doc1.text('N Fact.', 10, 55);
        
         doc1.text('Total HT', 41, 55);
         doc1.text('BASE 0', 62, 55);
         doc1.text('BASE 13', 77, 55);
         doc1.text('TVA13', 94, 55);
         doc1.text('BASE19', 109, 55);
         doc1.text('TVA19', 124, 55);
         doc1.text('BASE 7', 139, 55);
         doc1.text('TVA7', 154, 55);
         doc1.text('Timbre', 170, 55);
         doc1.text('MNt TTC', 184, 55);
        // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 57, 205, 57);
       let y = 62;
       let numPage = 1;


       for (this.tab_reserv of this.reservationvente) {
        console.log(this.tab_reserv);

        doc1.setFontSize(10);
        doc1.setFontStyle('Arial');
        doc1.setFontSize(8);
        doc1.text(this.tab_reserv.combin, 11, y);
       
          this.tab_reserv.TotalHt =  parseFloat((this.tab_reserv.ht));
          this.tab_reserv.base0 = parseFloat((this.tab_reserv.base0));
          this.tab_reserv.base13 = 0.12 * parseFloat((this.tab_reserv.base10));
          this.tab_reserv.TVA13 =   parseFloat((this.tab_reserv.base10));
         
          this.tab_reserv.base19=   parseFloat((this.tab_reserv.base17));
          this.tab_reserv.TVA19 = 0.18 * parseFloat((this.tab_reserv.base17));
          this.tab_reserv.base7 =  0.06 * parseFloat((this.tab_reserv.base29));
          this.tab_reserv.TVA7 =  parseFloat((this.tab_reserv.base29));
          this.tab_reserv.timbreav =  parseFloat((this.tab_reserv.timbre));
          this.tab_reserv.montanTTC =  parseFloat((this.tab_reserv.net 
         + this.tab_reserv.base0 + this.tab_reserv.base13 + this.tab_reserv.TVA13
         +this.tab_reserv.base19 + this.tab_reserv.TVA19 + this.tab_reserv.base7 +

         this.tab_reserv.TVA7+ this.tab_reserv.timbre ));
        doc1.setFontSize(8);
        doc1.text(String(this.tab_reserv.TotalHt.toFixed(3)), 58, y, 'right');
        doc1.text(String(this.tab_reserv.base0.toFixed(3)), 76, y, 'right');
        doc1.text(String(this.tab_reserv.base13.toFixed(3)), 91, y, 'right');
        doc1.text(String(this.tab_reserv.TVA13.toFixed(3)), 108, y, 'right');
        doc1.text(String(this.tab_reserv.base19.toFixed(3)), 122, y, 'right');
        doc1.text(String(this.tab_reserv.TVA19.toFixed(3)), 137, y, 'right');
        doc1.text(String(this.tab_reserv.base7.toFixed(3)), 153, y, 'right');
        doc1.text(String(this.tab_reserv.TVA7.toFixed(3)), 167, y, 'right');
        doc1.text(String(this.tab_reserv.timbreav.toFixed(3)), 182, y, 'right');
        doc1.text(String(this.tab_reserv.montanTTC.toFixed(3)), 203, y, 'right');


        y = y + 7;
        doc1.line(9, y - 4 , 205, y - 4 );
        doc1.line(9, y - 4, 205, y - 4);
           // premiere page
       if ((numPage === 1) && y < 277 ) {
        doc1.line(9, 50, 9, y + 3);
        doc1.line(205, 50, 205, y + 3);
   doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);


      }
      if (numPage > 1 && y < 277) {
        doc1.line(9, 12, 9, y + 3);
        doc1.line(205, 12, 205, y + 3);
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

      }
    


    
      if (y > 277) {
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

        numPage++;
        doc1.addPage();
        doc1.line(9, 12, 205, 12);
       doc1.setFontSize(10);

       doc1.text('N Fact.', 10, 17);
      
       doc1.text('Total HT', 41, 17);
       doc1.text('BASE 0', 62, 17);
       doc1.text('BASE 13', 77, 17);
       doc1.text('TVA13', 94, 17);
       doc1.text('BASE19', 109, 17);
       doc1.text('TVA19', 124, 17);
       doc1.text('BASE 7', 139, 17);
       doc1.text('TVA7', 154, 17);
       doc1.text('Timbre', 170, 17);
       doc1.text('MNt TTC', 184, 17);
   // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 20, 205, 20);
     y = 26;
      }

      }
      // calcul totaux 

      for (this.tab_reserv of this.reservationvente) {
        this.TotalHt = this.TotalHt + ( parseFloat(this.tab_reserv.ht) ) ;
        this.base0 = this.base0 + (parseFloat(this.tab_reserv.base0)) ;

        this.base13 = this.base13 + (parseFloat(this.tab_reserv.base10)) ;
        this.TVA13 = this.TVA13 + ((0.12* parseFloat(this.tab_reserv.base10))) ;

        this.base19 = this.base19 + (parseFloat(this.tab_reserv.base17)) ;
        this.TVA19 = this.TVA19 + ( (0.18 * parseFloat(this.tab_reserv.base17)))  ;

        this.base7 = this.base7 + (parseFloat( this.tab_reserv.base29 )) ;
        this.TVA7 = this.TVA7 + ((0.06 * parseFloat(this.tab_reserv.base29)));
        this.timbre = this.timbre + ( parseFloat(this.tab_reserv.timbre)) ;
        this.montantsttc = this.montantsttc + (parseFloat(this.tab_reserv.net));
     
       
      }

      this.TVA19 = this.TVA19 / 100;
      this.TVA19 =  parseInt(this.TVA19.toString());
      console.log(this.base13);
      console.log(this.TVA13);
      console.log(this.base19);
      console.log(this.TVA19);

      if (y < 270) {

        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
       // appel  totaux ///
        doc1.text('Totaux : ', 9, y);
        doc1.text(String(this.TotalHt.toFixed(3)), 58, y, 'right');
        doc1.text(String(this.base0.toFixed(3)), 76, y, 'right');
        doc1.text(String(this.base13.toFixed(3)), 91, y, 'right');
        doc1.text(String(this.TVA13.toFixed(3)), 108, y, 'right');
        doc1.text(String(this.base19.toFixed(3)), 122, y, 'right');
        doc1.text(String(this.TVA19), 137, y, 'right');
        //doc1.text(String(this.TVA19.toFixed(3)), 137, y, 'right');
        doc1.text(String(this.base7.toFixed(3)), 153, y, 'right');
        doc1.text(String(this.TVA7.toFixed(3)), 167, y, 'right');
        doc1.text(String(this.timbre.toFixed(3)), 182, y, 'right');
        doc1.text(String(this.montantsttc.toFixed(3)), 203, y, 'right');

        doc1.line(9, y + 3 , 205, y + 3 , 'FD');

      }
      console.log(this.TVA19);



      if (y  > 270) {
        numPage++;
        doc1.addPage();
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

         y = 15 ;
         doc1.line(9, y - 3, 205, y - 3 , 'FD');
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.setFontSize(8);
        // appel manquer totaux ///
        doc1.text('Totaux : ', 9, y + 2);
        doc1.setFontSize(8);
        doc1.text(String(this.tab_reserv.TotalHt.toFixed(3)), 58, y+2);
        doc1.text(String(this.tab_reserv.base0.toFixed(3)), 76,  y+2);
        doc1.text(String(this.tab_reserv.base13.toFixed(3)), 91, y+2);
        doc1.text(String(this.tab_reserv.TVA13.toFixed(3)), 108, y+2);
        doc1.text(String(this.tab_reserv.base19.toFixed(3)), 122, y+2);
       // doc1.text(String(this.tab_reserv.TVA19.toFixed(3)), 137, y+2);
        doc1.text(String(this.TVA19), 137, y+2);
        doc1.text(String(this.tab_reserv.base7.toFixed(3)), 153, y+2);
        doc1.text(String(this.tab_reserv.TVA7.toFixed(3)), 167, y+2);
        doc1.text(String(this.tab_reserv.timbreav.toFixed(3)), 182, y+2);
        doc1.text(String(this.tab_reserv.montantsttc.toFixed(3)), 203, y+2);
        doc1.setFontStyle('Arial');
        doc1.setFontSize(10);
        doc1.line(9, y + 3, 205, y + 3 , 'FD');
         doc1.line(9 , y - 2, 9 , y + 3 , 'FD');
         doc1.line(205 , y - 2, 205, y + 3, 'FD');

      

      }



      if ( this.lenght === 0 ||this.validedate === false ) {

        this.ms = 'Aucune réservation pour cette  péroide !';
        this.ovo.show(e, document.getElementById('imprimer'));

            }
            if ( this.lenght !== 0 && this.validedate === true ) {

              window.open(doc1.output('bloburl'), '_blank');
            }
    
  }}
