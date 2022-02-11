import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { EtatTva } from '../services/etat-tva';
import { EtatTvaService } from '../services/etat-tva.service';
import { DatePipe } from '@angular/common';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-etat-tva',
  templateUrl: './etat-tva.component.html',
  styleUrls: ['./etat-tva.component.scss'],
  providers: [DatePipe],
})
export class EtatTvaComponent implements OnInit {
  tn: any;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  ste: Ste;
  etatTva: EtatTva[] = [];
  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7',
  };
  styleOvPanel = {};
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }
  constructor(
    private steService: SteService,
    private etatTvaService: EtatTvaService,
    private datePipe: DatePipe
  ) {}

  async ngOnInit() {
    this.tn = {
      firstDayOfWeek: 1,
      dayNames: [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
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
        'Decembre',
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
        'Dec',
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy',
    };
    await this.steService
      .getSte()
      .toPromise()
      .then((data) => {
        this.ste = data['_embedded'].ste[0];
      });
  }
  async imprimer(index: number, e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.dateDebut <= this.dateFin) {
      let etatFactureTmp = [];
      await this.etatTvaService
        .majTranspFactures(
          this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
          this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
        )
        .toPromise()
        .then((data) => {});

      await this.etatTvaService
        .getEtatTva1(
          this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
          this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
        )
        .toPromise()
        .then((data) => {
          etatFactureTmp = data['_embedded'].etatTva;
        });

      await this.etatTvaService
        .getEtatTva2(
          this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
          this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
        )
        .toPromise()
        .then((data) => {
          etatFactureTmp = etatFactureTmp.concat(data['_embedded'].etatTva);
        });
      await this.etatTvaService
        .getEtatTva3(
          this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
          this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
        )
        .toPromise()
        .then((data) => {
          etatFactureTmp = etatFactureTmp.concat(data['_embedded'].etatTva);
        });
      await this.etatTvaService
        .getEtatTva4(
          this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
          this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
        )
        .toPromise()
        .then((data) => {
          etatFactureTmp = etatFactureTmp.concat(data['_embedded'].etatTva);
        });

      this.etatTva = etatFactureTmp.sort((obj1, obj2) => {
        if (obj1.numero > obj2.numero) {
          return 1;
        }

        if (obj1.numero < obj2.numero) {
          return -1;
        }

        return 0;
      });

      if (this.etatTva.length > 0) {
        const displayDate = new Date().toLocaleDateString('en-GB');
        const displayTime = new Date().toLocaleTimeString();
        const doc1 = new jspdf();
        // page a4 (210 x 297 mm)
        let numPage = 1;
        doc1.setFontSize(10);
        doc1.setFontStyle('arial');
        doc1.text('SOCIETE  :   ' + this.ste.societe, 10, 10);
        doc1.text('ADRESSE :   ' + this.ste.adresse, 10, 15);
        doc1.text(
          'Tunis le : ' +
            this.tn.dayNames[new Date().getDay() - 1] +
            ' ' +
            displayDate +
            ' à ' +
            displayTime,
          200,
          10,
          'right'
        );

        doc1.setFontSize(18);
        doc1.setFontStyle('arial');
        doc1.text('Etat TVA des Ventes Terme', 65, 25);

        doc1.setFontSize(10);
        doc1.setFontStyle('arial');
        doc1.text(
          'Du : ' +
            this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy') +
            '      au : ' +
            this.datePipe.transform(this.dateFin, 'dd/MM/yyyy'),
          10,
          35
        );
        doc1.setFontSize(9);
        doc1.line(5, 40, 205, 40);
        // ligne Horizontal doc1.line(x1,y1,x2,y2)

        doc1.text('N°Fact', 6, 44);
        doc1.text('Date', 17, 44);
        doc1.text('Montant HT', 29, 44);
        doc1.text('Base 7', 47, 44);
        doc1.text('Montant', 57, 44);
        doc1.text('Base 13', 69, 44);
        doc1.text('Montant', 80, 44);
        doc1.text('Base 19', 93, 44);
        doc1.text('Montant', 105, 44);
        doc1.text('Transp', 118, 44);
        doc1.text('TVATr', 130, 44);
        doc1.text('Base 0', 143, 44);
        doc1.text('Tax PM', 155, 44);
        doc1.text('Tva PM', 167, 44);
        doc1.text('Timbr', 180, 44);
        doc1.text('Mt TTC', 192, 44);
        doc1.line(5, 46, 205, 46);
        // fin entete

        // corps
        let y = 50;
        doc1.setFontSize(7);

        const totaux = {
          totalHt: 0,
          totalBase6: 0,
          totalTva6: 0,
          totalBase12: 0,
          totalTva12: 0,
          totalBase18: 0,
          totalTva18: 0,
          totalBaseTransp: 0,
          totalTvaTransp: 0,
          totalBase0: 0,
          totalBaseTaxePm: 0,
          totalTvaTpm: 0,
          totalTimbre: 0,
          totalNet: 0,
        };

        for (const eTva of this.etatTva) {
          totaux.totalHt += Number(eTva.ht);
          totaux.totalBase6 += Number(eTva.base6);
          totaux.totalTva6 += Number(eTva.tva6);
          totaux.totalBase12 += Number(eTva.base12);
          totaux.totalTva12 += Number(eTva.tva12);
          totaux.totalBase18 += Number(eTva.base18);
          totaux.totalTva18 += Number(eTva.tva18);
          totaux.totalBaseTransp += Number(eTva.baseTransp);
          totaux.totalTvaTransp += Number(eTva.tvaTransp);
          totaux.totalBase0 += Number(eTva.base0);
          totaux.totalBaseTaxePm = Number(eTva.baseTaxePm);
          totaux.totalTvaTpm += Number(eTva.tvaTpm);
          totaux.totalTimbre += Number(eTva.timbre);
          totaux.totalNet += Number(eTva.net);

          doc1.text(eTva.numero, 6, y);
          doc1.text(eTva.date, 15, y);
          doc1.text(eTva.ht, 43, y, 'right');
          doc1.text(eTva.base6, 55, y, 'right');
          doc1.text(eTva.tva6, 66, y, 'right');
          doc1.text(eTva.base12, 77, y, 'right');
          doc1.text(eTva.tva12, 88, y, 'right');
          doc1.text(eTva.base18, 104, y, 'right');
          doc1.text(eTva.tva18, 120, y, 'right');
          doc1.text(eTva.baseTransp, 131, y, 'right');
          doc1.text(eTva.tvaTransp, 141, y, 'right');
          doc1.text(eTva.base0, 157, y, 'right');
          doc1.text(eTva.baseTaxePm, 168, y, 'right');
          doc1.text(eTva.tvaTpm, 177, y, 'right');
          doc1.text(eTva.timbre, 188, y, 'right');
          doc1.text(eTva.net, 204, y, 'right');
          doc1.line(5, y + 2, 205, y + 2, 'FD');
          y = y + 6;
          if (y > 277) {
            if (numPage > 1) {
              doc1.line(5, 15, 5, 279, 'FD');
              doc1.line(205, 15, 205, 279, 'FD');
            } else {
              doc1.line(5, 40, 5, 274, 'FD');
              doc1.line(205, 40, 205, 274, 'FD');
            }
            doc1.setFontSize(9);
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            numPage++;
            doc1.addPage();
            y = 15;
            doc1.line(5, y, 205, y);
            y = y + 4;
            doc1.text('N°Fact', 6, y);
            doc1.text('Date', 17, y);
            doc1.text('Montant HT', 29, y);
            doc1.text('Base 7', 47, y);
            doc1.text('Montant', 57, y);
            doc1.text('Base 13', 69, y);
            doc1.text('Montant', 80, y);
            doc1.text('Base 19', 93, y);
            doc1.text('Montant', 105, y);
            doc1.text('Transp', 118, y);
            doc1.text('TVATr', 130, y);
            doc1.text('Base 0', 143, y);
            doc1.text('Tax PM', 155, y);
            doc1.text('Tva PM', 167, y);
            doc1.text('Timbr', 180, y);
            doc1.text('Mt TTC', 192, y);
            y = y + 2;
            doc1.line(5, y, 205, y);
            y = y + 4;
            doc1.setFontSize(7);
          }
        }
        if (numPage > 1) {
          doc1.line(5, 15, 5, y + 2, 'FD');
          doc1.line(205, 15, 205, y + 2, 'FD');
        } else {
          doc1.line(5, 40, 5, y + 2, 'FD');
          doc1.line(205, 40, 205, y + 2, 'FD');
        }

        doc1.text(totaux.totalHt.toFixed(3), 43, y, 'right');
        doc1.text(totaux.totalBase6.toFixed(3), 55, y, 'right');
        doc1.text(totaux.totalTva6.toFixed(3), 66, y, 'right');
        doc1.text(totaux.totalBase12.toFixed(3), 77, y, 'right');
        doc1.text(totaux.totalTva12.toFixed(3), 88, y, 'right');
        doc1.text(totaux.totalBase18.toFixed(3), 104, y, 'right');
        doc1.text(totaux.totalTva18.toFixed(3), 120, y, 'right');
        doc1.text(totaux.totalBaseTransp.toFixed(3), 131, y, 'right');
        doc1.text(totaux.totalTvaTransp.toFixed(3), 141, y, 'right');
        doc1.text(totaux.totalBase0.toFixed(3), 157, y, 'right');
        doc1.text(totaux.totalBaseTaxePm.toFixed(3), 168, y, 'right');
        doc1.text(totaux.totalTvaTpm.toFixed(3), 177, y, 'right');
        doc1.text(totaux.totalTimbre.toFixed(3), 188, y, 'right');
        doc1.text(totaux.totalNet.toFixed(3), 204, y, 'right');
        doc1.setFontSize(10);
        doc1.setFontStyle('bold');
        doc1.text('Totaux : ', 10, y);
        y = y + 2;
        doc1.line(5, y, 205, y);
        y = y + 5;
        doc1.text(
          'Total TVA : ' +
            (
              totaux.totalTva6 +
              totaux.totalTva12 +
              totaux.totalTva18 +
              totaux.totalTvaTransp +
              totaux.totalTvaTpm
            )
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          15,
          y
        );
        let artsExonors;
        await this.etatTvaService
          .getArticlesExonores(
            this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
            this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
          )
          .toPromise()
          .then((data) => {
            artsExonors = data;
          });
        doc1.text(
          'Articles Exonorés : ' +
            Number(artsExonors)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& '),
          140,
          y
        );
        y = y + 5;
        doc1.text(
          'Nombre des Factures : ' +
            this.etatTva.length.toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          15,
          y
        );
        doc1.setFontStyle('normal');
        doc1.setFontSize(9);
        doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
        if (index === 0) {
          doc1.autoPrint();
          window.open(doc1.output('bloburl'), '_blank');
        } else {
          window.open(doc1.output('bloburl'), '_blank');
        }
      } else {
        this.msgs = 'Aucune facture pour cette période !';
        this.styleOvPanel = this.styleOvPanelError;
        document.getElementById('apercu').focus();
        this.ov.show(e, document.getElementById('apercu'));
      }
    } else {
      this.msgs = 'Date fin doit être supérieur à date début !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('apercu').focus();
      this.ov.show(e, document.getElementById('apercu'));
    }
  }
}
