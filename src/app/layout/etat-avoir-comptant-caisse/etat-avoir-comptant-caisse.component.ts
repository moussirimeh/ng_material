import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { RecettesService } from '../services/recettes.service';
import * as jspdf from 'jspdf';
import { SteService} from '../services/ste.service';
import { Ste } from '../services/ste';
import { ComptantCaisse } from './ComptantCaisse';
import { OverlayPanel } from 'primeng/primeng';

import {formatDate } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
@Component({
  selector: 'app-etat-avoir-comptant-caisse',
  templateUrl: './etat-avoir-comptant-caisse.component.html',
  styleUrls: ['./etat-avoir-comptant-caisse.component.scss'] ,

})
export class EtatAvoirComptantCaisseComponent implements OnInit {

  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  from = new Date ();
  maxDate: Date;
  to = new Date ();
  lenght = 0;
  tn: any ;
  ComptantsCaisses: any ;
  ste: Ste;
  societe: any;
  date = '';
  date1 = '';
  date2 = '';
  comptcaisse: ComptantCaisse = {
    combineAvComp: '' ,
    dateAvComp: '' ,
    htAvComp: '' ,
    sensAvComp: '' ,
    base0AvComp: '' ,
    base10AvComp: '' ,
    base17AvComp: '' ,
    base29AvComp: '' ,
    timbreAvComp: '' ,
    montantAvComp: '' ,
    netAvComp: '' ,
  } ;
  wasInside: boolean;
  tab_cmpt_caisse: any ;
  totalht = 0;
  base0 = 0;
  base13 = 0;
  base19 = 0;
  base7 = 0;
  timbre = 0;
  montants = 0;
  tva_13 = 0 ;
  tva_19 = 0 ;
  tva_7 = 0 ;
  total_tva = 0 ;
  progressValue;
  progressVisible = false;
  validedate = true ;
  constructor(private recettesService: RecettesService,
              private steService: SteService, ) { }

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
  }
  // hostlistener
  @HostListener('document:click')
    clickout() {
      if (!this.wasInside) {
        this.ovo.hide();
      }
      this.wasInside = false;

    }
    /// méthode imprimer
  async imprimer(e) {
    this.ComptantsCaisses = new Array();
    this.lenght = 0;
    this.validedate = true ;
    this.wasInside = true;
    this.ovo.hide();
        // test sur la date
    if ( this.to > new Date()) {
      this.validedate = false ;
    }
    // initailisation
    this.progressValue = 0;
    this.progressVisible = true;
    this.totalht = 0;
    this.base0 = 0;
    this.base13 = 0;
    this.base19 = 0;
    this.base7 = 0;
    this.timbre = 0;
    this.montants = 0;
    this.tva_13 = 0;
    this.tva_19 = 0;
    this.tva_7 = 0;
    this.total_tva = 0;
    // charger les recettes selon la date
    await this.recettesService.rechercheRecettes(this.from.toLocaleDateString('en-GB'), this.to.toLocaleDateString('en-GB')).toPromise().then(
      (data) => {

        console.log(data);
        this.ComptantsCaisses = data['_embedded'].avoirComptantCaisses ;
        this.lenght = data['_embedded'].avoirComptantCaisses.length ;
        console.log(this.lenght);
        console.log(this.ComptantsCaisses);

      }
    );
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
                  doc1.text('SOCIETE.: ' + this.societe.societe, 15, 15);
                  const temps = formatDate(new Date(), ' HH:mm:ss ', 'fr-FR', '+01');
                  this.date = new Date().toLocaleDateString('en-GB');
                  this.date1 = this.from.toLocaleDateString('en-GB');
                  this.date2 = this.to.toLocaleDateString('en-GB');
                  doc1.text('Tunis, le   : ' + this.date + '  ' + temps, 148, 15);
        doc1.setFontSize(24);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Rapport des avoirs comptant Caisse', 58, 30);
        doc1.setFontSize(12);
        doc1.setFontStyle('bold');
        doc1.setFontStyle('Arial');
        doc1.text('Du  : ' + this.date1 , 15, 37);
        doc1.text('au : ' + this.date2, 50, 37);

        // entete du  tableau
        doc1.setFontSize(12);
                   doc1.line(9, 40, 205, 40);

                   doc1.setFontSize(8);
                   doc1.setFontStyle('bold');
                   doc1.text('N Fact.', 10, 45);
                   doc1.text('DATE', 38, 45);
                   doc1.text('TOTAL HT', 57, 45);
                   doc1.text('BASE 0', 82, 45);
                   doc1.text('BASE 13', 102, 45);
                   doc1.text('BASE 19', 126, 45);
                   doc1.text('BASE 7', 147, 45);
                   doc1.text('TIMBRE', 165, 45);
                   doc1.text('MONTANTS', 184, 45);
        // creer la ligne
        doc1.setFontStyle('bold');
        doc1.line(9, 48, 205, 48);
        let y = 53;
        let numPage = 1;


        for (this.tab_cmpt_caisse of this.ComptantsCaisses) {


          doc1.setFontSize(7);
          doc1.setFontStyle('Arial');
          doc1.text(this.tab_cmpt_caisse.combineAvComp, 10, y);
          doc1.text(this.tab_cmpt_caisse.dateAvComp.substring(0, 10), 38, y);
            if (this.tab_cmpt_caisse.sensAvComp = 'D') {
              this.tab_cmpt_caisse.htAvComp = -1 * parseFloat((this.tab_cmpt_caisse.htAvComp));
              this.tab_cmpt_caisse.base17AvComp = -1 * parseFloat((this.tab_cmpt_caisse.base17AvComp));
              this.tab_cmpt_caisse.netAvComp = -1 * parseFloat((this.tab_cmpt_caisse.netAvComp));
              this.tab_cmpt_caisse.base0AvComp = -1 * parseFloat((this.tab_cmpt_caisse.base0AvComp));
              this.tab_cmpt_caisse.base10AvComp = -1 * parseFloat((this.tab_cmpt_caisse.base10AvComp));
              this.tab_cmpt_caisse.base29AvComp = -1 * parseFloat((this.tab_cmpt_caisse.base29AvComp));
              this.tab_cmpt_caisse.timbreAvComp = -1 * parseFloat((this.tab_cmpt_caisse.timbreAvComp));

            }

          doc1.text(String(this.tab_cmpt_caisse.htAvComp.toFixed(3)), 63, y);
          doc1.text(String(this.tab_cmpt_caisse.base0AvComp.toFixed(3)), 84, y);
          doc1.text(String(this.tab_cmpt_caisse.base10AvComp.toFixed(3)), 106, y);
          doc1.text(String(this.tab_cmpt_caisse.base17AvComp.toFixed(3)), 127, y);
          doc1.text(String(this.tab_cmpt_caisse.base29AvComp.toFixed(3)), 149, y);
          doc1.text(String(this.tab_cmpt_caisse.timbreAvComp.toFixed(3)), 169, y);
          doc1.text(String(this.tab_cmpt_caisse.netAvComp.toFixed(3)), 191, y);

          y = y + 7;
          // premiere page
          if ((numPage === 1) && y < 277 ) {
            doc1.line(9, 40, 9, y + 5);
            doc1.line(205, 40, 205, y + 5);


          }
          if (numPage > 1 && y > 230) {
            doc1.line(9, 12, 9, 280);
            doc1.line(205, 12, 205, 280);

          }
          // passer a une nouvelle page

          if (y > 277) {
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            numPage++;
            doc1.addPage();


            // entete tableau
            doc1.line(9, 12, 205, 12);
            doc1.setFontStyle('bold');
            doc1.setFontSize(8);
            doc1.text('N Fact.', 10, 17);
            doc1.text('DATE', 38, 17);
            doc1.text('TOTAL HT', 57, 17);
            doc1.text('BASE 0', 82, 17);
            doc1.text('BASE 13', 102, 17);
            doc1.text('BASE 19', 126, 17);
            doc1.text('BASE 7', 147, 17);
            doc1.text('TIMBRE', 165, 17);
            doc1.text('MONTANTS', 184, 17);

            // creer la ligne
            doc1.setFontStyle('bold');
            doc1.line(9, 20, 205, 20);
            y = 26;
          }

        }
        for (this.tab_cmpt_caisse of this.ComptantsCaisses) {
          this.totalht = this.totalht  + (this.tab_cmpt_caisse.htAvComp);
          this.base0 = this.base0 + (this.tab_cmpt_caisse.base0AvComp);
          this.base13 = this.base13 + (this.tab_cmpt_caisse.base10AvComp);
          this.base19 = this.base19 + (this.tab_cmpt_caisse.base17AvComp);
          this.base7 = this.base7 + (this.tab_cmpt_caisse.base29AvComp);
          this.timbre = this.timbre + (this.tab_cmpt_caisse.timbreAvComp);
          this.montants = this.montants + (this.tab_cmpt_caisse.netAvComp);
          this.tva_13 = ((this.base13) * 0.13 );
          this.tva_19 = ((this.base19) * 0.19 );
          this.tva_7 = (this.base7) * 0.07 ;
          this.total_tva = ((this.base13) * 0.12 ) + ((this.base19) * 0.18 ) + ((this.base7) * 0.06 );
        }

        doc1.setFontSize(7);
        doc1.setFontStyle('Arial');
        if (y < 230) {
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            doc1.line(9, y - 2, 205, y - 2 , 'FD');
            doc1.setFontStyle('Arial');
            doc1.setFontStyle('bold');
            doc1.setFontSize(11);
            doc1.text('Totaux : ', 9, y + 3);
            doc1.setFontStyle('Arial');
            doc1.setFontStyle('bold');
            doc1.setFontSize(9);
            doc1.text(String(this.totalht.toFixed(3)), 58, y + 3);
            doc1.text(String(this.base0.toFixed(3)), 83, y + 3);
            doc1.text(String(this.base7.toFixed(3)), 104, y + 3);
            doc1.text(String(this.base19.toFixed(3)), 125, y + 3);
            doc1.text(String(this.base13.toFixed(3)), 148, y + 3);
            doc1.text(String(this.timbre.toFixed(3)), 167, y + 3);
            doc1.text(String(this.montants.toFixed(3)), 189, y + 3);
            doc1.setFontStyle('Arial');

            doc1.setFontSize(20);
            doc1.setFontStyle('bold');
           doc1.line(9 , y + 5, 205, y + 5 , 'FD');
            doc1.setFontStyle('Arial');
            doc1.setFontSize(9);
            doc1.text('TVA 13 % : ' + String(this.tva_13.toFixed(3)), 10, y + 10);
            doc1.text('TVA 19 % : ' + String(this.tva_19.toFixed(3)), 10, y + 17);
            doc1.text('TVA 7 % : ' + String(this.tva_7.toFixed(3)), 10, y + 25);
            doc1.setFontStyle('bold');
            doc1.setFontSize(9);
            doc1.text('TOTAL TVA: ' + String(this.total_tva.toFixed(3)), 10, y + 35);

          }
          doc1.setFontSize(7);
          doc1.setFontStyle('Arial');
           if (y > 230) {
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            numPage++;
            doc1.addPage();
             y = 14 ;
             doc1.line(9, y - 2, 205, y - 2 , 'FD');
            doc1.setFontStyle('Arial');
            doc1.setFontStyle('bold');
            doc1.setFontSize(9);
            doc1.text('Totaux : ', 9, y + 3);
            doc1.text(String(this.totalht.toFixed(3)), 58, y + 3);
            doc1.text(String(this.base0.toFixed(3)), 83, y + 3);
            doc1.text(String(this.base7.toFixed(3)), 104, y + 3);
            doc1.text(String(this.base19.toFixed(3)), 125, y + 3);
            doc1.text(String(this.base13.toFixed(3)), 148, y + 3);
            doc1.text(String(this.timbre.toFixed(3)), 167, y + 3);
            doc1.text(String(this.montants.toFixed(3)), 189, y + 3);
            doc1.setFontStyle('Arial');
            doc1.setFontSize(10);
            doc1.line(9, y + 5, 205, y + 5 , 'FD');
            doc1.line(9 , y - 2, 9 , y + 5 , 'FD');
            doc1.line(205 , y - 2, 205, y + 5 , 'FD');

            doc1.text('TVA 13 % : ' + String(this.tva_13.toFixed(3)), 10, y + 10);
            doc1.text('TVA 19 % : ' + String(this.tva_19.toFixed(3)), 10, y + 17);
            doc1.text('TVA 7 % : ' + String(this.tva_7.toFixed(3)), 10, y + 25);
            doc1.setFontStyle('bold');
            doc1.setFontSize(10);
            doc1.text('TOTAL TVA: ' + String(this.total_tva.toFixed(3)), 10, y + 35);

           }

           // derniere page
           if (numPage > 1 && y < 277) {
            if (230 > y ) {
              doc1.line(9, 12, 9, y);
              doc1.line(205, 12, 205, y);
              doc1.line(9, y + 5, 205, y + 5 , 'FD');
            doc1.line(9 , y - 2, 9 , y + 5 , 'FD');
            doc1.line(205 , y - 2, 205, y + 5 , 'FD');
            doc1.setFontSize(7);
            doc1.setFontStyle('Arial');
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

            } else if (y > 230) {
            doc1.line(9, 12, 9, y);
            doc1.line(205, 12, 205, y);
            doc1.setFontSize(7);
            doc1.setFontStyle('Arial');
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);

          }

          }
    this.progressValue = 100;
    // message d'erreur si date invalide ou n'existe pas aucune avoir
   if (this.lenght === 0 || this.validedate  === false ) {

    this.ms = 'Aucune avoir trouvée!';
     this.ovo.show(e, document.getElementById('visualiser'));
        }
    // si on click sur visualiser
    if (this.lenght !== 0 && this.validedate  === true) {

      window.open(doc1.output('bloburl'), '_blank');

    }
    this.progressVisible = false;
  }

}
