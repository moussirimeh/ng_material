import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { SteService } from '../services/ste.service';
import { DatePipe } from '@angular/common';
import { OverlayPanel } from 'primeng/primeng';
@Component({
  selector: 'app-lancement-inventaire',
  templateUrl: './lancement-inventaire.component.html',
  styleUrls: ['./lancement-inventaire.component.scss'],
  providers: [DatePipe],
})
export class LancementInventaireComponent implements OnInit {
  tn: any;
  dateDebut = null;
  dateFin = null;
  minDate = new Date('12/01/' + (new Date().getFullYear() - 1).toFixed(0));
  maxDate = new Date('01/01/' + (new Date().getFullYear()).toFixed(0));
  blockedDocument = false;
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
  constructor(private steService: SteService, private datePipe: DatePipe) {}

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
      .getDateDebutInventaire()
      .toPromise()
      .then((data: string) => {
        if (data !== '') {
          this.dateDebut = new Date(data);
          this.minDate = this.dateDebut;
        }
      });
    await this.steService
      .getDateFinInventaire()
      .toPromise()
      .then((data: string) => {
        if (data !== '') {
          this.dateFin = new Date(data);
          this.maxDate = this.dateFin;
        }
      });
  }
  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    if (this.dateDebut !== null) {
      if (this.dateFin !== null) {
        this.blockedDocument = true;
        await this.steService
          .updateDateInventaire(
            this.datePipe.transform(this.dateDebut, 'MM/dd/yyyy') +
              this.datePipe.transform(this.dateFin, 'MM/dd/yyyy')
          )
          .toPromise()
          .then();
        this.msgs = 'Execution Terminee Avec Succes !';
        this.styleOvPanel = this.styleOvPanelSuccess;
        this.ov.show(e, document.getElementById('btValider'));
        this.blockedDocument = false;
      } else {
        this.msgs = 'Veuillez saisir la date de fin de l\'inventaire !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('dateFin'));
      }
    } else {
      this.msgs = 'Veuillez saisir la date de début de l\'inventaire !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('dateDebbut'));
    }
  }
}
