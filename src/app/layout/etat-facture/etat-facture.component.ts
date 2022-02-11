import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { Ste } from '../services/ste';
import { SteService } from '../services/ste.service';
import { EtatFacture } from '../services/etat-facture';
import { EtatFactureService } from '../services/etat-facture.service';
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
  selector: 'app-black-page',
  templateUrl: './etat-facture.component.html',
  styleUrls: ['./etat-facture.component.scss'],
  providers: [DatePipe],
})
export class EtatFactureComponent implements OnInit {
  tn: any;
  dateDebut: Date = new Date();
  dateFin: Date = new Date();
  ste: Ste;
  etatFacture: EtatFacture[] = [];
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
    private etatFactureService: EtatFactureService,
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
      await this.etatFactureService
        .getEtatFacture(
          this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy'),
          this.datePipe.transform(this.dateFin, 'dd/MM/yyyy')
        )
        .toPromise()
        .then((data) => {
          this.etatFacture = data['_embedded'].etatFacture;
        });
      if (this.etatFacture.length > 0) {
        const displayDate = new Date().toLocaleDateString('en-GB');
        const displayTime = new Date().toLocaleTimeString();
        const doc1 = new jspdf();
        // page a4 (210 x 297 mm)
        let numPage = 1;
        doc1.setFontSize(10);
        doc1.setFontStyle('arial');
        doc1.text('SOCIETE  :   ' + this.ste.societe, 10, 10);
        /*doc1.text("ADRESSE :   " + this.ste.adresse, 14, 15);
        doc1.text("VILLE       :   " + this.ste.ville, 14, 20);
        doc1.text("TEL           :   " + this.ste.tel, 14, 25);
        doc1.text("FAX          :   " + this.ste.fax, 14, 30);
        doc1.text("E-mail       :   " + this.ste.email, 14, 35);

        doc1.text(
          "Tunis le : " +
            this.tn.dayNames[new Date().getDay() - 1] +
            " " +
            displayDate +
            " à " +
            displayTime,
          147,
          35
        );*/

        doc1.setFontSize(18);
        doc1.setFontStyle('arial');
        doc1.setFontStyle('bold');
        doc1.text('Etat de la Facturation', 80, 25);

        doc1.setFontSize(10);
        doc1.setFontStyle('arial');
        doc1.setFontStyle('normal');
        doc1.text(
          'DU : ' +
            this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy') +
            '      AU : ' +
            this.datePipe.transform(this.dateFin, 'dd/MM/yyyy'),
          10,
          40
        );

        doc1.setFontStyle('bold');
        doc1.line(10, 45, 200, 45);
        // ligne Horizontal doc1.line(x1,y1,x2,y2)

        doc1.text('N°Facture', 10, 49);
        doc1.text('Code Clt.', 40, 49);
        doc1.text('Client', 70, 49);
        doc1.text('Montant', 185, 49);

        doc1.line(10, 52, 200, 52);
        doc1.setFontStyle('normal');
        let y = 57;
        let total = 0;
        for (const fact of this.etatFacture) {
          doc1.text(fact.numero, 10, y);
          doc1.text(fact.operateur, 40, y);
          doc1.text(fact.deno, 70, y);
          doc1.text(
            Number(fact.net)
              .toFixed(3)
              .replace(/\d(?=(\d{3})+\.)/g, '$& '),
            200,
            y,
            'right'
          );
          y = y + 7;
          total = total + Number(fact.net);
          if (y > 277) {
            doc1.line(10, y - 3, 200, y - 3, 'FD');
            doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
            numPage++;
            doc1.addPage();
            doc1.setFontStyle('bold');
            doc1.line(10, 20, 200, 20);
            // ligne Horizontal doc1.line(x1,y1,x2,y2)

            doc1.text('N°Facture', 10, 24);
            doc1.text('Code Clt.', 40, 24);
            doc1.text('Client', 70, 24);
            doc1.text('Montant', 185, 24);

            doc1.line(10, 27, 200, 27);
            doc1.setFontStyle('normal');
            y = 32;
          }
        }
        doc1.line(10, y - 3, 200, y - 3, 'FD');
        doc1.setFontStyle('bold');
        doc1.text(
          'Total : ' + total.toFixed(3).replace(/\d(?=(\d{3})+\.)/g, '$& '),
          200,
          y + 2,
          'right'
        );
        doc1.setFontStyle('normal');
        doc1.text('Page ' + numPage.toFixed(0), 100, 289);
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
