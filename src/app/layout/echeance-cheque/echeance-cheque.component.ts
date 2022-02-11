import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { OverlayPanel } from 'primeng/primeng';
import { Caisse } from '../services/caisse';
import { CaisseService } from '../services/caisse.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import * as jspdf from 'jspdf';
import { forEach } from '@angular/router/src/utils/collection';
import { globals } from 'src/environments/environment';

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
  selector: 'app-echeance-cheque',
  templateUrl: './echeance-cheque.component.html',
  styleUrls: ['./echeance-cheque.component.scss']
})
export class EcheanceChequeComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  from = new Date();
  to = new Date();
  tn: any;
  cheques: Caisse[];
  validedate = true;
  dateDisabled = false;
  ngselectDisabled = false;
  wasInside: boolean;
  date1: any;
  date2 = '';
  datedeb: any;
  datefin = '';
  btnAfficher = true;
  valide = false;
  societe = null;
  constructor(private caisseService: CaisseService,
    private config: NgSelectConfig) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
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
      dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
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
    this.cheques = new Array();
  }

    // réaisir
    introdure(): void {
      this.dateDisabled = false;
      this.ngselectDisabled = false;
      this.cheques = null;
      this.valide = false;
      this.btnAfficher = true;
    }

  // affichage des cheques
  async AfficherCheques(e) {

    this.validedate = true;
    this.ovo.hide();
    this.wasInside = true;
    // test sur la date
    if (this.to > new Date()) {
      this.validedate = false;
      this.ms = 'Date invalide!!';
      this.ovo.show(e, document.getElementById('date'));
    }

    // affichage des cheques si la date vraie
    if (this.validedate === true) {
      this.datedeb = this.from.toLocaleDateString('en-GB');
      this.datefin = this.to.toLocaleDateString('en-GB');
      this.date1 = this.from.toLocaleDateString('en-GB') + ' 00:00:00';
      this.date2 = this.to.toLocaleDateString('en-GB') + ' 23:59:00';

      await this.caisseService.echeanceCheque(this.date1, this.date2).
        toPromise().then(
          (data) => {
            this.cheques = data['_embedded'].caisses;
          }
        );
      // si pas de cheques
      if (this.cheques.length === 0) {
        this.ms = 'Aucun chèques avec ces critères!';
        this.ovo.show(e, document.getElementById('afficher'));
        this.cheques = null;
        this.dateDisabled = false;
        this.ngselectDisabled = false;
        this.btnAfficher = true;
        this.valide = false;
      } else {
        // this.rowSelected();
        this.dateDisabled = true;
        this.ngselectDisabled = true;
        this.btnAfficher = false;
        this.valide = true;
      }
    }
  }
    // imprimer
    async imprimer(evenement) {
      const doc1 = new jspdf();
      doc1.setFontSize(12);
      doc1.setFontStyle('Arial');
      this.societe = globals.societe;
      doc1.text('SOCIETE..:  ' + this.societe, 9, 15);
      const temps = new Date().toLocaleDateString('en-GB');
      doc1.text('Tunis, le : '  + temps, 165, 20);
      doc1.setFontSize(24);
      doc1.setFontStyle('bold');
      doc1.text('Etat des chèques en Caisse', 105, 33, 'center');
      doc1.setFontSize(12);
      doc1.text('Période : Du ' + this.datedeb + ' au ' + this.datefin , 9, 43);
      let total = 0;
      // entete du  tableau
      doc1.line(9, 46, 205, 46);
      // doc1.line(9, 46, 9, 280);
      // doc1.line(205, 46, 205, 280);
      doc1.setFontSize(10);
      doc1.setFontStyle('bold');
      doc1.text('N° Chèque', 10, 51);
      doc1.text('Banque', 36, 51);
      doc1.text('Date', 62, 51);
      doc1.text('Montant', 88, 51);
      doc1.text('Échéance', 115, 51);
      doc1.text('Observation', 145, 51);

      // creer la ligne
      doc1.line(9, 54, 205, 54);
      let y = 59;
      let numPage = 1;
      doc1.setFontSize(10);
      doc1.setFontStyle('Arial');
      // créer la ligne vertical
      doc1.setFontStyle('bold');

      this.cheques.forEach (function (value) {
        doc1.setFontSize(9);
        doc1.setFontStyle('Arial');
        doc1.text(value.cheque, 10, y);
        doc1.text(value.banque, 36, y);
        doc1.text(value.date, 62, y);
        doc1.text(value.montant, 100, y, 'right');
        doc1.text(value.ech, 115, y);
        doc1.text(value.observat, 145, y);
        total = total + Number(value.montant);

        y = y + 7;
        // passer a une nouvelle page

         if (y > 277) {
          //  doc1.line(9, y, 205, y, 'FD');
          //  doc1.line(9, 46, 9, y);
          //  doc1.line(205, 46, 205, y);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          // entete tableau
          doc1.line(9, 12, 205, 12);

          doc1.setFontSize(12);
          doc1.text('N° Chèque', 10, 17);
          doc1.text('Banque', 36, 17);
          doc1.text('Date', 62, 17);
          doc1.text('Montant', 88, 17);
          doc1.text('Échéance', 115, 17);
          doc1.text('Observation', 145, 17);

          // creer la ligne
          doc1.setFontStyle('bold');
          doc1.line(9, 20, 205, 20);
          y = 26;
          // if (numPage > 1) {
          //   doc1.line(9, y - 14, 9, y + 254, 'FD');
          //   doc1.line(205, y - 14, 205, y + 254, 'FD');
          // }
         }
       });
      doc1.setFontSize(12);
      doc1.setFontStyle('bold');
      doc1.line(9, y - 5, 205, y - 5, 'FD');
      doc1.text('Total:', 10, y);
      doc1.text(total.toFixed(3), 100, y, 'right');
      // doc1.line(9, 46, 9, y + 7);
      // doc1.line(205, 46, 205, y + 7);
      doc1.line(9, y + 2, 205, y + 2, 'FD');
      doc1.setFontSize(9);
      doc1.setFontStyle('Arial');
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');
     // this.ngOnInit();
      // message de suivi pour le processus de visualisation
    }
}
