import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Livreur} from '../services/livreur';
import { LivreurService } from '../services/livreur.service';
import { RecettesService } from '../services/recettes.service';
import { ModifBSortie  } from '../services/ModifBSortie';
import { RowSelectEventArgs  } from '@syncfusion/ej2-angular-grids';

import { ToolbarItems } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { Elivraison } from '../services/elivraison';
import {ElivraisonService} from '../services/elivraison.service';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';

import { LoginService } from 'src/app/login/login.service';
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
  selector: 'app-vente-modif-bs',
  templateUrl: './vente-modif-bs.component.html',
  styleUrls: ['./vente-modif-bs.component.scss'],
  providers: [MessageService]
})
export class VenteModifBSComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;


  @ViewChild('grid')
  public grid: GridComponent;
  public toolbarOptions: ToolbarItems[];
  RecBonSorties: ModifBSortie[];
  dateDOuvert: string;
  livreurs: Livreur[];
  elivraisons: Elivraison[];
  numero: string;
  codeLiv: string ;
  nomLiv: string;
  elivraison: Elivraison = {
    id: null,
    numero: '',
    dated: '',
    datef: '',
    livreur: '',
    camuion: ''
  };
   Deleteresult;
  selected;

  tn: any;
  msgerror: string;

  SelectedLivreur: any;
/*  Livreur = {
    id : null,
    code: '',
    nom: ''
  };*/
  wasInside: boolean;
  afficherClicked = false;
  editEnable = false;
  readonly = false;
  visible: boolean;
  consCamion: string;
  ConsLivreur: any;
  clearv: boolean;
  tab: any;
  constructor(private livreurService: LivreurService ,
              private elivraisonService: ElivraisonService,
              private messageService: MessageService,
              private loginService: LoginService,
              private recettesService: RecettesService,
              private config: NgSelectConfig

              ) {
                this.config.notFoundText = 'Aucun élément trouvé';
                this.config.clearAllText = 'Supprimer tous ';

              }
public customAttributes: Object;
async ngOnInit() {
      document.getElementById('num').focus();
       this.customAttributes = { class: 'customcss' };
        this.afficherClicked = false;
        this.editEnable = false;
        this.selected = null;
        // parametrage du calendrier
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
        this.reloadDataArts();
        this.clearv = false;
        this.tab = new Array();
        }
 async reloadDataArts() {
        await this.livreurService
          .getlivreursList()
          .toPromise()
          .then(data => {
            this.livreurs = data['_embedded'].livreurs;
          });
      }

@HostListener('document:click')
        clickout() {
          if (!this.wasInside) {
            this.changeCamion();
            this.changeLivreur();
            this.messageService.clear();
            this.op.hide();
          }
          this.wasInside = false;
    }
anuulerModif() {
  this.afficherClicked = false;
  this.readonly = false;
  this.numero = null;
  document.getElementById('num').focus();

}

reloadData() {
      this.recettesService
            .getRecBonSortie(this.numero)
            .toPromise()
            .then(data => {
              this.RecBonSorties = data['_embedded'].modifBonSorties;
            });
    }
verifierNumero() {
  this.op.visible = false;
      if (this.numero === 'null') {
        this.numero = '';
      } else {
        switch (this.numero.length) {
          case 1: {
            this.numero = '0000' + this.numero;
            break;
          }
          case 2: {
            this.numero = '000' + this.numero;
            console.log(this.numero);
            break;
          }
          case 3: {
            this.numero = '00' + this.numero;
            break;
          }
          case 4: {
            this.numero = '0' + this.numero;
            break;
          }
          default: {
            break;
          }
        }
      }
    }
clickevnt() {
  if (this.elivraison.camuion === null || this.elivraison.camuion === '' || this.SelectedLivreur === undefined) {
    this.elivraison.camuion = this.consCamion;
  } else {

  }
}
changeCamion() {
  if (this.elivraison.camuion === null || this.elivraison.camuion === '' || this.SelectedLivreur === undefined) {
    this.elivraison.camuion = this.consCamion;
  }
}

searchLivreur() {
  if (this.SelectedLivreur === null || this.SelectedLivreur === undefined || this.SelectedLivreur === this.ConsLivreur   ) {
   // this.clearv = false;
    this.SelectedLivreur = this.ConsLivreur;
    console.log('selected livreur change ', this.SelectedLivreur );

  } else {
   // this.SelectedLivreur = this.SelectedLivreur;
   // this.clearv = true;
  }
}

clearLivreur() {
  if (this.SelectedLivreur === null || this.SelectedLivreur === undefined || this.SelectedLivreur === this.ConsLivreur   ) {
    this.clearv = false;
    this.SelectedLivreur = this.ConsLivreur;
    console.log('selected livreur change ', this.SelectedLivreur );

  } else {
   // this.SelectedLivreur = this.SelectedLivreur;
    this.clearv = true;
  }
}

changeLivreur() {


  if (this.SelectedLivreur === null || this.SelectedLivreur === undefined || this.SelectedLivreur === this.ConsLivreur ) {
    this.clearv = false;
    this.SelectedLivreur = this.ConsLivreur;
    console.log('selected livreur change ', this.SelectedLivreur );

  } else {
    this.clearv = true;
   // this.SelectedLivreur = this.SelectedLivreur;
  }
}



getByNumero(e) {
      this.messageService.clear();
     // this.wasInside = true;
      this.customAttributes = { class: 'customcss' };
     // fonction pour convertir une string a une date
      function ConvertStringToDate(dateString) {
      const formdate: string = dateString.replace('/', '-');
      const formdat: string = formdate.replace('/', '-');
      let dateR = '';
      dateR =
        String(formdat).substring(3, 5) +
        '-' +
        String(formdat).substring(0, 2) +
        '-' +
        String(formdat).substring(6, 10);
        const convertDate = new Date(dateR);
        return convertDate;
    }
         // recuperer bon de sortie selon numero
    this.verifierNumero();
         this.elivraisonService
        .getElivraisonByNumero(this.numero)
        .toPromise()
        .then(data => {
          this.elivraison = data['_embedded'].elivraisons[0];
          console.log(this.elivraison);
          // si bon de sortie inéxistant
          if (this.elivraison === undefined) {
            this.msgerror =  'Bon de sortie inéxistant  ! ';
            this.op.show(e, document.getElementById('num'));
          } else
          // si bon de sortie est fermé
          if (this.elivraison.datef !== null) {
            this.op.visible = false;
            this.msgerror =  'Ce Bon de sortie est fermé le ' + this.elivraison.datef;
            this.op.show(e, document.getElementById('num'));

          } else {
            this.customAttributes = { class: 'customcss' };
            // recupérer la liste des recettes selon numoro du bon de sortie si bon de sortie est ouvert
            this.recettesService
            .getRecBonSortie(this.numero)
            .toPromise()
            .then( data => {
              this.RecBonSorties = data['_embedded'].modifBonSorties;
              if (this.RecBonSorties.length === 0) {
                this.visible = false;
              } else {
                this.visible = true;
              }
            });

     // supprimer une recette selon numoro du bon de sortie et l'id recettes

            // formatter le format du date
            const dateString: string = this.elivraison.dated ;
            this.dateDOuvert = this.elivraison.dated ;
            this.consCamion = this.elivraison.camuion;

            // gestion des evennements
            this.afficherClicked = true;
            this.editEnable = true;
            this.readonly = true;
            // recuperer le nom du livreur selon code
            this.codeLiv = this.elivraison.livreur;
            this.livreurService
          .getByCode(this.codeLiv)
          .toPromise()
          .then(donnees => {
           this.SelectedLivreur = donnees;
           this.ConsLivreur = this.SelectedLivreur;
         });
        }
        });
}
rowSelected() {
      this.selected = this.grid.getSelectedRecords()[0];
      console.log('selected record', this.grid.getSelectedRecords()[0]);
    }
Valider(e) {
      this.messageService.clear();
      this.op.visible = false;
      this.wasInside = true;
       this.elivraison.dated = this.dateDOuvert;
       if (this.SelectedLivreur === null || this.SelectedLivreur === undefined) {
            this.msgerror = 'Livreur est obligatoire !';
            this.op.show(e, document.getElementById('liv'));
       } else  {
             this.elivraison.livreur = this.SelectedLivreur.code;
             if (this.elivraison.camuion === '' || this.elivraison.camuion === null || this.elivraison.camuion === undefined ) {
              this.msgerror = 'numéro du camion est obligatoire !';
              this.op.show(e, document.getElementById('cam'));
             } else {
                    // VALIDER NOMBRE DE CARACTERES DU NUMERO DU CAMION NB<=15
                      if (this.elivraison.camuion.length > 15) {
                        this.msgerror = 'Verifiez numéro: max 15 caractères !';
                        this.op.show(e, document.getElementById('cam'));
                    } else {
                          this.elivraisonService.updateElivraison(this.elivraison)
                          .subscribe(
                            data => {
                              const codeUtil = localStorage.getItem('login');
                              const moduteName = globals.selectedMenu;
                              const paramMouchar = 'N° ' + this.elivraison.numero;
                             this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
                                 .then((data) => {
                                  console.log(data);
                                });
                          },
                          error => console.log('error Update BON SORTIE')
                        );


                      if (this.tab.length > 0 ) {

                                for (const item of this.tab) {
                                  this.recettesService
                                  .deleteBSRecettes(this.numero, item.id)
                                  .toPromise ()
                                  .then(data => {
                                                if (data === 1) {
                                                  this.reloadData();
                                                  this.selected = null;
                                                  this.afficherClicked = false;
                                                  this.readonly = false;
                                                  document.getElementById('num').focus();

                                                } else {
                                                  this.grid.refresh();
                                                  this.reloadData();
                                                }

                                  },
                                  error => console.log('Erreur  ', error));
                                }
                      }
                      this.tab = new Array();

                    }
                    this.afficherClicked = false;
                    this.readonly = false;
                    this.numero = null;
                    document.getElementById('num').focus();
       }
       }


    }


  // SUPRIMER UNE RECETTE D'UNE BON DE SORTIE
Supprimer(e) {

      this.messageService.clear();
      this.wasInside = true;
      if ( String(this.selected) !== 'null' && String(this.selected) !== 'undefined'
          && this.selected !== null && this.selected !== undefined ) {
            this.tab.push(this.selected);
            console.log('taaab', this.tab);
             this.RecBonSorties.splice(
                    this.RecBonSorties.indexOf(this.selected), 1);
          //  this.RecBonSorties.slice(this.selected);
            this.grid.deleteRow(this.selected);
            this.grid.refresh();
            this.selected = null;

     /*   this.recettesService
        .deleteBSRecettes(this.numero, this.selected.id)
        .toPromise ()
        .then(data => {
          if (data === 1) {


            this.reloadData();
            this.selected = null;
            this.afficherClicked = false;
            this.readonly = false;

          } else {
            this.grid.refresh();
            this.reloadData();
          }

        },
        error => console.log('Erreur  ', error)
        );*/


      } else {

        this.msgerror = 'Veuillez selectionner une recette  !';
                        this.op.show(e, document.getElementById('sup'));

        this.messageService.add({key: 'r', summary: 'Erreur' ,
                                severity: 'error', detail: 'Veuillez selectionner une recette !', sticky: true});
      }

          }
    // recherche livreurs
public onSearch(word: string, item: Livreur): boolean {
          return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
        }

}

