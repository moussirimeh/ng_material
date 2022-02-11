import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
 import { MessageService } from 'primeng/api';
import { Elivraison } from '../services/elivraison';
import { Livreur} from '../services/livreur';
import { LivreurService } from '../services/livreur.service';
import { DLivraisonService } from '../services/dlivraison.service';
import {ModifBSortie} from '../services/ModifBSortie';
import { RecettesService } from '../services/recettes.service';
import { ElivraisonService } from '../services/elivraison.service';
import { GridComponent, RowSelectEventArgs  } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';

import { LoginService } from 'src/app/login/login.service';
import { globals } from 'src/environments/environment';

// si l'ejs grid est vide afficher un messge vide
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
  selector: 'app-vente-annul-bs',
  templateUrl: './vente-annul-bs.component.html',
  styleUrls: ['./vente-annul-bs.component.scss'],
  providers: [ MessageService ]
})
export class VenteAnnulBsComponent implements OnInit {

  @ViewChild('op')
  public op: OverlayPanel;
  msgerror: string;
  @ViewChild('grid')
  public grid: GridComponent;
  livreurs: Livreur[];
  elivraisons: Elivraison[];
  numero: string;
  elivraison: Elivraison = {
    id: null,
    numero: '',
    dated: '',
    datef: '',
    livreur: '',
    camuion: ''
  };
  RecBonSorties: ModifBSortie[];
  nbLigne;
  SelectedLivreur: Livreur = {
    id : null,
    code: '',
    nom: ''
  };
  wasInside: boolean;

  afficherClicked = false;
  editEnable = false;
  readonly = false;
  msgnumero;
  constructor(private livreurService: LivreurService ,
    private elivraisonService: ElivraisonService,
    private recettesService: RecettesService,
    private messageService: MessageService,
    private dlivraisonService: DLivraisonService,
    private config: NgSelectConfig,
    private loginService: LoginService

    ) {
      this.config.notFoundText = 'Aucun élément trouvé';
      this.config.clearAllText = 'Supprimer tous ';
    }
nb: number;
etat;
public customAttributes: Object;
async ngOnInit() {
  this.customAttributes = { class: 'customcss' };
  this.afficherClicked = false;
  this.editEnable = false;
  this.readonly = false;
  document.getElementById('num').focus();

}

@HostListener('document:click')
    clickout() {
      if (!this.wasInside) {
        this.messageService.clear();
        this.op.hide();
      }
      this.wasInside = false;

}

nouvelleSaisie() {
  this.afficherClicked = false;
  this.readonly = false;
  this.numero = null;
  document.getElementById('num').focus();

}

verifierNumero() {
  this.messageService.clear();
  this.op.visible = false;
  const num: string = String(this.numero);
  this.numero = num;

        if (this.numero === 'null') {
            this.numero = '';
        } else {
            switch (this.numero.length) {
              case 1: {
                this.numero = '0000' +  this.numero;
                break;
              }
              case 2: {
                this.numero = '000' +  this.numero;
                break;
              }
              case  3: {
                this.numero = '00' +  this.numero;
                break;
              }
              case  4: {
                this.numero = '0' +  this.numero;
                break;
              }
              default: {
                break;
              }
          }
          }

}
getByNumero(e) {
  this.messageService.clear();
  this.readonly = true;
  this.verifierNumero();
      // recuperer bon de sortie selon numero
      this.elivraisonService
        .getElivraisonByNumero(this.numero)
        .toPromise()
        .then(data => {
          this.elivraison = data['_embedded'].elivraisons[0];
          console.log(this.elivraison);
          // si bon de sortie inéxistant
          if (this.elivraison === undefined) {
             this.msgerror = 'Bon de sortie inéxistant !';
             this.op.show(e, document.getElementById('num'));
             this.readonly = false;
          } else
          // si bon de sortie est fermé
          if (this.elivraison.datef !== null) {

             this.msgerror = 'Ce Bon de sortie est fermé le ' + this.elivraison.datef + ' !';
             this.op.show(e, document.getElementById('num'));
                                 this.readonly = false;
          } else {
                // gestion des evennements
                    this.afficherClicked = true;
                    this.editEnable = true;
                    this.readonly = true;

                // recupérer la liste des recettes selon numoro du bon de sortie si bon de sortie est ouvert
                    this.recettesService
                        .getRecBonSortie(this.numero)
                        .toPromise()
                        .then( data => {
                          this.RecBonSorties = data['_embedded'].modifBonSorties;
                    });

              // recuperer le nom du livreur selon code
                  this.livreurService
                    .getByCode(this.elivraison.livreur)
                    .toPromise()
                    .then(donnees => {
                    this.SelectedLivreur = donnees;
                    });
                    }
                 });
              }
  // Valider la suppression
 Supprimer() {
          this.messageService.clear();
          this.wasInside = true;
            // recuperer le bon de sortie a supprimé
                  this.elivraisonService
                  .getElivraisonByNumero(this.numero)
                  .toPromise()
                  .then(data => {
                    this.elivraison = data['_embedded'].elivraisons[0];
                    console.log(this.elivraison);
                  });
            // annuler les recettes
                  this.recettesService.deleteAllBSRecettes(this.numero)
                  .toPromise()
                  .then(nbLigneSupp => {
                    this.nbLigne = nbLigneSupp;

                  });


            // supprimer les Dlivraisons
                this.dlivraisonService.deleteDelivraisonByNumero(this.numero)
                .toPromise()
                .then(result => {
                  console.log(' supprimer les Dlivraisons  ');
                });

            // supprimer l' Elivraison BS
                  this.elivraisonService.deleteElivraison(this.elivraison.id)
                  .toPromise()
                  .then(data => {
                    console.log('elivraison supprimé ');

                    const codeUtil = localStorage.getItem('login');
                      const moduteName = globals.selectedMenu;
                      const paramMouchar = 'N° ' + this.elivraison.numero;
                      this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
                      .then((data) => {
                        console.log(data);
              });

                  });
            // raffrechir  la page et afficher un message du succes
                  this.ngOnInit();
                  this.numero = null;
                  document.getElementById('num').focus();


   }
}
