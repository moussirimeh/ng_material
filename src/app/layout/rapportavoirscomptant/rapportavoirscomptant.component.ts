import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rapportavoirscomptant',
  templateUrl: './rapportavoirscomptant.component.html',
  styleUrls: ['./rapportavoirscomptant.component.scss']
})
export class RapportavoirscomptantComponent implements OnInit {
  date_debut = new Date ();
  date_fin = new Date ();
  minDate = new Date (2010 , 0, 1 );
  tn: any;
  constructor() { }

  visualiser() {
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

}
