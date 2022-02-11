import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { GridComponent, SearchSettingsModel, ToolbarItems, RowSelectEventArgs, EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { Elivraison } from '../services/elivraison';
import {ElivraisonService} from '../services/elivraison.service';
import {LivreurService} from '../services/livreur.service';
import {RecettesService} from '../services/recettes.service';
import {MouveService } from '../services/mouve.service';
import { LivraisonPiece } from '../services/LivraisonPiece';
import { DLivraisonService } from '../services/dlivraison.service';
import {MessageService} from 'primeng/components/common/messageservice';
import { RecetteLivraison } from '../services/recetteLivraison';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { from } from 'rxjs';
import { NgSelectConfig } from '@ng-select/ng-select';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectComponent } from '@ng-select/ng-select';
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
  selector: 'app-vente-cons-livraison',
  templateUrl: './vente-cons-livraison.component.html',
  styleUrls: ['./vente-cons-livraison.component.scss'],
  providers: [MessageService]
})
export class VenteConsLivraisonComponent implements OnInit {
  @ViewChild('ngs') ngs: NgSelectComponent;
  @ViewChild('op')
  public op: OverlayPanel;

  @ViewChild('grid')
  public grid: GridComponent;
  numero;
  LivraisonPieces: LivraisonPiece[];
  nbc ;
  msgerror: string;
  pieces: Array<{id: string , text: string }> = [
    {id: 'B/L      ', text: 'Bon de livraison'},
    {id: 'AVOIR    ', text: 'Avoir B/L'},
    {id: 'FACTUREP ', text: 'Facture comptant'},
    {id: 'AVOIRP   ', text: 'Avoir comptant'},
    {id: 'B/L2     ', text: 'B/L2'},
    {id: 'AVOIR2   ', text: 'Avoir B/L2'},
    {id: 'FACTUREI ', text: 'Facture instance'},
    {id: 'AVOIRI   ', text: 'Avoir  instance'},
    {id: 'FACTURE3 ', text: 'Facture reservation'},
    {id: 'AVOIR3   ', text: 'Avoir reservation'}
    ];
  recette: RecetteLivraison ;
  recettetemp: RecetteLivraison ;
    elivraison: Elivraison ;
    combinerech = '';
    BonSortie = false;
    editEnablel = false;
    livreur;
    BS;
    selectedpiece;
    wasInside: boolean;
  readonly: boolean;
  afficherclique: boolean;
  btnnvs: boolean;
    constructor(private messageService: MessageService,
      private elivraisonService: ElivraisonService,
      private mouveService: MouveService,
      private dLivraisonService: DLivraisonService,
      private recettesService: RecettesService,
      private livreurService: LivreurService,
      private config: NgSelectConfig

      ) {
        this.config.notFoundText = 'Aucun élément trouvé';
        this.config.clearAllText = 'Supprimer tous ';
      }

public customAttributes: Object;

@HostListener('document:click')
      clickout() {
        if (!this.wasInside) {
          this.messageService.clear();
          if (this.op !== null && this.op !== undefined) {
            this.op.hide();
          }

        }
        this.wasInside = false;
  }
public onSearch(word: string, item: { id: string, text: string }): boolean {
      return item.id.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}
setFocus = () => {
  this.ngs.focus();
}
nouvelleSaisie() {
 this.numero = null;
 this.selectedpiece = null;
 this.readonly = false;
 this.BonSortie = false;
 this.LivraisonPieces = new Array();
 this.recette =  {
  id: '',
  combine: '',
  date: '',
  deno: '',
  operateur: '',
  bon_sort: '',
  livrObservat: '',
  net: '',
  clt: ''
};
this.afficherclique = false;
this.btnnvs = false;

}
async ngOnInit() {

         this. btnnvs = false;
          this.readonly = false;
          this.afficherclique = false;
          this.nbc = '' ;
          this.customAttributes = { class: 'customcss' };
          this.BonSortie = false;
          this.editEnablel = false;
          this.recette =  {
              id: '',
              combine: '',
              date: '',
              deno: '',
              operateur: '',
              bon_sort: '',
              livrObservat: '',
              net: '',
              clt: ''
        };
        this.elivraison = {
              id: '',
              numero: '',
              dated: '',
              datef: '',
              livreur: '',
              camuion: ''
        };
        this.LivraisonPieces = new Array();

}


  tailleNumero(e, num: string) {
    this.messageService.clear();
    this.op.hide();
    this.wasInside = true;

    if ( this.selectedpiece === undefined
      || String(this.selectedpiece) === 'undefined'
      || this.selectedpiece === null
      || String(this.selectedpiece) === 'null' ) {
              this.msgerror = ' Pièce est obligatoire !';
              this.op.show(e, document.getElementById('pi'));
      } else {
                  if (this.numero === undefined || this.numero === null || String(this.numero) === 'null' || String(this.numero) === '' ) {
                    this.setFocus();
                    this.msgerror = 'Numéro du pièce est obligatoire !';
                    this.op.show(e, document.getElementById('num'));

                        this.ngOnInit();
            } else {
                if (num.length > 5) {
                     this.setFocus();
                    this.msgerror = 'Verifiez numéro du pièce: max 5 chiffres !';
                    this.op.show(e, document.getElementById('num'));
                }
               }
              }
}

  verifierNumero() {
    this.messageService.clear();
    if (this.op !== null && this.op !== undefined) {
      this.op.visible = false;
    }

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
async recherche(e) {



  this.messageService.clear();
  this.wasInside = true;

  if ( this.selectedpiece === undefined
    || String(this.selectedpiece) === 'undefined'
    || this.selectedpiece === null
    || String(this.selectedpiece) === 'null' ) {
             this.setFocus();
            this.msgerror = ' Pièce est obligatoire !';
            this.op.show(e, document.getElementById('pi'));

    } else {
      if (this.numero === undefined || this.numero === null || String(this.numero) === 'null' || String(this.numero) === '' ) {

       document.getElementById('num').focus();
        this.msgerror = 'Numéro du pièce est obligatoire !';
        this.op.show(e, document.getElementById('num')); } else {
            if (this.numero !== undefined && this.selectedpiece !== undefined
              && this.numero !== null && String(this.numero) !== 'null' && String(this.numero) !== '') {

                    this.verifierNumero();
                    this. btnnvs = true;

                     this.readonly = false;
                    this.combinerech = this.selectedpiece.id + this.numero;
                    await this.recettesService.getReclivraisonByCombine(this.combinerech)
                    .toPromise()
                    .then(data => {
                        this.recettetemp = data['_embedded'].recetteLivraisons[0];
                    });

                    if (this.recettetemp === undefined || this.recettetemp.toString() === 'undefined'  ) {
                      // this.ngOnInit();
                      this.afficherclique = false;
                      this.msgerror = 'Pièce est inéxistant !!';
                                  this.op.show(e, document.getElementById('btnaff'));
                    } else {
                            if (this.recettetemp.bon_sort !== undefined  && this.recettetemp.bon_sort !== null) {
                              this.afficherclique = true;
                              this.recette = this.recettetemp;
                              this.BonSortie = true;

                              await this.elivraisonService.getElivraisonByNumero(this.recette.bon_sort)
                              .toPromise()
                              .then(data => {
                              this.elivraison = data['_embedded'].elivraisons[0];
                              });

                              await this.livreurService.getByCode( this.elivraison.livreur)
                              .toPromise()
                              .then(data => {
                                this.livreur = data.nom;
                              });

                              await this.dLivraisonService.listDelivraisonByNumero(this.recette.bon_sort)
                                .toPromise()
                                .then( data => {
                                  this.nbc = data['_embedded'].dlivraisons[0].nbc;
                                });

                              await this.mouveService.getLivraisonPiece(this.combinerech)
                                .toPromise()
                                .then(data => {
                                  this.LivraisonPieces = data['_embedded'].livraisonPieces;
                                });
                              } else {
                                this.BonSortie = false;
                              }
                            if (this.recettetemp.bon_sort === null && this.recettetemp.livrObservat === null ) {
                                  // this.ngOnInit();
                                  this.afficherclique = false;
                                  this.msgerror = 'Pièce n\' est  pas encore livrée !!';
                                  this.op.show(e, document.getElementById('btnaff'));
                            } else {
                              this.afficherclique = true;
                              this.recette = this.recettetemp;
                              if (this.recette.livrObservat !== null ) {
                                await this.mouveService.getLivraisonPiece(this.combinerech)
                                .toPromise()
                                .then(data => {
                                  this.LivraisonPieces = data['_embedded'].livraisonPieces;
                                });
                              }
                            }
                      }
         } else {

         }
}
}
}

}
