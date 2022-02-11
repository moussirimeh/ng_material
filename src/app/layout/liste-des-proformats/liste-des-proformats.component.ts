import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n} from '@syncfusion/ej2-base';
import { SearchSettingsModel } from '@syncfusion/ej2-grids';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/fournisseur';
import { DemandeService } from '../services/demande.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
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
  selector: 'app-liste-des-proformats',
  templateUrl: './liste-des-proformats.component.html',
  styleUrls: ['./liste-des-proformats.component.scss'],
})
export class ListeDesProformatsComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grid')
  public grid2: GridComponent;
  @ViewChild('ovo')
  public ovo: OverlayPanel;
  ms = '';
  tn: any ;
  denoFour: any ;
  nvlListeClicked = true ;
  DetailProformats: any;
  public searchOptions: SearchSettingsModel;
  codeFour = null ;
  defaultdatdebut = new Date();
  from = new Date (this.defaultdatdebut.getFullYear() , 0, 1 );
  maxDate: Date;
  to = new Date ();
  public customAttributes: Object;
  fournisseurs: any ;
  SelectedFournisseur: Fournisseur = {
    id: '',
     code: '',
    deno: '',
     adresse: '',
     ville: '',
     post: '',
     tel: '',
     telex: '',
     frs: '',
     respon: '',
     agence: '',
     banque: '',
     fax: '',
     compte: '',
     pays: '',
     plafond: '',
     ech: '',
     delai: '',
     typef: '',
     date_creat: '',
  } ;
  readonlynom = true;
  readonly = true;
  combin = 'PROFORMA ';
  combine = '';

  proformats: any;
  tab_proforma: any ;
  afficheClicked = false ;
  ngselectDisabled = false;
  dateDisabled = false;
  inputDisabled = false ;
  SelectedProforma: any;
  doubleClikced = false;
  existeProformat = true ;
  existeFour =  false;
  wasInside: boolean;
  valide = false;
  selectedIndex: number;
  clickbtnaffich: boolean;
  constructor(private fournisseurService: FournisseurService,
    private  demandeService: DemandeService, private config: NgSelectConfig) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous';
      }
  ngOnInit() {
    this.clickbtnaffich = true;
    this.SelectedFournisseur = null;
   // this.combin = 'PROFORMAT ' + this.combine;
    // charger les fournisseurs
    this.fournisseurService.getFournisseurListByOrderByDeno().toPromise().then(
      (data) => {
        this.fournisseurs = data['_embedded'].fournisseurs;
      }
    );
  // traduire la calendrier en francais
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
  @HostListener('document:click')
    clickout() {
      if (!this.wasInside) {
        this.ovo.hide();
      }
      this.wasInside = false;

    }

verifierCombine() {
      // this.wasInside = true;

             if (this.combine === 'null') {
               this.combine = '';
             } else {
               switch (this.combine.length) {
                 case 1: {
                   this.combine = '0000' + this.combine;
                   break;
                 }
                 case 2: {
                   this.combine = '000' + this.combine;
                   console.log(this.combine);
                   break;
                 }
                 case 3: {
                   this.combine = '00' + this.combine;
                   break;
                 }
                 case 4: {
                   this.combine = '0' + this.combine;
                   break;
                 }
                 default: {
                   break;
                 }
               }
       }
     }


/// méthode rechercher le fournisseur
async RechercherFournisseurByDeno () {

  this.wasInside = true;
  this.ovo.hide();
  // vérifier l'existence  du fournisseur
  if (this.SelectedFournisseur !== null && this.SelectedFournisseur !== undefined ) {

          // récupérer le fournisseur selectioné des ng select si il existe en tapant entrer dans l'input
              this.codeFour = this.SelectedFournisseur.code;

        } else {
          this.denoFour = null;
          this.codeFour = null;
          this.SelectedFournisseur = null;
         /* this.valide = false;
          document.getElementById('fournisseur').focus();
          this.ms = 'Fournisseur n\' existe pas!';
          this.ovo.show(e, document.getElementById('fournisseur'));*/
        }


  }





  initCodefour() {
    this.codeFour = null;
    this.SelectedFournisseur = null;
  }




/// méthode rechercher le fournisseur
async RechercherFournisseurByCode () {

  this.wasInside = true;
  this.ovo.hide();
  // vérifier l'existence  du fournisseur
  if (this.codeFour !== null && this.codeFour !== undefined   ) {
    /*await this.fournisseurService.existsByCode(this.codeFour).toPromise().then(
      value => {
        if (value === true) {*/
          // récupérer le fournisseur selectioné des ng select si il existe en tapant entrer dans l'input
           this.fournisseurService.getFourByCode(this.codeFour).toPromise().then(
            (data) => {
              this.SelectedFournisseur = data['_embedded'].fournisseurs[0];
              this.denoFour = this.SelectedFournisseur.deno ;
            }
          );
        } else {
          this.denoFour = null;
          this.codeFour = null;
          this.SelectedFournisseur = null;
        /*  this.valide = false;
          document.getElementById('fournisseur').focus();
          this.ms = 'Fournisseur n\' existe pas!';
          this.ovo.show(e, document.getElementById('fournisseur'));*/

        }

     //  });
  }



  // chercher les noms des fournisseurs en front end
  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}






// méthode afficher
  async Afficher (e) {

    this.combin = this.combin + this.combine;
    console.log(this.combin);
    console.log(this.combine);

    // initialisation
    this.wasInside = true;
    this.ovo.hide();
    this.afficheClicked = true ;
    this.nvlListeClicked = true ;
    this.DetailProformats = null ;
    this.existeFour = true ;
    this.existeProformat = true ;
    this.proformats = new Array();


    if (this.SelectedFournisseur !== null) {
      this.codeFour = this.SelectedFournisseur.code;
    }  else if (this.SelectedFournisseur === null) {
      this.codeFour = '' ;
    }
    if (String(this.combine) === '' || this.combine === null || this.combine === undefined ) {
      this.combin = '';
    }

      await this.demandeService.RechercheProformat(this.codeFour, this.combin,
        this.from.toLocaleDateString('en-GB'), this.to.toLocaleDateString('en-GB')).toPromise().then(
         (data) => {

           this.proformats = data['_embedded'].proformaFours ;

           for (this.tab_proforma of  this.proformats) {
             this.tab_proforma.date = this.tab_proforma.dateProfo.substring(0, 10) ;
           }
         }
       );
       if (this.proformats.length === 0) {
        this.clickbtnaffich = true;
       this.ms = 'Aucune proformat trouvée !!';
       this.ovo.show(e, document.getElementById('afficher'));
       this.valide = false ;
       this.dateDisabled = false;
        this.ngselectDisabled = false;
        this.inputDisabled = false ;
        this.combin = 'PROFORMA ' ;
        this.existeProformat = true;
       this.existeFour = true;

      } else {
        this.valide = true;
        this.dateDisabled = true;
        this.ngselectDisabled = true;
        this.inputDisabled = true ;
        this.clickbtnaffich = false;
      }


  }










  // inisialiser les paramètres de rechercher
  async NvlListe () {

    this.proformats = null;
    this.nvlListeClicked = false ;
    this.dateDisabled = false;
    this.ngselectDisabled = false;
    this.inputDisabled = false ;
    this.doubleClikced = false;
    this.combin = 'PROFORMA ' ;
    this.valide = false ;
    this.existeProformat = true;
    this.existeFour = true;
    this.clickbtnaffich = true;
  }
  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const index = this.grid.getSelectedRowIndexes();
      this.selectedIndex = index[0];
      console.log('selected index', this.selectedIndex);

      const selected: any = this.grid.getSelectedRecords()[0];
       this.SelectedProforma = selected;
   }
  }
  annulerSelection() {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.doubleClikced = false;
    }
  }
  // méthode double click pour afficher les détails d'une proformat
  async Doubleclick (args: any) {

    this.doubleClikced = true;
        this.SelectedProforma = this.grid.getRowInfo(args.target).rowData;
        if (this.SelectedProforma !== undefined) {
        if (this.selectedIndex !== null  && this.selectedIndex !== undefined) {
          this.grid.selectRow(this.selectedIndex, true);
        }

     await this.demandeService.findByCombine(this.SelectedProforma.combineProfo).toPromise().then(
      data => {
      this.DetailProformats =  data['_embedded'].demandes;
      this.grid.selectRow(this.selectedIndex, true);
      }      );
    }
  }
}
