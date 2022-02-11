import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
  RowSelectEventArgs
} from '@syncfusion/ej2-angular-grids';
import { Message } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { Elivraison } from '../services/elivraison';
import { ElivraisonService } from '../services/elivraison.service';
import { RecettesService } from '../services/recettes.service';
import { Recettes } from '../services/recettes';
import { MouveService } from '../services/mouve.service';
import { LivraisonPiece } from '../services/LivraisonPiece';
import { DLivraison } from '../services/Dlivraison';
import { DLivraisonService } from '../services/dlivraison.service';
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
  selector: 'app-vente-livraison',
  templateUrl: './vente-livraison.component.html',
  styleUrls: ['./vente-livraison.component.scss'],
  providers: [MessageService]
})
export class VenteLivraisonComponent implements OnInit {
  @ViewChild('op')
  public op: OverlayPanel;
  visible: boolean;
  selectedpieces: any;
  afficherGrid: boolean;

  nouvelsaisie: boolean;
  btnafficher: boolean;




  constructor(
    private messageService: MessageService,
    private elivraisonService: ElivraisonService,
    private mouveService: MouveService,
    private dLivraisonService: DLivraisonService,
    private recettesService: RecettesService,
    private config: NgSelectConfig,
    private loginService: LoginService

  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }



  wasInside: boolean;
  text: string;
  display: boolean;
  validOBS: boolean;
  displayValidation: boolean;
  editEnable = false;
  validation_livraison: boolean;

  editEnablel = false;
  livraison = false;
  BonSortie = false;
  msgerror: string;
  info: boolean;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridBonSortie')

  public gridBonSortie: GridComponent;

  @ViewChild('numeric') public numeric;
  public searchSettings: SearchSettingsModel;
  public toolbarOptions: ToolbarItems[];
  public searchSettingsPiece: SearchSettingsModel;
  public toolbarOptionsPiece: ToolbarItems[];

  elivraisons: Elivraison[];
  pieces: Array<{ id: string; text: string }> = [
    { id: 'B/L', text: 'B/L' },
    { id: 'FACTURE', text: 'FACTURE' },
    { id: 'AB', text: 'AVOIR B/L' },
    { id: 'AF', text: 'AVOIR FACTURE' }
  ];

  selectedpiece;
  numero;
  BonSortieouvert: boolean;
  listeBonSortie:  boolean;
  selectedrecord;
  LivraisonPieces: LivraisonPiece[];
  selectedBS: Elivraison;
  nbColis;
  livrObservation;
  dLivraison: DLivraison = {
    id: null,
    numero: '',
    combine: '',
    nbc: ''
  };
  fullscreendialog: boolean;
  tableTemp: Recettes[];
  msgs: Message[] = [];
  public customAttributes: Object;
  public listeRecLivraison: Recettes[];

@HostListener('document:click')
        clickout() {
          if (!this.wasInside) {
            this.messageService.clear();
            if (this.op !== undefined && this.op !== null) {this.op.hide(); }

          }
          this.wasInside = false;
  }

annulerLivraison() {
    this.livraison = true;
    this.validation_livraison = false;
    this.nbColis = null;
    this.livrObservation = null;
    this.BonSortie = false;
    this.listeBonSortie = false;
  }

onchange() {
  //  this.grid.selectionModule.selectRow(parseInt(this.numeric.getText(), 0));
}
rowSelected(args: RowSelectEventArgs) {
  // test rowselected
   /* const rowHeight: number = this.grid.getRows()[this.grid.getSelectedRowIndexes()[0]].scrollHeight;
    this.grid.getContent().children[0].scrollTop = rowHeight * this.grid.getSelectedRowIndexes()[0];*/

    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedrecord = selected;
    }
   /*console.log('width scrall', this.grid.getContent().children[0].scrollWidth);
    console.log('rowHeight', rowHeight);*/
}




reloadDataGridd() {
  let e: any;
  this.selectedpiece = null;
 this.numero = '';
  this.recettesService
        .getReclivraison()
        .toPromise()
        .then(data => {
          this.listeRecLivraison = data['_embedded'].recetteLivraisons;
          if (this.listeRecLivraison.length === 0) {
            this.msgerror =  'pas de livraison !';
            this.op.show(e, document.getElementById('act'));
            this.afficherGrid = false;
            this.info = false;
            this.btnafficher = false;

            const temtab = this.listeRecLivraison;
            if (temtab !== undefined && temtab !== null) {

              if (temtab.length === 0) {
                this.info = false;


                   } else {
                this.info = true;
                   }
            } else {
              this.info = false;
         }

      } else {
        this.afficherGrid = true;
        this.info = true;
        this.btnafficher = true;
      }


    });


}



  reloadDataGrid(e) {

    this.nouvelsaisie = false;

    this.selectedpiece = null;
   this.numero = '';
    this.recettesService
          .getReclivraison()
          .toPromise()
          .then(data => {
            this.listeRecLivraison = data['_embedded'].recetteLivraisons;

              if (this.listeRecLivraison.length === 0) {
                    this.msgerror =  'pas de livraison !';
                    this.op.show(e, document.getElementById('act'));
                    this.afficherGrid = false;
                    this.info = false;
                    this.btnafficher = false;
                    const temtab = this.listeRecLivraison;
                    if (temtab !== undefined && temtab !== null) {

                      if (temtab.length === 0) {
                        this.info = false;


                          } else {
                        this.info = true;
                          }
                    } else {
                      this.info = false;
                      }

              } else {
                  this.afficherGrid = true;
                  this.info = true;
                  this.btnafficher = true;
        }
      });


  }

  public onSearch(word: string, item: { id: string, text: string }): boolean {
    return item.id.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
}

  async ngOnInit() {
    // this.editEnable = false;
    this.nouvelsaisie = false;
    this.validation_livraison = false;
  // this.info = false;

    this.BonSortie = false;
    this.validOBS = false;
    this.BonSortieouvert = false;
    this.nbColis = '';
    this.livrObservation = '';

    this.livraison = true;
    this.numero = '';
    this.selectedpiece = null;
    this.customAttributes = { class: 'customcss' };
    this.reloadDataGridd();

  }
  tailleNumero(num: string, e) {

    if (num.length > 5) {
     // Vérifiez numéro du pièce : max 5 chiffres !
     this.msgerror =  'Vérifiez numéro du pièce : max 5 chiffres !';
     this.op.show(e, document.getElementById('num'));
     // this.op.toggle(e);
      // this.numero = '';
    }
  }
  verifierNumero() {
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

reChercheCode(e) {
  this.nouvelsaisie = true;
     this.wasInside = true;
     this.info = true;
     this.selectedpieces = this.selectedpiece;
     const selectpiec = this.selectedpieces;
     const num = this.numero;

    try {
            this.messageService.clear();
            this.wasInside = true;
            if (this.selectedpieces  === null) {
              this.selectedpieces = {
                id: '',
                text: ''
              };
            }
            this.verifierNumero();
            let tabResult: Recettes[];
            tabResult = new Array();
            if (
              (this.selectedpieces === undefined ||
                this.selectedpieces === null) &&
              (String(this.numero) === 'undefined' || String(this.numero) === '')
            ) {
              this.grid.dataSource = this.listeRecLivraison;
              const temtab = this.listeRecLivraison;
              if (temtab !== undefined && temtab !== null) {

                if (temtab.length === 0) {
                  this.info = false;
                     } else {
                  this.info = true;
                     }
              } else {
                this.info = false;
           }

            } else {
              if (
                (this.selectedpieces !== undefined ||
                  this.selectedpieces !== null) &&
                (String(this.numero) !== 'undefined' || String(this.numero) !== 'null')
              ) {
                for (const rec of this.listeRecLivraison) {
                 // piece  = this.selectedpiece.id;
                  console.log('id', this.selectedpieces.id);
                  if (this.selectedpieces.id === 'AB') {
                    if (
                      rec.combine.startsWith('AVOIR ') ||
                      (rec.combine.startsWith('AVOIR2') &&
                      rec.combine.endsWith(this.numero))
                    ) {
                      tabResult.push(rec);
                    }
                  } else if (this.selectedpieces.id === 'AF') {
                    if (
                      rec.combine.startsWith('AVOIRP ') ||
                      (rec.combine.startsWith('AVOIR3') &&
                        rec.combine.endsWith(this.numero))
                    ) {
                      tabResult.push(rec);
                    }
                  } else if (
                    rec.combine.startsWith(this.selectedpieces.id) &&
                    rec.combine.endsWith(this.numero)
                  ) {
                    tabResult.push(rec);
                  }
                }

                        if (tabResult.length === 0) {

                          this.msgerror =  'aucune livraison avec ces critères !';
                          this.op.show(e, document.getElementById('rec'));
                          this.afficherGrid = false;
                          this.info = false;

                        } else {
                          this.afficherGrid = true;
                          this.info = true;
                        }
                this.grid.dataSource = tabResult;
              } else {
                if (
                  String(this.selectedpieces.id) !== 'undefined' &&
                  (String(this.numero) === 'undefined' ||
                    String(this.numero) === 'null')
                ) {
                  for (const rec of this.listeRecLivraison) {
                    if (rec.combine.startsWith(this.selectedpieces.id)) {
                      tabResult.push(rec);
                    }
                  }
                  if (tabResult.length === 0) {
                   this.info = false;
                   this.afficherGrid = false;
                 this.msgerror =  'aucune livraison avec ces critères !';
                  this.op.show(e, document.getElementById('rec'));
                  }
                  this.grid.dataSource = tabResult;
                } else {
                  if (
                    (this.selectedpieces === undefined ||
                      this.selectedpieces === null) &&
                    String(this.numero) !== 'undefined'
                  ) {
                    for (const rec of this.listeRecLivraison) {
                      if (rec.combine.endsWith(this.numero)) {
                        tabResult.push(rec);
                      }
                    }
                    if (tabResult.length === 0) {
                      this.info = false;
                      this.afficherGrid = false;
                      this.msgerror =  'aucune livraison avec ces critères !';
                      this.op.show(e, document.getElementById('rec'));


                    }
                    this.grid.dataSource = tabResult;
                    if (tabResult.length === 0) {
                      this.info = false;
                      this.afficherGrid = false;
                      this.msgerror =  'aucune livraison avec ces critères !';
                      this.op.show(e, document.getElementById('rec'));
                    } else {
                      this.info = true;
                    }
                  }
                }
              }
            }


          } catch {}
  }




async Doubleclickbs(e) {

        //  this.livraison = false;
          this.BonSortieouvert = true;
          this.BonSortie = true;
          this.listeBonSortie = false;
          this.fullscreendialog = true;
          document.getElementById('nbc').focus();

   }


async Doubleclick(e) {
        this.livraison = false;
        this.validation_livraison = true;
        this.BonSortieouvert = true;

        // LivraisonPieces
        await this.mouveService
          .getLivraisonPiece(this.selectedrecord.combine)
          .toPromise()
          .then(data => {
            this.LivraisonPieces = data['_embedded'].livraisonPieces;
          });
  }
async showDialog(e) {
        this.BonSortieouvert = true;
        this.BonSortie = false;

        await this.elivraisonService
          .getBSOuverts()
          .toPromise()
          .then(data => {
            this.elivraisons = data['_embedded'].bondSorties;
            if (this.elivraisons.length === 0) {
                  this.listeBonSortie = false;
                  this.msgerror = 'aucun bon de sortie ouvert';
                  this.op.show(e, document.getElementById('lstbs'));
            } else {
              this.listeBonSortie = true;
            }
          });
  }

rowSelectedBonSortie(args: RowSelectEventArgs) {
        if (this.gridBonSortie.getSelectedRowIndexes()[0] >= 0) {
          const selected: any = this.gridBonSortie.getSelectedRecords()[0];
          this.selectedBS = selected;
          console.log('selectedBS', this.selectedBS);
        }
  }
SelectionBs() {
        this.display = false;
        this.BonSortie = true;
  }
AnnulerBs() {
       this.BonSortie = false;
  }


async validationButtonOuiBS(e) {
  this.wasInside = true;
  if (this.op !== undefined && this.op !== null) {this.op.hide(); }

    try {
                  this.messageService.clear();
                  this.wasInside = true;
                  // requette de validation
                  // Etes vous sûr de vouloir valider livraison ?
                  // this.validOBS = true;
                  this.dLivraison.combine = this.selectedrecord.combine;
                  this.dLivraison.nbc = this.nbColis;
                  this.dLivraison.numero = this.selectedBS.numero;
                  console.log('dlivraison', this.dLivraison);
                  this.dLivraisonService
                    .createDlivraison(this.dLivraison)
                    .toPromise()
                    .then(data => {
                      console.log('dlivraison', data);
                    });
                  if (
                    String(this.livrObservation) === 'undefined' ||
                    String(this.livrObservation) === 'null'
                  ) {
                    this.livrObservation = '';
                  }
                  console.log('selectedBS methode', this.selectedBS);
                  await this.recettesService
                        .modifLivrObservatBS(
                          this.livrObservation,
                          this.selectedBS.numero,
                          this.selectedrecord.combine
                        )
                        .toPromise()
                        .then(data => {
                          console.log('modification', data);



                          const codeUtil = localStorage.getItem('login');
                          const moduteName = globals.selectedMenu;
                          const paramMouchar = this.selectedrecord.combine + ' BS ' + this.selectedBS.numero
                                                + ' MNT ' + this.selectedrecord.net;
                          this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
                          .then((data) => {
                            console.log(data);
                          });

                    });
                  this.validation_livraison = false;

                  this.listeRecLivraison.splice(
                    this.listeRecLivraison.indexOf(this.selectedrecord),
                    1
                  );
                  // this.grid.refresh();
                  this.ngOnInit();
                  this.displayValidation = false;
                  this.livraison = true;
                //  this.nouvelsaisie = true;
                  } catch {

                  }
                }

async validationButtonOuiLO() {
  if (this.op !== undefined && this.op !== null) {this.op.hide(); }
      this.messageService.clear();
      this.wasInside = true;
      await this.recettesService
        .modifLivrObservat(this.livrObservation, this.selectedrecord.combine)
        .toPromise()
        .then(data => {


          const codeUtil = localStorage.getItem('login');
          const moduteName = globals.selectedMenu;
          const paramMouchar = this.selectedrecord.combine + ' OBS ' + ' MNT ' + this.selectedrecord.net;
          this.loginService.procedureStockeModule(codeUtil, moduteName, paramMouchar ).toPromise()
          .then((data) => {
            console.log(data);
          });
        });
        this.listeRecLivraison.splice(
        this.listeRecLivraison.indexOf(this.selectedrecord),
        1
      );
      this.ngOnInit();
      this.displayValidation = false;
      this.validation_livraison = false;
      this.livraison = true;
      this.nbColis = null;
      this.livrObservation = null;
     // this.nouvelsaisie = true;

  }

  async validerLivraison(e) {

    if (this.op !== undefined && this.op !== null) {this.op.hide(); }
   try {


    this.messageService.clear();
    this.wasInside = true;
    // nb des colis si Bs est activé
    if (this.BonSortie) {
              if (
                String(this.nbColis) === 'null' ||
                String(this.nbColis) === '' ||
                String(this.nbColis) === 'undefined'
              ) {

                this.msgerror = 'Nombre de colis est obligatoire  !';
                document.getElementById('nbc').focus();
                this.op.show(e, document.getElementById('nbc'));



              } else {
                  console.log('bs', this.selectedBS);

                      this.validationButtonOuiBS(e);

              }
    } else {
            // observation est obligatoire
            if (
              String(this.livrObservation) === 'null' ||
              String(this.livrObservation) === '' ||
              String(this.livrObservation) === 'undefined'
            ) {

              document.getElementById('ol').focus();
              this.msgerror = 'Observation est obligatoire !';
              this.op.show(e, document.getElementById('ol'));



            } else {
                this.validationButtonOuiLO();


            }

    }

  } catch {
  }
  // this.nouvelsaisie = true;

  }

}
