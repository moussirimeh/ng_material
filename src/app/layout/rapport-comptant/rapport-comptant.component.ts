import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  ElementRef,
} from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { RapportComptant } from '../services/rapport-comptant';
import { RapportComptantService } from '../services/rapport-comptant.service';
import { DatePipe } from '@angular/common';
import { OverlayPanel } from 'primeng/primeng';
// import ptp from 'pdf-to-printer';
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
  selector: 'app-rapport-comptant',
  templateUrl: './rapport-comptant.component.html',
  styleUrls: ['./rapport-comptant.component.scss'],
  providers: [DatePipe],
})
export class RapportComptantComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  tn: any;
  dateDebut: Date = new Date();
  ste: Ste;
  rapportComptant: RapportComptant[] = [];
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
    private rapportComptantService: RapportComptantService,
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
    const printPage = async (sURL) => {
      const oHiddFrame = document.createElement('iframe');
      const printPromise = new Promise<void>((resolve, reject) => {
        oHiddFrame.onload = function () {
          try {
            oHiddFrame.contentWindow.focus(); // Required for IE
            oHiddFrame.contentWindow.print();
            resolve();
          } catch (error) {
            reject(error);
          }
        };
      });
      oHiddFrame.style.position = 'fixed';
      oHiddFrame.style.right = '0';
      oHiddFrame.style.bottom = '0';
      oHiddFrame.style.width = '0';
      oHiddFrame.style.height = '0';
      oHiddFrame.style.border = '0';
      oHiddFrame.src = sURL;
      document.body.appendChild(oHiddFrame);
      await printPromise;
    };
    this.wasInside = true;
    this.ov.hide();
    await this.rapportComptantService
      .getRapportComptant(this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'))
      .toPromise()
      .then((data) => {
        this.rapportComptant = data['_embedded'].rapportComptant;
      });
    if (this.rapportComptant.length > 0) {
      const displayDate = new Date().toLocaleDateString('en-GB');
      const displayTime = new Date().toLocaleTimeString();
      const doc1 = new jspdf();
      // page a4 (210 x 297 mm)
      let numPage = 1;
      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text('SOCIETE  :   ' + this.ste.societe, 14, 10);
      doc1.text('ADRESSE :   ' + this.ste.adresse, 14, 15);
      doc1.text('VILLE       :   ' + this.ste.ville, 14, 20);
      doc1.text('TEL           :   ' + this.ste.tel, 14, 25);
      doc1.text('FAX          :   ' + this.ste.fax, 14, 30);
      doc1.text('E-mail       :   ' + this.ste.email, 14, 35);

      doc1.text(
        'Tunis le : ' +
          this.tn.dayNames[new Date().getDay() - 1] +
          ' ' +
          displayDate +
          ' à ' +
          displayTime,
        137,
        35
      );

      doc1.setFontSize(18);
      doc1.setFontStyle('arial');
      doc1.text('Rapport  Journalier  des  Ventes  au Comptant', 50, 45);

      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text(
        'DU : ' + this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
        10,
        55
      );

      doc1.setFontSize(9);
      doc1.setFontStyle('bold');
      doc1.line(9, 60, 200, 60);
      // ligne Horizontal doc1.line(x1,y1,x2,y2)

      doc1.text('N°Fact.', 10, 64);
      doc1.text('Total HT', 35, 64);
      doc1.text('BASE 0', 60, 64);
      doc1.text('BASE 13', 75, 64);
      doc1.text('BASE 19', 100, 64);
      doc1.text('BASE 7', 125, 64);
      doc1.text('TIMBRE', 157, 64);
      doc1.text('MNT TTC', 180, 64);

      doc1.line(9, 67, 200, 67);
      doc1.setFontStyle('normal');
      let y = 72;
      const total = {
        totHt: 0,
        totBase0: 0,
        totBase10: 0,
        totBase17: 0,
        totBase29: 0,
        totTimbre: 0,
        totNet: 0,
      };
      for (const rapCpt of this.rapportComptant) {
        doc1.text(rapCpt.combine, 10, y);
        doc1.text(Number(rapCpt.ht).toFixed(3), 50, y, 'right');
        doc1.text(Number(rapCpt.base0).toFixed(3), 70, y, 'right');
        doc1.text(Number(rapCpt.base10).toFixed(3), 85, y, 'right');
        doc1.text(Number(rapCpt.base17).toFixed(3), 113, y, 'right');
        doc1.text(Number(rapCpt.base29).toFixed(3), 135, y, 'right');
        doc1.text(Number(rapCpt.timbre).toFixed(3), 167, y, 'right');
        doc1.text(Number(rapCpt.net).toFixed(3), 198, y, 'right');
        total.totHt = total.totHt + Number(rapCpt.ht);
        total.totBase0 = total.totBase0 + Number(rapCpt.base0);
        total.totBase10 = total.totBase10 + Number(rapCpt.base10);
        total.totBase17 = total.totBase17 + Number(rapCpt.base17);
        total.totBase29 = total.totBase29 + Number(rapCpt.base29);
        total.totTimbre = total.totTimbre + Number(rapCpt.timbre);
        total.totNet = total.totNet + Number(rapCpt.net);
        y = y + 7;
        //          total = total + Number(fact.net);
        if (y > 277) {
          doc1.line(9, y - 3, 200, y - 3, 'FD');
          doc1.text('Page ' + numPage.toFixed(0), 100, 287);

          if (numPage === 1) {
            doc1.line(9, 60, 9, y - 3, 'FD');
            doc1.line(200, 60, 200, y - 3, 'FD');
          } else {
            doc1.line(9, 10, 9, y - 3, 'FD');
            doc1.line(200, 10, 200, y - 3, 'FD');
          }

          numPage++;
          doc1.addPage();
          doc1.setFontStyle('bold');
          doc1.line(9, 10, 200, 10);
          // ligne Horizontal doc1.line(x1,y1,x2,y2)
          y = 14;
          doc1.text('N°Fact.', 10, y);
          doc1.text('Total HT', 35, y);
          doc1.text('BASE 0', 60, y);
          doc1.text('BASE 13', 75, y);
          doc1.text('BASE 19', 100, y);
          doc1.text('BASE 7', 125, y);
          doc1.text('TIMBRE', 150, y);
          doc1.text('MNT TTC', 175, y);
          y = y + 3;
          doc1.line(9, y, 200, y);
          doc1.setFontStyle('normal');
          y = y + 4;
        }
      }

      doc1.line(9, y - 3, 200, y - 3, 'FD');
      doc1.setFontStyle('bold');
      doc1.text('Totaux', 10, y + 1);
      doc1.text(total.totHt.toFixed(3), 50, y + 1, 'right');
      doc1.text(total.totBase0.toFixed(3), 70, y + 1, 'right');
      doc1.text(total.totBase10.toFixed(3), 85, y + 1, 'right');
      doc1.text(total.totBase17.toFixed(3), 113, y + 1, 'right');
      doc1.text(total.totBase29.toFixed(3), 135, y + 1, 'right');
      doc1.text(total.totTimbre.toFixed(3), 167, y + 1, 'right');
      doc1.text(total.totNet.toFixed(3), 198, y + 1, 'right');

      doc1.line(9, y + 3, 200, y + 3, 'FD');

      if (numPage === 1) {
        doc1.line(9, 60, 9, y + 3, 'FD');
        doc1.line(200, 60, 200, y + 3, 'FD');
      } else {
        doc1.line(9, 10, 9, y + 3, 'FD');
        doc1.line(200, 10, 200, y + 3, 'FD');
      }

      doc1.setFontStyle('normal');
      doc1.text('TVA 13 % : ' + (total.totBase10 * 0.13).toFixed(3), 10, y + 8);
      doc1.text(
        'TVA 19 % : ' + (total.totBase17 * 0.19).toFixed(3),
        10,
        y + 14
      );
      doc1.text(
        'TVA 7  % : ' + (total.totBase29 * 0.07).toFixed(3),
        10,
        y + 20
      );
      doc1.setFontStyle('bold');
      doc1.text(
        'TOTAL TVA : ' +
          (
            total.totBase10 * 0.13 +
            total.totBase17 * 0.19 +
            total.totBase29 * 0.07
          ).toFixed(3),
        10,
        y + 30
      );
      doc1.setFontStyle('normal');
      doc1.text('Page ' + numPage.toFixed(0), 100, 287);
      if (index === 0) {
        // doc1.autoPrint();
        window.open(doc1.output('bloburl'), '_blank');
      } else {
        // printPage(doc1.output('bloburl')).catch((error) => {
        // Fallback printing method
        doc1.autoPrint();
        doc1.output('dataurlnewwindow');
        // });
        // window.open(doc1.output('bloburl'), '_blank');
        // var embeddedPdf = document.getElementById('printablePdf');
        // this.iframe.nativeElement.setAttribute('src', doc1.output('bloburl'));

        // Then to print
        /* setTimeout(() => {
          this.iframe.nativeElement.contentWindow.focus();
          this.iframe.nativeElement.contentWindow.print();
        }, 10); */
        /*ptp
  .print(doc1.output('bloburl'))
  .then(console.log)
  .catch(console.error);*/
      }
    } else {
      this.msgs = 'Aucune facture pour cette période !';
      this.styleOvPanel = this.styleOvPanelError;
      document.getElementById('apercu').focus();
      this.ov.show(e, document.getElementById('apercu'));
    }
  }
}
