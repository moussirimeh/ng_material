import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { RecettesService } from '../services/recettes.service';
import { SteService } from '../services/ste.service';
import { FactureService } from '../services/facture.service';
import { Ste } from '../services/ste';
import * as jspdf from 'jspdf';
import { OverlayPanel } from 'primeng/primeng';
import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { RapportComptantService } from '../services/rapport-comptant.service';
import { globals } from 'src/environments/environment';

registerLocaleData(localeFr);
@Component({
  selector: 'app-etat-avoirs-terme',
  templateUrl: './etat-avoirs-terme.component.html',
  styleUrls: ['./etat-avoirs-terme.component.scss']
})
export class EtatAvoirsTermeComponent implements OnInit {

  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  from = new Date ();
  maxDate: Date;
  to = new Date ();
  tn: any ;
  gloabal = '';
  avoirstermes: any;
  avoirscomptant: any;
  validedate = true;
  wasInside: boolean;
  tab_avoir_terme: any ;
  tab_avoir: any ;
  montantht = 0;
  base0 = 0;
  base13 = 0;
  base19 = 0;
  base7 = 0;
  montantbase0 = 0;
  montantbase13 = 0;
  montantbase19 = 0;
  montantbase7 = 0;
  timbre = 0;
  montantsttc = 0;
  tva_13 = 0 ;
  tva_19 = 0 ;
  tva_7 = 0 ;
  total_tva = 0 ;
  nmrfacture;
  progressValue;
  progressVisible = false;
  ste: Ste;
  societe: any;
  date = '';
  date1 = '';
  date2 = '';
  lenght = 0;
  name_module;


  constructor(private recetteService: RecettesService,
              private steService: SteService,
              private rapportComptantService: RapportComptantService,
              private factureService: FactureService,
              ) { }

  ngOnInit() {
    // traduire calendrier en francais
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
    this.name_module = globals.selectedMenu;
    console.log(this.name_module);

    if (this.name_module === 'Etat Avoirs Comptant') {
      this.gloabal = 'comptant' ;
      console.log(this.gloabal);
    }
    if (globals.selectedMenu === 'Etat Avoirs Terme') {
      this.gloabal = 'Terme' ;
      console.log(this.gloabal);
    }
    this.from = new Date;
    this.to = new Date();

  }


  // hostlistener
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
    this.montantht = 0;
    this.base0 = 0;
    this.base13 = 0;
    this.base19 = 0;
    this.base7 = 0;
    this.timbre = 0;
    this.montantsttc = 0;
    this.montantbase19 = 0;
    this.montantbase7 = 0;
    this.montantbase13 = 0;
    this.total_tva = 0;
    this.validedate = true ;
    this.wasInside = true;
    if ( this.to > new Date()) {
      this.validedate = false ;
    }
    if (this.gloabal === 'Terme') {

      await this.factureService.rechercheAvoirsTerme(this.from.toLocaleDateString('en-GB'), this.to.toLocaleDateString('en-GB')).toPromise().then(
        (data) => {
          this.avoirstermes = data['_embedded'].avoirTermes;
          this.lenght = data['_embedded'].avoirTermes.length ;
          console.log(this.avoirstermes);
          console.log(this.lenght);

        }
      ) ;
      /// créer doc jspdf
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');

      await this.steService
                  .getSte()
                  .toPromise()
                  .then(data => {
                    this.ste = data['_embedded'].ste;
                    this.societe = this.ste[0];
                  });
      doc1.text('SOCIETE.:  ' + this.societe.societe, 9, 15);
       const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                  this.date = new Date().toLocaleDateString('en-GB');
                  this.date1 = this.from.toLocaleDateString('en-GB');
                  this.date2 = this.to.toLocaleDateString('en-GB');
      doc1.text('Tunis, le : ' + this.date + '  ' + temps, 148, 15);

      doc1.setFontSize(24);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Etat des avoirs Terme', 60, 33);
        doc1.setFontSize(12);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Du  :  ' + this.date1 , 9, 42);
        doc1.text('au :  ' + this.date2, 43, 42);
         // entete du  tableau
         doc1.setFontSize(12);
         doc1.line(9, 50, 205, 50);
         doc1.setFontSize(10);

         doc1.text('N Fact.', 10, 55);
         doc1.text('Date', 25, 55);
         doc1.text('Montant HT', 41, 55);
         doc1.text('Base 19', 62, 55);
         doc1.text('Montant', 77, 55);
         doc1.text('BASE 13', 94, 55);
         doc1.text('Montant', 109, 55);
         doc1.text('BASE 7', 124, 55);
         doc1.text('Montant', 139, 55);
         doc1.text('BASE 0', 154, 55);
         doc1.text('Timbre', 170, 55);
         doc1.text('Montant TTC', 184, 55);
     // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 57, 205, 57);
        let y = 62;
        let numPage = 1;

        for (this.tab_avoir_terme of this.avoirstermes) {
          console.log(this.tab_avoir_terme);

          doc1.setFontSize(10);
          doc1.setFontStyle('Arial');
          doc1.setFontSize(8);
          doc1.text(this.tab_avoir_terme.combine, 11, y);
          doc1.text(this.tab_avoir_terme.date.substring(0, 10), 22, y);
          if (this.tab_avoir_terme.sens = 'D') {
            this.tab_avoir_terme.montanHT = -1 * parseFloat((this.tab_avoir_terme.ht));
            this.tab_avoir_terme.base19av = -1 * parseFloat((this.tab_avoir_terme.base17));
            this.tab_avoir_terme.montantbase19 = -1 * 0.19 * parseFloat((this.tab_avoir_terme.base17));
            this.tab_avoir_terme.base13av = -1 *  parseFloat((this.tab_avoir_terme.base10));
            this.tab_avoir_terme.montantbase13 = -1 * 0.13 * parseFloat((this.tab_avoir_terme.base10));
            this.tab_avoir_terme.base7av = -1 * parseFloat((this.tab_avoir_terme.base29));
            this.tab_avoir_terme.montantbase7 = -1 * 0.07 * parseFloat((this.tab_avoir_terme.base29));
            this.tab_avoir_terme.base0av = -1 * parseFloat((this.tab_avoir_terme.base0));
            this.tab_avoir_terme.timbreav = -1 * parseFloat((this.tab_avoir_terme.timbre));
            this.tab_avoir_terme.montanTTC =  parseFloat((this.tab_avoir_terme.montanHT
              + this.tab_avoir_terme.montantbase19  + this.tab_avoir_terme.montantbase13
              + this.tab_avoir_terme.montantbase7  +
              this.tab_avoir_terme.timbreav  ));
          }
          doc1.setFontSize(8);
          doc1.text(String(this.tab_avoir_terme.montanHT.toFixed(3)), 58, y, 'right');
          doc1.text(String(this.tab_avoir_terme.base19av.toFixed(3)), 76, y, 'right');
          doc1.text(String(this.tab_avoir_terme.montantbase19.toFixed(3)), 91, y, 'right');
          doc1.text(String(this.tab_avoir_terme.base13av.toFixed(3)), 108, y, 'right');
          doc1.text(String(this.tab_avoir_terme.montantbase13.toFixed(3)), 122, y, 'right');
          doc1.text(String(this.tab_avoir_terme.base7av.toFixed(3)), 137, y, 'right');
          doc1.text(String(this.tab_avoir_terme.montantbase7.toFixed(3)), 153, y, 'right');
          doc1.text(String(this.tab_avoir_terme.base0av.toFixed(3)), 167, y, 'right');
          doc1.text(String(this.tab_avoir_terme.timbreav.toFixed(3)), 182, y, 'right');
          doc1.text(String(this.tab_avoir_terme.montanTTC.toFixed(3)), 203, y, 'right');

          y = y + 7;
          doc1.line(9, y - 4 , 205, y - 4 );
          doc1.line(9, y - 4 , 205, y - 4 );
             // premiere page
         if ((numPage === 1) && y < 277 ) {
          doc1.line(9, 50, 9, y + 2.8);
          doc1.line(205, 50, 205, y + 2.8);
     doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);


        }
        if (numPage > 1 && y < 277) {
          doc1.line(9, 12, 9, y + 4);
          doc1.line(205, 12, 205, y + 4);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

        }
        if (numPage > 1 && y > 277) {
          doc1.line(9, 12, 9, y + 4);
          doc1.line(205, 12, 205, y + 4);
         // doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

        }

        if (y > 277) {
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

          numPage++;
          doc1.addPage();
          doc1.line(9, 12, 205, 12);
         doc1.setFontSize(10);

         doc1.text('N Fact.', 10, 17);
         doc1.text('Date', 25, 17);
         doc1.text('Montant HT', 41, 17);
         doc1.text('Base 19', 62, 17);
         doc1.text('Montant', 77, 17);
         doc1.text('BASE 13', 94, 17);
         doc1.text('Montant', 109, 17);
         doc1.text('BASE 7', 124, 17);
         doc1.text('Montant', 139, 17);
         doc1.text('BASE 0', 154, 17);
         doc1.text('Timbre', 170, 17);
         doc1.text('Montant TTC', 184, 17);
     // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 20, 205, 20);
       y = 28;
        }

        }
        /// calcul des totaux
    for (this.tab_avoir_terme of this.avoirstermes) {
      this.montantht = this.montantht + ((-1) * parseFloat(this.tab_avoir_terme.ht) ) ;
      this.base19 = this.base19 + ((-1) * parseFloat(this.tab_avoir_terme.base17)) ;
      this.montantbase19 = this.montantbase19 + ((-1) * ( 0.19 * parseFloat(this.tab_avoir_terme.base17))) ;
      this.base13 = this.base13 + ( (-1) * parseFloat(this.tab_avoir_terme.base10)) ;
      this.montantbase13 = this.montantbase13 + ((-1) * (0.13 * parseFloat(this.tab_avoir_terme.base10))) ;
      this.base7 = this.base7 + ((-1) * parseFloat(this.tab_avoir_terme.base29))  ;
      this.montantbase7 = this.montantbase7 + ((-1) * (0.07 * parseFloat(this.tab_avoir_terme.base29))) ;
      this.base0 = this.base0 + ((-1) * parseFloat( this.tab_avoir_terme.base0 ));
      this.timbre = this.timbre + ((-1) * parseFloat(this.tab_avoir_terme.timbre)) ;
      this.montantsttc = this.montantsttc + ((-1) * parseFloat(this.tab_avoir_terme.net)) ;

      console.log(this.montantht);
    }
    this.total_tva = this.total_tva + this.montantbase7 + this.montantbase19 + this.montantbase13 ;


    if (y < 240) {

      doc1.setFontStyle('Arial');
      doc1.setFontStyle('bold');
      doc1.setFontSize(8);
      doc1.text('Totaux : ', 9, y + 2);
      doc1.text(String((this.montantht).toFixed(3)), 58, y + 2, 'right');
      doc1.text(String(this.base19.toFixed(3)), 76, y + 2, 'right');
      doc1.text(String(this.montantbase19.toFixed(3)), 91, y + 2, 'right');
      doc1.text(String(this.base13.toFixed(3)), 108, y + 2, 'right');
      doc1.text(String(this.montantbase13.toFixed(3)), 122, y + 2, 'right');
      doc1.text(String(this.base7.toFixed(3)), 137, y + 2, 'right');
      doc1.text(String(this.montantbase7.toFixed(3)), 153, y + 2, 'right');
      doc1.text(String(this.base0.toFixed(3)), 168, y + 2, 'right');
      doc1.text(String(this.timbre.toFixed(3)), 182, y + 2, 'right');
      doc1.text(String(this.montantsttc.toFixed(3)), 203, y + 2, 'right');
      doc1.line(9, y + 4, 205, y + 4 , 'FD');

      doc1.setFontStyle('bold');
      doc1.setFontSize(10);
      doc1.text('TOTAL TVA : ' + String(this.total_tva.toFixed(3)), 10, y + 9);
      doc1.text('Nombre de Factures : ' + String(this.lenght), 10, y + 14);

    }

    if (y > 240) {
      numPage++;
      doc1.addPage();
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

       y = 14 ;
       doc1.line(9, y - 2, 205, y - 2 , 'FD');
      doc1.setFontStyle('Arial');
      doc1.setFontStyle('bold');
      doc1.setFontSize(8);
      doc1.text('Totaux : ', 9, y + 3);
      doc1.setFontSize(8);
      doc1.text(String(this.montantht.toFixed(3)), 39, y + 3);
      doc1.text(String(this.base19.toFixed(3)), 59, y + 3);
      doc1.text(String(this.montantbase19.toFixed(3)), 78, y + 3);
      doc1.text(String(this.base13.toFixed(3)), 95, y + 3);
      doc1.text(String(this.montantbase13.toFixed(3)), 110, y + 3);
      doc1.text(String(this.base7.toFixed(3)), 125, y + 3);
      doc1.text(String(this.montantbase7.toFixed(3)), 140, y + 3);
      doc1.text(String(this.base0.toFixed(3)), 155, y + 3);
      doc1.text(String(this.timbre.toFixed(3)), 171, y + 3);
      doc1.text(String(this.montantsttc.toFixed(3)), 185, y + 3);
      doc1.setFontStyle('Arial');
      doc1.setFontSize(10);
      doc1.line(9, y + 5, 205, y + 5 , 'FD');
      doc1.line(9 , y - 2, 9 , y + 5 , 'FD');
      doc1.line(205 , y - 2, 205, y + 5 , 'FD');

      doc1.setFontStyle('bold');
      doc1.setFontSize(10);
      doc1.text('TOTAL TVA: ' + String(this.total_tva.toFixed(3)), 10, y + 9);
      doc1.text('Nombre de Factures : ' + String(this.lenght), 10, y + 14);

     }
     console.log(this.validedate);
     console.log(this.lenght);

      // message d'erreur si date invalide ou n'existe pas aucune avoir
   if (this.lenght === 0 || this.validedate === false ) {

    this.ms = 'Aucun avoir trouvée !';
    this.ovo.show(e, document.getElementById('imprimer'));

        }
    // si on click sur visualiser
    if ( this.lenght !== 0 && this.validedate === true ) {

      window.open(doc1.output('bloburl'), '_blank');
    }


    } else  if (this.gloabal === 'comptant') {
      console.log(this.gloabal);

      await this.rapportComptantService
      .getRapportAvoirComptant(
      this.from.toLocaleDateString('en-GB'), this.to.toLocaleDateString('en-GB'))
      .toPromise()
      .then(data => {
        this.avoirscomptant = data['_embedded'].rapportComptant;
        this.lenght = data['_embedded'].rapportComptant.length ;
        console.log(data);
        console.log(this.lenght);
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
        doc1.text('Rapport des avoirs Comptant', 60, 33);
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
         doc1.text('Date', 25, 55);
         doc1.text('Montant HT', 41, 55);
         doc1.text('Base 19', 62, 55);
         doc1.text('Montant', 77, 55);
         doc1.text('BASE 13', 94, 55);
         doc1.text('Montant', 109, 55);
         doc1.text('BASE 7', 124, 55);
         doc1.text('Montant', 139, 55);
         doc1.text('BASE 0', 154, 55);
         doc1.text('Timbre', 170, 55);
         doc1.text('Montant TTC', 184, 55);
        // creer la ligne
       doc1.setFontStyle('bold');
       doc1.line(9, 57, 205, 57);
       let y = 62;
       let numPage = 1;


       for (this.tab_avoir of this.avoirscomptant) {
        console.log(this.tab_avoir);

        doc1.setFontSize(10);
        doc1.setFontStyle('Arial');
        doc1.setFontSize(8);
        doc1.text(this.tab_avoir.combin, 11, y);
        doc1.text(this.tab_avoir.date.substring(0, 10), 22, y);
          this.tab_avoir.montanHT =  parseFloat((this.tab_avoir.ht));
          this.tab_avoir.base19av = parseFloat((this.tab_avoir.base17));
          this.tab_avoir.montantbase19 =  0.19 * parseFloat((this.tab_avoir.base17));
          this.tab_avoir.base13av =  parseFloat((this.tab_avoir.base10));
          this.tab_avoir.montantbase13 =  0.13 * parseFloat((this.tab_avoir.base10));
          this.tab_avoir.base7av =  parseFloat((this.tab_avoir.base29));
          this.tab_avoir.montantbase7 =  0.07 * parseFloat((this.tab_avoir.base29));
          this.tab_avoir.base0av =  parseFloat((this.tab_avoir.base0));
          this.tab_avoir.timbreav =  parseFloat((this.tab_avoir.timbre));
          this.tab_avoir.montanTTC =  parseFloat((this.tab_avoir.montanHT
            + this.tab_avoir.montantbase19  + this.tab_avoir.montantbase13
            + this.tab_avoir.montantbase7  +
            this.tab_avoir.timbreav  ));
        doc1.setFontSize(8);
        doc1.text(String(this.tab_avoir.montanHT.toFixed(3)), 58, y, 'right');
        doc1.text(String(this.tab_avoir.base19av.toFixed(3)), 76, y, 'right');
        doc1.text(String(this.tab_avoir.montantbase19.toFixed(3)), 91, y, 'right');
        doc1.text(String(this.tab_avoir.base13av.toFixed(3)), 108, y, 'right');
        doc1.text(String(this.tab_avoir.montantbase13.toFixed(3)), 122, y, 'right');
        doc1.text(String(this.tab_avoir.base7av.toFixed(3)), 137, y, 'right');
        doc1.text(String(this.tab_avoir.montantbase7.toFixed(3)), 153, y, 'right');
        doc1.text(String(this.tab_avoir.base0av.toFixed(3)), 167, y, 'right');
        doc1.text(String(this.tab_avoir.timbreav.toFixed(3)), 182, y, 'right');
        doc1.text(String(this.tab_avoir.montanTTC.toFixed(3)), 203, y, 'right');

        y = y + 7;
        doc1.line(9, y - 4 , 205, y - 4 );
        doc1.line(9, y - 4 , 205, y - 4 );
           // premiere page
       if ((numPage === 1) && y < 277 ) {
        doc1.line(9, 50, 9, y + 2.8);
        doc1.line(205, 50, 205, y + 2.8);
   doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);


      }
      if (numPage > 1 && y < 277) {
        doc1.line(9, 12, 9, y + 4);
        doc1.line(205, 12, 205, y + 4);
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

      }
      if (numPage > 1 && y > 277) {
        doc1.line(9, 12, 9, y + 4);
        doc1.line(205, 12, 205, y + 4);
       // doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

      }

      if (y > 277) {
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

        numPage++;
        doc1.addPage();
        doc1.line(9, 12, 205, 12);
       doc1.setFontSize(10);

       doc1.text('N Fact.', 10, 17);
       doc1.text('Date', 25, 17);
       doc1.text('Montant HT', 41, 17);
       doc1.text('Base 19', 62, 17);
       doc1.text('Montant', 77, 17);
       doc1.text('BASE 13', 94, 17);
       doc1.text('Montant', 109, 17);
       doc1.text('BASE 7', 124, 17);
       doc1.text('Montant', 139, 17);
       doc1.text('BASE 0', 154, 17);
       doc1.text('Timbre', 170, 17);
       doc1.text('Montant TTC', 184, 17);
   // creer la ligne
     doc1.setFontStyle('bold');
     doc1.line(9, 20, 205, 20);
     y = 26;
      }

      }

      for (this.tab_avoir of this.avoirscomptant) {
        this.montantht = this.montantht + ( parseFloat(this.tab_avoir.ht) ) ;
        this.base19 = this.base19 + (parseFloat(this.tab_avoir.base17)) ;
        this.montantbase19 = this.montantbase19 + (( 0.19 * parseFloat(this.tab_avoir.base17))) ;
        this.base13 = this.base13 + (parseFloat(this.tab_avoir.base10)) ;
        this.montantbase13 = this.montantbase13 + ( (0.13 * parseFloat(this.tab_avoir.base10))) ;
        this.base7 = this.base7 + (parseFloat(this.tab_avoir.base29))  ;
        this.montantbase7 = this.montantbase7 + ((0.07 * parseFloat(this.tab_avoir.base29))) ;
        this.base0 = this.base0 + (parseFloat( this.tab_avoir.base0 ));
        this.timbre = this.timbre + ( parseFloat(this.tab_avoir.timbre)) ;
        this.montantsttc = this.montantsttc + (parseFloat(this.tab_avoir.net)) ;

        console.log(this.montantht);
      }
      this.total_tva = this.total_tva + this.montantbase7 + this.montantbase19 + this.montantbase13 ;


      if (y < 270) {

        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');

        doc1.text('Totaux : ', 9, y);
        doc1.text(String((this.montantht).toFixed(3)), 58, y , 'right');
        doc1.text(String(this.base19.toFixed(3)), 76, y, 'right');
        doc1.text(String(this.montantbase19.toFixed(3)), 91, y , 'right');
        doc1.text(String(this.base13.toFixed(3)), 108, y , 'right');
        doc1.text(String(this.montantbase13.toFixed(3)), 122, y , 'right');
        doc1.text(String(this.base7.toFixed(3)), 137, y , 'right');
        doc1.text(String(this.montantbase7.toFixed(3)), 153, y , 'right');
        doc1.text(String(this.base0.toFixed(3)), 168, y , 'right');
        doc1.text(String(this.timbre.toFixed(3)), 182, y , 'right');
        doc1.text(String(this.montantsttc.toFixed(3)), 203, y , 'right');
        doc1.line(9, y + 3 , 205, y + 3 , 'FD');

        doc1.setFontStyle('bold');
        doc1.setFontSize(10);
        doc1.text('TOTAL TVA : ' + String(this.total_tva.toFixed(3)), 10, y + 9);
        doc1.text('Nombre de Factures : ' + String(this.lenght), 10, y + 14);

      }




      if (y  > 270) {
        numPage++;
        doc1.addPage();
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

         y = 14 ;
         doc1.line(9, y - 2, 205, y - 2 , 'FD');
        doc1.setFontStyle('Arial');
        doc1.setFontStyle('bold');
        doc1.setFontSize(8);
        doc1.text('Totaux : ', 9, y + 1);
        doc1.setFontSize(8);
        doc1.text(String(this.montantht.toFixed(3)), 39, y + 1);
        doc1.text(String(this.base19.toFixed(3)), 59, y + 1);
        doc1.text(String(this.montantbase19.toFixed(3)), 78, y + 1);
        doc1.text(String(this.base13.toFixed(3)), 95, y + 1);
        doc1.text(String(this.montantbase13.toFixed(3)), 110, y + 1);
        doc1.text(String(this.base7.toFixed(3)), 125, y + 3);
        doc1.text(String(this.montantbase7.toFixed(3)), 140, y + 1);
        doc1.text(String(this.base0.toFixed(3)), 155, y + 1);
        doc1.text(String(this.timbre.toFixed(3)), 171, y + 1);
        doc1.text(String(this.montantsttc.toFixed(3)), 185, y + 1);
        doc1.setFontStyle('Arial');
        doc1.setFontSize(10);
        doc1.line(9, y + 3, 205, y + 3 , 'FD');
         doc1.line(9 , y - 2, 9 , y + 3 , 'FD');
         doc1.line(205 , y - 2, 205, y + 3 , 'FD');

        doc1.setFontStyle('bold');
        doc1.setFontSize(10);
        doc1.text('TOTAL TVA : ' + String(this.total_tva.toFixed(3)), 10, y + 12);
        doc1.text('Nombre de Factures : ' + String(this.lenght), 10, y + 14);

      }



      if (this.lenght === 0 || this.validedate === false ) {

        this.ms = 'Aucun avoir trouvée !';
        this.ovo.show(e, document.getElementById('imprimer'));

            }
        // si on click sur visualiser
        if ( this.lenght !== 0 && this.validedate === true ) {

          window.open(doc1.output('bloburl'), '_blank');
        }


        }











    }



  }

