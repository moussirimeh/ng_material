import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { ClientService } from '../services/client.service';
import { Client } from '../services/client';
import { ActionRecouvService } from '../services/actionRecouv.service';
import { ActionRecouv } from '../services/actionRecouv';
import { DatePipe } from '@angular/common';
import { AffectationRecouvrementService } from '../services/affectationRecouvrement.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import {Message} from 'primeng/components/common/api';
import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-enreg-act-recouv',
  templateUrl: './enreg-act-recouv.component.html',
  styleUrls: ['./enreg-act-recouv.component.scss'],
  providers: [ DatePipe]

})

export class EnregActRecouvComponent implements OnInit {

  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
   tn: any ;
  clients: Client [];
  afficherClicked = false;
  SelectedClient = null;
  readonly = true;
  actionrecouv: ActionRecouv = {
    numAction: '',
  codeClt: '',
  effectueePar: '',
  date: '',
  action: '',
  numVisite: '',
  numMission: '',
};
num_mission = '';
date = new Date();
SelectedAction = '';
valide = false;
ActEnreg: ActionRecouv = {
  numAction: '',
  codeClt: '',
  effectueePar: '',
  date: '',
  action: '',
  numVisite: '',
  numMission: '',

};
codeClt = '';
maxDate = new Date () ;
minDate = new Date () ;
Affectation: any ;
wasInside: boolean;
effectuePar ;

  constructor(private clientService: ClientService,
              private actrecouvService: ActionRecouvService
              , public datepipe: DatePipe,
              private loginService: LoginService,
              private affectationrRecouveService: AffectationRecouvrementService ,
              private config: NgSelectConfig) {
        this.config.notFoundText = 'Aucun élément trouvé';
        this.config.clearAllText = 'Supprimer tous';
       this.minDate.setDate(new Date().getDate() - 7);


        }

   ngOnInit() {

    // this.date = null ;
    // charger les clients
     this.clientService.getClientTerme().toPromise()
    .then(data => {
      console.log(data);

     this.clients = data['_embedded'].clients;


    });
    // calendrier en francais
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
// hostListener
@HostListener('document:click')
  clickout() {
    if (!this.wasInside ) {
       this.ovo.hide();
    }
    this.wasInside = false;
  }
  onKey(e) {
    this.ovo.hide();

    this.wasInside = true;

    if (this.date < this.minDate) {
      this.ms = 'Date invalide!le mininum date = date d aujourdhui - 7 jours  ';
     this.ovo.show(e, document.getElementById('date'));
    // this.minDate.setDate(new Date().getDate() - 7);
     this.date = new Date ();
    }
  }
//// chercher les noms des clients en front end
  public onSearchClient(word: string, item: Client): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

///// enregistrer l'action
   async Valider(e) {

    this.wasInside = true;
    this.ovo.hide();
    // affecter le code client du client selectionné
    if (this.SelectedClient !== null) {
      this.codeClt = this.SelectedClient.code;
    }
    // si le client n'est pas saisie
    if (this.SelectedClient === null || (this.SelectedClient === undefined) ) {
     this.ms = 'Le client est obligatoire!';
     this.ovo.show(e, document.getElementById('client'));
  } else if (this.SelectedAction === null || (this.SelectedAction === undefined) || (this.SelectedAction === '')) {
            this.ms = 'L action doit etre indiquée !!!';
            this.ovo.show(e, document.getElementById('action'));
        } else if ((this.SelectedClient !== null) && (this.SelectedAction !== '' || this.SelectedAction !== undefined) ) {
      this.valide = true;
      // affecter le numero de mission
      await this.affectationrRecouveService.getFirstAffectationRecouvrementByCodeCltAndCodeSituation
        (this.codeClt, 'O').toPromise().
      then(
        (data) => {
          this.Affectation =  data['_embedded'].affectationRecouvrement[0];
          if ( this.Affectation === undefined) {
           this.num_mission = null;
          } else {
           this.num_mission = this.Affectation.numMission;
          }
        }
      );
      // récupérer la personne qui effectue les actions par le systeme
      this.effectuePar = localStorage.getItem('login');
      console.log('effectué par : ' + this.effectuePar);
      console.log(localStorage);


      // remplir l'entite action de recoubrement par ses valeurs
      const actRecouv: ActionRecouv = {
      numAction: null ,
      codeClt: this.SelectedClient.code,
      effectueePar: this.effectuePar,
      date: this.date.toLocaleDateString('en-GB'),
      action: this.SelectedAction,
      numVisite:  null,
      numMission: this.num_mission,
    } ;
      console.log(this.ActEnreg);

      try {
        // l'enregistrement de cette action
      await this.actrecouvService.createActionRecouv (actRecouv).toPromise().then(
        (data) => {
          // MOOOOOOOOOOCHAR
          const codeUtil = localStorage.getItem('login');
          const moduteName = globals.selectedMenu;
          const paramMouchar = 'Cl ' + actRecouv.codeClt + ' ID ' + data.numAction;
          this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
          .then((data) => {
            console.log(data);
          });
          // l'initialisation
          this.SelectedClient = null;
           this.SelectedAction = '';
           this.codeClt = '';
           this.date = new Date ();

        }
      )
        .finally();
      } catch {
        console.log('erreur');
      }
      }
}
}
