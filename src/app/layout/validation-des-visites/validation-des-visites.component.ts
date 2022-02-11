import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SearchSettingsModel } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { User } from 'src/app/login/User';
import { LoginService } from 'src/app/login/login.service';
import { VisiteService } from '../services/visite.service';
import { Visite } from '../services/visite';
import { VisiteCommandeService } from '../services/visiteCommande.service';
import { VisiteOffreService } from '../services/visiteOffre.service';
import { VisiteVisiteService } from '../services/visiteVisite.service';
import { VisiteReleveService } from '../services/visiteReleve.service';
import { VisiteCommande } from '../services/visiteCommande';
import { VisiteVisite } from '../services/visiteVisite';
import { VisiteOffre } from '../services/visiteOffre';
import { VisiteReleve } from '../services/visiteReleve';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-validation-des-visites',
  templateUrl: './validation-des-visites.component.html',
  styleUrls: ['./validation-des-visites.component.scss'],

})
export class ValidationDesVisitesComponent implements OnInit {

  @ViewChild('grid')
  public grid: GridComponent;
 @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  from = new Date ();
  to = new Date ();
  tn: any;
  readonlynom = true;
  validedate = true ;
  dateDisabled = false;
  ngselectDisabled = false;
  public customAttributes: Object;
  VisiteModofiée: Visite = {
    numVisite: '',
    codeClt: '',
    denoClt: '',
    adrClt: '',
    mailClt: '',
    responClt: '',
    fonctionClt: '',
    telClt: '',
    faxClt: '',
    datePrevue: '',
    heureFinPrevue: '',
    dateReelle: '',
    heureFinReelle: '',
    codeProgrammeePar: '',
    codePart1: '',
    presencePart1: '',
    codePart2: '',
    presencePart2: '',
    codePart3: '',
    presencePart3: '',
    attOfr: '',
    attCmd: '',
    attFin: '',
    attAutre: '',
    validation: '',
  };
  SelectedVisite: Visite = {
    numVisite: '',
    codeClt: '',
    denoClt: '',
    adrClt: '',
    mailClt: '',
    responClt: '',
    fonctionClt: '',
    telClt: '',
    faxClt: '',
    datePrevue: '',
    heureFinPrevue: '',
    dateReelle: '',
    heureFinReelle: '',
    codeProgrammeePar: '',
    codePart1: '',
    presencePart1: '',
    codePart2: '',
    presencePart2: '',
    codePart3: '',
    presencePart3: '',
    attOfr: '',
    attCmd: '',
    attFin: '',
    attAutre: '',
    validation: '',
  };
  readonly = true ;
  maxDate: Date;
  personnes: any ;
  visites: Visite [] ;
  Selected;
  SelectedPersonne: User = {
    id: '',
    codeUtil: '',
    nPUtil: '',
   mPUtil: '',
    menu1: '',
    menu2: '',
   menu3: '',
    menu4: '',
    menu5: '',
    menu6: '',
    menu7: '',
    menu8: '',
    menu9: '',
    menu10: '',
    menu11: '',
  };
  codePersonne = '';
  visitesCommandes: VisiteCommande[];
  tab_visite_commande: any;
  visitesVisites: VisiteVisite[];
  tab_visite_visite: any;
  visitesOffre: VisiteOffre[];
  tab_visite_offre: any;
  visitesReleve: VisiteReleve[];
  tab_visite_releve: any;
  public searchOptions: SearchSettingsModel;
  wasInside: boolean;
  valide = false;
  btnAfficher = true;
  tab_visite: any;
  date1: any;
  date2 = '';
  validerShow: boolean;
  supprimerShow: boolean;
  constructor(private loginService: LoginService, private visiteService: VisiteService,
    private visiteCommandeService: VisiteCommandeService,
    private visiteOffreService: VisiteOffreService,
    private visiteVisiteService: VisiteVisiteService,
    private visiteReleveService: VisiteReleveService,
    private config: NgSelectConfig) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous';


}
  ngOnInit() {
    this.SelectedPersonne = null;
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
    this.visites = new Array() ;
    // charger les personnes
    this.loginService.getUserListByOrderByCode().toPromise().then(
      (data) => {

        this.personnes = data['_embedded'].users;
        if (this.SelectedPersonne !== null) {
          this.codePersonne = this.SelectedPersonne.codeUtil;
        }
      }
    );
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
       this.ovo.hide();
    }
    this.wasInside = false;

  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
    this.validerShow = false;
    this.supprimerShow = false;

    this.readonlynom = true;
    this.readonly = true;

    this.SelectedVisite = null;
   // this.selectedstock = { code: '', design: '', prix: '', quantite: ''};


  }





  // chercher en front ent les nom des personnes
public onSearchPersonnes(word: string, item: User): boolean {
    return item.nPUtil.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
 }
  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
       this.SelectedVisite = selected;
       if (this.SelectedVisite  !== null && this.SelectedVisite !== undefined) {
              this.validerShow = true;
              this.supprimerShow = true;
       }
   }
  }
  // réaisir
  introdure(): void {
    this.dateDisabled = false;
    this.ngselectDisabled = false;
    this.visites = null;
    this.codePersonne = '';
    this.valide = false;
    this.btnAfficher = true;
  }
// affichage des visites
  async AfficherVisites (e) {

    this.validedate = true ;
    this.ovo.hide();
    this.wasInside = true;
    // test sur la date
    if ( this.to > new Date()) {
      this.validedate = false ;
      this.ms = 'Date invalide!!';
      this.ovo.show(e, document.getElementById('date'));
    }

    if (this.SelectedPersonne !== null) {
      this.codePersonne = this.SelectedPersonne.codeUtil;
    } else {
      this.codePersonne = '';
    }
    // affichage des visites si la date vraie
    if  (this.validedate === true) {
      this.date1 = this.from.toLocaleDateString('en-GB') +  ' 00:00:00';
      this.date2 = this.to.toLocaleDateString('en-GB') +  ' 23:59:00';

 await this.visiteService.rechercheVisite(this.codePersonne, this.date1, this.date2 ).
   toPromise().then (
     (data) => {

       this.visites = data['_embedded'].visites;
       for (this.tab_visite of this.visites) {
         this.tab_visite.date = this.tab_visite.datePrevue.substring(0, 16);

       }

     }
   );
   // si pas des visites
   if (this.visites.length === 0) {
    this.ms = 'Aucun message pour ces critères!';
    this.ovo.show(e, document.getElementById('afficher'));
    this.visites = null;
    this.codePersonne = '';
    this.dateDisabled = false;
    this.ngselectDisabled = false;
    this.valide = false;
    this.validerShow = false;
    this.supprimerShow = false;
    this.btnAfficher = true;
  } else {
    // this.rowSelected();
    this.btnAfficher = false;
    this.valide = true;
    this.dateDisabled = true;
    this.ngselectDisabled = true;
    if (this.SelectedVisite === null || this.SelectedVisite === undefined) {
      this.validerShow = false;
      this.supprimerShow = false;
    } else {

      this.validerShow = true;
      this.supprimerShow = true;
    }

  }
  }
}
// methode supprimer  des visites
  supprimer(event): void {
    // initialisation
    this.validedate = true ;
    this.ovo.hide();
    this.wasInside = true;
    // test sur la date
    if ( this.to > new Date()) {
      this.validedate = false ;
      this.ms = 'Date invalide!!';
      this.ovo.show(event, document.getElementById('date'));
    }
// si date vraie
    if (this.validedate === true) {
      // si pas de visites
    if (this.SelectedVisite.numVisite === null || this.SelectedVisite.numVisite === '') {
      this.ms = 'suppression pas possible!!';
    this.ovo.show(event, document.getElementById('suprimer'));

    } else {
      this.SupprimerVisite();
      this.SupprimerVisiteCommande();
      this.SupprimerVisiteOffre();
      this.SupprimerVisiteVisite();
      this.SupprimerVisiteReleve();
      this.validerShow = false;
      this.supprimerShow = false;
      // confirmation

    }
  }
  }
  // méthode supprimer visite
  async SupprimerVisite () {
    await this.visiteService.deleteVisiteByCode(this.SelectedVisite.numVisite).toPromise().then(
      (data) => {
         // MOOOOOOOOOOCHAR
         const codeUtil = localStorage.getItem('login');
         const moduteName = globals.selectedMenu;
         const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
         this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
         .then((data) => {
           console.log(data);
         });
           this.reloadVisites();

      }
    );
  }

  async SupprimerVisiteCommande () {
    // récupérer tous les visites de commandes ayant le numr de visite
    await this.visiteCommandeService.getVisiteCommandeByNumVisite(this.SelectedVisite.numVisite).toPromise().then(
      (data) => {
         // MOOOOOOOOOOCHAR
         const codeUtil = localStorage.getItem('login');
         const moduteName = globals.selectedMenu;
         const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
         this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
         .then((data) => {
           console.log(data);
         });
        this.visitesCommandes = data['_embedded'].visiteCommande;
      }
    );
    // supprimer tous les visites de commandes ayant le numr de visite
    if (this.visitesCommandes.length !== 0) {
      for (this.tab_visite_commande of this.visitesCommandes) {
        await this.visiteCommandeService.deleteVisiteCommande(this.tab_visite_commande).toPromise().then(
          (data) => {
          }
        );
      }
    }
  }

  async SupprimerVisiteOffre () {
    // récupérer tous les visites offres ayant le numr de visite
    await this.visiteOffreService.getVisiteOffreByNumVisite(this.SelectedVisite.numVisite).toPromise().then(
      (data) => {
         // MOOOOOOOOOOCHAR
         const codeUtil = localStorage.getItem('login');
         const moduteName = globals.selectedMenu;
         const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
         this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
         .then((data) => {
           console.log(data);
         });

        this.visitesOffre = data['_embedded'].visiteOffre;
      }
    );
    // supprimer tous les visites offres ayant le numr de visite
    if (this.visitesOffre.length !== 0) {
      for (this.tab_visite_offre of this.visitesOffre) {
        await this.visiteOffreService.deleteVisiteOffre(this.tab_visite_offre).toPromise().then(
          (data) => {
          }
        );
      }
    }
  }

  async SupprimerVisiteVisite () {
    // récupérer tous les visites des visites ayant le numr de visite
    await this.visiteVisiteService.getVisiteVisiteByNumVisite(this.SelectedVisite.numVisite).toPromise().then(
      (data) => {
         // MOOOOOOOOOOCHAR
         const codeUtil = localStorage.getItem('login');
         const moduteName = globals.selectedMenu;
         const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
         this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
         .then((data) => {
           console.log(data);
         });
        this.visitesVisites = data['_embedded'].visiteVisite;
      }
    );
    // supprimer tous les visites des visites ayant le numr de visite
    if (this.visitesVisites .length !== 0) {
      for (this.tab_visite_visite of this.visitesVisites) {
        await this.visiteVisiteService.deleteVisiteVisite(this.tab_visite_visite).toPromise().then(
          (data) => {
          }
        );
      }
    }
  }
  async SupprimerVisiteReleve () {
    // récupérer tous les visites de releve ayant le numr de visite
    await this.visiteReleveService.getVisiteReleveByNumVisite(this.SelectedVisite.numVisite).toPromise().then(
      (data) => {

        this.visitesReleve = data['_embedded'].visiteReleve;
      }
    );
    // suprimer tous les visites de releve ayant le numr de visite
   if (this.visitesReleve.length !== 0) {
      for (this.tab_visite_releve of this.visitesReleve) {

        await this.visiteReleveService.deleteVisiteReleve(this.tab_visite_releve).toPromise().then(
          (data) => {
             // MOOOOOOOOOOCHAR
             const codeUtil = localStorage.getItem('login');
             const moduteName = globals.selectedMenu;
             const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
             this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
             .then((data) => {
               console.log(data);
             });
          }
        );
      }
    }
  }
  // reload le grid
  async reloadVisites() {

    if (this.SelectedPersonne !== null) {
    await this.visiteService.rechercheVisite(this.SelectedPersonne.codeUtil, this.from.toLocaleDateString('en-GB'),
     this.to.toLocaleDateString('en-GB')).toPromise().then(data => {
      this.visites = data['_embedded'].visites;

    });
  }
  if (this.SelectedPersonne === null) {
    await this.visiteService.rechercheVisite('', this.from.toLocaleDateString('en-GB'),
     this.to.toLocaleDateString('en-GB')).toPromise().then(data => {
      this.visites = data['_embedded'].visites;

    });
  }
  }
  /// valider la visite (validation = v)
  Valider (e): void {
    this.validedate = true ;
    this.ms = '';
    this.ovo.hide();
    this.wasInside = true;
    // test sur la date
    if ( this.to > new Date()) {
      this.validedate = false ;

      this.ms = 'Date invalide!!';
      this.ovo.show(e, document.getElementById('date'));

    }
    if (this.validedate === true) {
      // si pas des visites
    if (this.SelectedVisite.numVisite === null || this.SelectedVisite.numVisite === '') {
      this.ms = 'Validation pas possible!';
      this.ovo.show(e, document.getElementById('valide'));
    } else {
      this.ValiderVisite();
      this.validerShow = false;
      this.supprimerShow = false;

    }
  }
  }
  // modifier validation= v
  async ValiderVisite () {
    const visite: Visite = {
      numVisite: this.SelectedVisite.numVisite,
      codeClt: this.SelectedVisite.codeClt,
      denoClt:  this.SelectedVisite.denoClt ,
      adrClt: this.SelectedVisite.adrClt ,
      mailClt: this.SelectedVisite.mailClt,
      responClt: this.SelectedVisite.responClt ,
      fonctionClt: this.SelectedVisite.fonctionClt ,
      telClt: this.SelectedVisite.telClt ,
      faxClt: this.SelectedVisite.faxClt ,
      datePrevue: this.SelectedVisite.datePrevue ,
      heureFinPrevue: this.SelectedVisite.heureFinPrevue ,
      dateReelle: this.SelectedVisite.dateReelle ,
      heureFinReelle: this.SelectedVisite.heureFinReelle ,
      codeProgrammeePar: this.SelectedVisite.codeProgrammeePar ,
      codePart1: this.SelectedVisite.codePart1 ,
      presencePart1: this.SelectedVisite.presencePart1 ,
      codePart2: this.SelectedVisite.codePart2 ,
      presencePart2: this.SelectedVisite.presencePart2 ,
      codePart3: this.SelectedVisite.codePart3 ,
      presencePart3: this.SelectedVisite.presencePart3 ,
      attOfr: this.SelectedVisite.attOfr ,
      attCmd: this.SelectedVisite.attCmd ,
      attFin: this.SelectedVisite.attFin ,
      attAutre: this.SelectedVisite.attAutre ,
     validation : 'V'
    };
    await this.visiteService.updateVisite(visite).toPromise().then(
      (data) => {
         // MOOOOOOOOOOCHAR
         const codeUtil = localStorage.getItem('login');
         const moduteName = globals.selectedMenu;
         const paramMouchar = 'N°V ' + this.SelectedVisite.numVisite + ' CL ' + this.SelectedVisite.codeClt ;
         this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
         .then((data) => {
           console.log(data);
         });
         this.reloadVisites();
      }
    );
  }
}
