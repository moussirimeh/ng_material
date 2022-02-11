import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Elivraison } from '../services/elivraison';
import { Livreur} from '../services/livreur';
import { LivreurService } from '../services/livreur.service';
import { RecettesService } from '../services/recettes.service';
import { ModifBSortie  } from '../services/ModifBSortie';
import { ElivraisonService } from '../services/elivraison.service';
import { GridComponent, RowSelectEventArgs  } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { MessageService } from 'primeng/api';
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
  selector: 'app-vente-conslt-bs',
  templateUrl: './vente-conslt-bs.component.html',
  styleUrls: ['./vente-conslt-bs.component.scss'],
  providers: [MessageService]
})
export class VenteConsltBsComponent implements OnInit {
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
  SelectedLivreur: Livreur = {
    id : null,
    code: '',
    nom: ''
  };
  afficherClicked = false;
  afficherCl = false;
  editEnable = false;
  readonly = false;
  constructor(private livreurService: LivreurService ,
          private elivraisonService: ElivraisonService,
          private recettesService: RecettesService,
          private messageService: MessageService,
          private config: NgSelectConfig

    ) {
              this.config.notFoundText = 'Aucun élément trouvé';
              this.config.clearAllText = 'Supprimer tous ';
    }
nb: number;
etat;
wasInside: boolean;
public customAttributes: Object;
async ngOnInit() {
        document.getElementById('num').focus();
        this.customAttributes = { class: 'customcss' };
        this.afficherClicked = false;
        this.afficherCl = false;
        this.editEnable = false;
}
@HostListener('document:click')
        clickout() {
          if (!this.wasInside) {
            // this.messageService.clear();
            this.op.visible = false;
          }
          this.wasInside = false;

}
verifierNumero() {
 // this.wasInside = true;
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
nouvelleSaisie() {
  document.getElementById('num').focus();
  this.afficherClicked = false;
  this.afficherCl = false;
  this.readonly = false;
  this.numero = null;
}
getByNumero(e) {
      // recuperer bon de sortie selon numero
      this.wasInside = true;
         this.messageService.clear();
      // this.verifierNumero() ;
         this.elivraisonService
              .getElivraisonByNumero(this.numero)
              .toPromise()
              .then(data => {
                this.elivraison = data['_embedded'].elivraisons[0];
                console.log(this.elivraison);
                // si bon de sortie inéxistant
                if (this.elivraison === undefined || this.elivraison === null) {
                  this.msgerror = 'Bon de sortie inéxistant !';
                  this.op.show(e, document.getElementById('num'));
                } else {
              // gestion des evennements
              this.afficherClicked = true;
           //   this.wasInside = false;
              this.afficherCl = true;
             // this.editEnable = true;
              this.readonly = true;
              // Test etat
              if (this.elivraison.datef !== null) {
                  this.etat = ' Fermé le ' + this.elivraison.datef ;
              } else {
              this.etat = ' Ouvert ';
          }
        // recupérer la liste des recettes selon numoro du bon de sortie si bon de sortie est ouvert
        this.recettesService
        .getRecBonSortie(this.numero)
        .toPromise()
        .then( data => {
        this.RecBonSorties = data['_embedded'].modifBonSorties;
        console.log(this.RecBonSorties);
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
}
