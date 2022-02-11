import {
  Component,
  OnInit,
  Input,
  ViewChild,
  HostListener,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';

import { StockService } from '../services/stock.service';
import { LoginService } from 'src/app/login/login.service';
import { FournisseurService } from '../services/fournisseur.service';
import { SfamilleService } from '../services/sfamille.service';
import { FamilleService } from '../services/famille.service';
import { MouveService } from '../services/mouve.service';
import { CommandeService } from '../services/commande.service';
import { ConfirmationService } from 'primeng/api';
import {
  GridComponent,
  SearchSettingsModel,
  ToolbarItems,
  RowSelectEventArgs,
} from '@syncfusion/ej2-angular-grids';

import { L10n, setCulture } from '@syncfusion/ej2-base';
setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' ',
    },
  },
});
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { Stock } from '../services/stock';
import { globals } from 'src/environments/environment';
@Component({
  selector: 'app-ajout-modif-supp-ref',
  templateUrl: './ajout-modif-supp-ref.component.html',
  styleUrls: ['./ajout-modif-supp-ref.component.scss'],
  providers: [ConfirmationService],
})
export class AjoutModifSuppRefComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('op')
  public op: OverlayPanel;
  listeFamille: any;
  listesfamilles: any;
  listeFournisseur: any;
  listeArticles = new Array();
  public toolbarOptions: ToolbarItems[];
  public searchOptions: SearchSettingsModel;
  SelectedArticleCode: string;
  SelectedArticleDesign: string;
  SelectedArticlePrACHDT: string;
  SelectedArticlePrACHDTAffich = false;
  SelectedArticleDPachat: string;
  SelectedArticleDateAchat = '';
  SelectedArticlePrixUnHT: string;
  readonly = false;
  searchWord: string;
  SelectedArticle: any;
  listfour = new Array();
  hidden: boolean;
  selectedFour;
  codeFour: string;
  selectedFamille = null;
  wasInside: boolean;
  codeFamille = '';
  selectedSousFamille = null;
  codeSousFamille = '';
  listeON = [
    { id: 'O', deno: 'Oui' },
    { id: 'N', deno: 'Non' },
  ];

  listeTva = [
    { id: '0', deno: '0' },
    { id: '7', deno: '7' },
    { id: '13', deno: '13' },
    { id: '19', deno: '19' },
  ];

  selectedOrigine = null;
  codeOrigine = '';
  qteEntiere;
  SelectedQteEntiere = null;
  codeQteEntiere = '';
  SelectedImp = null;
  codeImp = '';

  @ViewChild('tva') tva: NgSelectComponent;
  @ViewChild('famil') famil: NgSelectComponent;
  @ViewChild('sfamil') sfamil: NgSelectComponent;
  @ViewChild('four') four: NgSelectComponent;
  @ViewChild('qteEnt') qteEnt: NgSelectComponent;
  @ViewChild('origin') origin: NgSelectComponent;
  @ViewChild('imp') imp: NgSelectComponent;

  hiddenBtnModif: boolean;
  hiddenBtnSup: boolean;
  hiddenBtnAjout: boolean;
  hiddenBtnModifPrix: boolean;
  SelectedArticleQteEntiere: any;
  SelectedArticleEmplacement;
  SelectedArticleAgenda: any;
  SelectedArticleMarge: any;
  SelectedArticleMin: any;
  SelectedArticleMax: any;
  SelectedArticleFamille: any;
  famille: any;
  sfamille: any;
  SelectedArticleSousFamille: any;
  tn;
  dateAch = null;
  SelectedArticleImp: any;
  SelectedArticleOrigine: any;
  SelectedArticleTvaObj: any;
  SelectedArticleTva: any;
  affichDetails: boolean;
  hiddenBtnValider: boolean;
  readOnlyref: boolean;
  readOnlyPrunit = false;

  validsupp = false;
  validAjout = false;
  validModif = false;
  msgerror: string;
  validatorChamp: boolean;
  module: string;
  blockedDocument;
  goTo(select) {
    select.focus();
  }
  constructor(
    private stockService: StockService,
    private loginService: LoginService,
    private sfamilleService: SfamilleService,
    private fournisseurService: FournisseurService,
    private familleService: FamilleService,
    private mouveService: MouveService,
    private commandeService: CommandeService,
    private confirmationService: ConfirmationService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }

  annulerSelectionStock(): void {
    this.wasInside = true;
    this.op.hide();
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.SelectedArticle = null;
      this.hiddenBtnValider = false;
      this.hiddenBtnAjout = false;
      this.hiddenBtnModif = true;
      this.hiddenBtnSup = true;
      this.hiddenBtnModifPrix = true;
      this.readonly = false;
    }
    this.SelectedArticle = null;
    this.initChamps();
    this.readOnlyref = false;
  }
  changeOrigine() {
    if (
      this.SelectedArticleOrigine === null ||
      this.SelectedArticleOrigine === undefined
    ) {
      this.codeOrigine = 'N';
      console.log('code Origine', this.codeOrigine + '...');
    } else {
      this.codeOrigine = this.SelectedArticleOrigine.id;
      console.log('code Origine', this.codeOrigine + '...');
    }
  }
  changeTva() {
    if (
      this.SelectedArticleTvaObj === null ||
      this.SelectedArticleTvaObj === undefined
    ) {
      this.SelectedArticleTva = '19';
    } else {
      this.SelectedArticleTva = this.SelectedArticleTvaObj.deno;
    }
  }

  changeQteEntiere() {
    if (
      this.SelectedArticleQteEntiere === null ||
      this.SelectedArticleQteEntiere === undefined
    ) {
      this.codeQteEntiere = 'N';
      console.log('code Qte Entiere', this.codeQteEntiere + '...');
    } else {
      this.codeQteEntiere = this.SelectedArticleQteEntiere.id;
      console.log('code Qte Entiere', this.codeQteEntiere + '...');
    }
  }

  async chargementFour(code) {
    await this.fournisseurService
      .getFourByCode(code)
      .toPromise()
      .then((data) => {
        this.selectedFour = data['_embedded'].fournisseurs[0];
        console.log('fourniseeur by id ', data);
      })
      .catch((erreur) => {
        console.log('erreur fourniseeur by id ', erreur);
      })
      .finally(() => {
        console.log('chargement four by code  est terminé');
      });
  }

  async chargementFamille(code) {
    await this.familleService
      .FamByCode(code)
      .toPromise()
      .then((data) => {
        this.famille = data['_embedded'].familles[0];
        this.selectedFamille = this.famille;
        // this.SelectedArticleFamille = this.famille.nom;
        console.log('famille by id ', this.SelectedArticleFamille);
      })
      .catch((erreur) => {
        console.log('erreur chargement famille by id ', erreur);
      })
      .finally(() => {
        console.log('chargement famille by code  est terminé');
      });
  }

  async chargementSousFamille(code) {
    await this.sfamilleService
      .getSfamilleByCode(code)
      .toPromise()
      .then((data) => {
        this.sfamille = data['_embedded'].sfamilles[0];
        this.selectedSousFamille = this.sfamille;
        //  this.SelectedArticleSousFamille = this.sfamille.nom;
        console.log('famille by id ', data);
      })
      .catch((erreur) => {
        console.log('erreur chargement famille by id ', erreur);
      })
      .finally(() => {
        console.log('chargement famille by code  est terminé');
      });
  }

  chargementON(id): any {
    if (id === 'O') {
      console.log('selected item o/n ', this.listeON[0]);

      return this.listeON[0];
    } else {
      console.log('selected item o/n ', this.listeON[1]);
      return this.listeON[1];
    }
  }

  changeImprimable() {
    if (
      this.SelectedArticleImp === null ||
      this.SelectedArticleImp === undefined
    ) {
      this.codeImp = '';
      console.log('code imprimable', this.codeImp + '...');
    } else {
      this.codeImp = this.SelectedArticleImp.id;
      console.log('code imprimable', this.codeImp + '...');
    }
  }
  changeFournisseur() {
    if (this.selectedFour === null || this.selectedFour === undefined) {
      this.codeFour = '';
      console.log('code four', this.codeFour + '...');
    } else {
      this.codeFour = this.selectedFour.code;
      console.log('code four', this.codeFour + '...');
    }
  }

  changeFamille() {
    if (this.selectedFamille === null || this.selectedFamille === undefined) {
      this.codeFamille = '';
      console.log('code fam', this.codeFamille + '...');
    } else {
      this.codeFamille = this.selectedFamille.code;
      console.log('code fam', this.codeFamille + '...');
    }
  }

  changeSousFamille() {
    if (
      this.selectedSousFamille === null ||
      this.selectedSousFamille === undefined
    ) {
      this.codeSousFamille = '';
      console.log('code sous fam', this.codeSousFamille + '...');
    } else {
      this.codeSousFamille = this.selectedSousFamille.code;
      console.log('code sous fam', this.codeSousFamille + '...');
    }
  }

  public onSearchItemByDeno(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  public onSearchItemByNom(word: string, item: any): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  ConvertStringToDate(dateString) {
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

  /*


achat: null  null/////////////////////////////////////////////// verif value  obligatoire ->>>>>>>>>>>
achatD: null
achatP: null
agenda: null
ca: "0.0"
code: " L 315643/C4UJ202"
commQuant: "0.0"
dPachat:
design: "BAGUE INT"
devise: null
emplacement: null
equiv: null
famille: "001"
id: "1"
imp: "O"
marge: "0.0"
max: "0.0"
min: "0.0"
nbrBl: "44374"
nbrC: "0"
nbrCl: null
operateur: "4010002"
origine: "O"
pInv: "0002"
prix: "0.000"
profilCa: null
profilTyp: "1"
qInv: "0.0"
qtEnt: "O"
qtTotal: "0"
qtTotal1: "0"
qteTotal1: null
quantite: "0"
sfamille: "000"
taxe: "0.0"
tva: "19"*/

  rowSelected(e) {
    if (this.module === 'Ajout-Modif-Supp Réf + Modif PRIX') {
      this.hiddenBtnModifPrix = false;
      this.readOnlyPrunit = false;
    }
    this.affichDetails = false;
    this.hiddenBtnAjout = true;
    this.hiddenBtnModif = false;
    this.hiddenBtnAjout = false;
    this.hiddenBtnSup = false;
    this.readonly = true;

    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.grid.getSelectedRecords()[0];
      this.SelectedArticle = selected;
    } else {
      /*
          this.SelectedArticleCode = null;
          this.SelectedArticleDesign = null;
          this.SelectedArticlePrACHDT = null;
          this.SelectedArticlePrACHDT = Number(this.SelectedArticle.achat).toFixed(3);
          this.SelectedArticleDPachat = null;
          this.SelectedArticleDPachat = Number(this.SelectedArticle.dPachat).toFixed(3);
          this.SelectedArticleDateAchat = null;
          this.SelectedArticleDateAchat = Number(this.SelectedArticleDateAchat).toFixed(3);

         this.SelectedArticlePrixUnHT = null;
        this.SelectedArticlePrixUnHT =  Number(this.SelectedArticlePrixUnHT).toFixed(3);
        this.SelectedArticleQteEntiere = null;
        this.SelectedArticleImp = null;
        this.SelectedArticleOrigine = null;
        this.SelectedArticleTva = null ;
        this.SelectedArticleEmplacement =  null;
        this.SelectedArticleAgenda =  null ;
        this.SelectedArticleMarge =  null;
        this.SelectedArticleMin =  null;
        this.SelectedArticleMax =  null;
        this.selectedFamille = null;
        this.selectedSousFamille = null;
        this.selectedFour = null;
        this.dateAch = null;
        this.affichDetails = false;
*/
    }
  }

  initChamps() {
    this.SelectedArticleCode = null;
    this.SelectedArticleDesign = null;
    this.SelectedArticlePrACHDT = null;
    // this.SelectedArticlePrACHDT = Number(this.SelectedArticlePrACHDT).toFixed(3);
    this.SelectedArticleDPachat = null;
    // this.SelectedArticleDPachat = Number(this.SelectedArticleDPachat).toFixed(3);
    this.SelectedArticleDateAchat = null;
    //  this.SelectedArticleDateAchat = Number(this.SelectedArticleDateAchat).toFixed(3);

    this.SelectedArticlePrixUnHT = null;
    // this.SelectedArticlePrixUnHT =  Number(this.SelectedArticlePrixUnHT).toFixed(3);
    this.SelectedArticleQteEntiere = null;
    this.SelectedArticleImp = null;
    this.SelectedArticleOrigine = null;
    this.SelectedArticleTva = '19';
    this.SelectedArticleEmplacement = null;
    this.SelectedArticleAgenda = null;
    this.SelectedArticleMarge = null;
    this.SelectedArticleMin = null;
    this.SelectedArticleMax = null;
    this.selectedFamille = null;
    this.selectedSousFamille = null;
    this.selectedFour = null;
    this.dateAch = null;
  }

  async search(mot: string) {
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        console.log('liste stock by deseign', data);
        this.listeArticles = data['_embedded'].stocks;
      })
      .catch((error) => {
        console.log('ereeur lors de chargement des stocks', error);
      })
      .finally(() => {
        console.log('chargement est terminé ');
      });

    this.grid.dataSource = this.listeArticles;
    this.grid.refreshColumns();
    this.grid.refresh();
  }

  champObligatoire(e, champ, id) {
    this.wasInside = true;
    this.op.hide();

    this.msgerror = 'ATTENTION! ' + champ + ' est obligatoire !!';
    this.op.show(e, document.getElementById(id));
    setTimeout(() => {
      document.getElementById(id).click();
      document.getElementById(id).focus();
    }, 0);
  }

  ClickBtnmodifPrix() {
    this.SelectedArticlePrACHDTAffich = false;
    this.readonly = false;
    this.readOnlyPrunit = false;
    this.readOnlyref = true;
    this.hiddenBtnSup = true;
    this.hiddenBtnModif = true;
    this.hiddenBtnAjout = true;
    this.hiddenBtnModifPrix = false;
    this.RecupererDetaisArtcile();
    this.validModif = true;
    this.validAjout = false;
    this.validsupp = false;
    this.affichDetails = true;
    this.readonly = false;
    this.loginService

      .procedureStockeModule(
        localStorage.getItem('login'),
        globals.selectedMenu,
        ' Modif ' + this.SelectedArticle.code
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  ClickBtnmodif() {
    this.validModif = true;
    this.validsupp = false;
    this.validAjout = false;
    this.SelectedArticlePrACHDTAffich = false;

    this.readonly = false;
    this.readOnlyPrunit = true;
    this.readOnlyref = true;
    this.hiddenBtnSup = true;
    this.hiddenBtnAjout = true;
    this.hiddenBtnModifPrix = true;
    this.RecupererDetaisArtcile();

    this.affichDetails = true;
  }
  ClickBtnAjout() {
    this.wasInside = true;
    this.initChamps();
    this.op.hide();
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
      this.SelectedArticle = null;
      this.hiddenBtnModif = true;
      this.hiddenBtnSup = true;
      this.hiddenBtnAjout = false;
      this.hiddenBtnModifPrix = true;
      this.readonly = true;
    }
    this.SelectedArticleTvaObj = { id: '19', deno: '19' };
    this.SelectedArticleTva = '19';
    this.affichDetails = true;
    this.readOnlyPrunit = false;
    this.validAjout = true;
    this.validModif = false;
    this.validsupp = false;
    this.SelectedArticlePrACHDTAffich = true;
    this.readonly = false;
    this.readOnlyref = false;
    setTimeout(() => {
      // document.getElementById(`btnvalider`).click();
      document.getElementById(`cod`).focus();
    }, 0);
  }

  async RecupererDetaisArtcile() {
    this.wasInside = true;
    this.op.hide();
    if (this.SelectedArticle !== null && this.SelectedArticle !== undefined) {
      this.SelectedArticlePrACHDTAffich = false;
      this.SelectedArticleCode = this.SelectedArticle.code;
      this.SelectedArticleDesign = this.SelectedArticle.design;

      this.SelectedArticlePrACHDT = Number(this.SelectedArticle.achat).toFixed(
        3
      );
      this.SelectedArticleDPachat = Number(
        this.SelectedArticle.dPachat
      ).toFixed(3);
      if (this.SelectedArticle.achatD !== null) {
        this.SelectedArticleDateAchat = this.SelectedArticle.achatD;
      } else {
        this.SelectedArticleDateAchat = null;
      }
      if (
        this.SelectedArticle.prix === null ||
        this.SelectedArticle.prix === undefined
      ) {
        this.SelectedArticlePrixUnHT = null;
      } else {
        this.SelectedArticlePrixUnHT = Number(
          this.SelectedArticle.prix
        ).toFixed(3);
      }

      this.SelectedArticleQteEntiere = this.chargementON(
        this.SelectedArticle.qtEnt
      );
      this.codeQteEntiere = this.SelectedArticle.qtEnt;

      this.SelectedArticleImp = this.chargementON(this.SelectedArticle.imp);
      this.codeImp = this.SelectedArticle.imp;
      this.SelectedArticleOrigine = this.chargementON(
        this.SelectedArticle.origine
      );
      this.codeOrigine = this.SelectedArticle.origine;

      this.SelectedArticleTvaObj = {
        id: String(this.SelectedArticle.tva),
        deno: String(this.SelectedArticle.tva),
      };
      this.SelectedArticleTva = String(this.SelectedArticle.tva);
      if (this.SelectedArticle.emplacement === null) {
        this.SelectedArticleEmplacement = '';
      } else {
        this.SelectedArticleEmplacement = this.SelectedArticle.emplacement;
      }

      this.SelectedArticleAgenda = this.SelectedArticle.agenda;
      this.SelectedArticleMarge = this.SelectedArticle.marge;
      this.SelectedArticleMin = this.SelectedArticle.min;
      this.SelectedArticleMax = this.SelectedArticle.max;

      this.chargementFamille(this.SelectedArticle.famille);
      this.codeFamille = this.SelectedArticle.famille;
      this.chargementSousFamille(this.SelectedArticle.sfamille);
      this.codeSousFamille = this.SelectedArticle.sfamille;
      this.chargementFour(this.SelectedArticle.operateur);
      this.codeFour = this.SelectedArticle.operateur;

      if (
        this.SelectedArticle.achatD !== null &&
        this.SelectedArticle.achatD !== undefined
      ) {
        this.dateAch = this.ConvertStringToDate(this.SelectedArticle.achatD);
      } else {
        this.dateAch = null;
      }
    }
  }

  ClickBtnSupp() {
    this.SelectedArticlePrACHDTAffich = false;
    this.wasInside = true;
    this.op.hide();
    this.validsupp = true;
    this.validModif = false;
    this.validAjout = false;
    this.readonly = true;
    this.readOnlyref = true;
    this.readOnlyPrunit = false;
    this.hiddenBtnModif = true;
    this.hiddenBtnModifPrix = true;
    this.hiddenBtnAjout = true;
    this.RecupererDetaisArtcile();
    this.affichDetails = true;
  }
  ClickBtnModifPrix() {}

  async verifSaisie(e) {
    this.op.hide();
    this.wasInside = true;
    // this.op.hide();
    // tslint:disable-next-line:max-line-length
    if (this.validAjout) {
      await this.verifierAjout(e);
      //  this.validAjout = false;
    } else {
      this.goTo(this.tva);
      if (
        this.SelectedArticleTvaObj === null ||
        this.SelectedArticleTvaObj === undefined ||
        this.SelectedArticleTvaObj.deno === '' ||
        this.SelectedArticleTvaObj.deno === 'null'
      ) {
        this.champObligatoire(e, 'Taux TVA', 'tva');
      } else {
        if (
          this.SelectedArticleDesign === null ||
          this.SelectedArticleDesign === undefined ||
          this.SelectedArticleDesign === ''
        ) {
          this.champObligatoire(e, 'Désignation', 'des');
        } else {
          this.goTo(this.famil);
          if (
            this.codeFamille === null ||
            this.codeFamille === undefined ||
            this.codeFamille === ''
          ) {
            this.champObligatoire(e, 'Famille', 'famil');
          } else {
            this.goTo(this.sfamil);
            if (
              this.codeSousFamille === null ||
              this.codeSousFamille === undefined ||
              this.codeSousFamille === ''
            ) {
              this.champObligatoire(e, 'Sous Famille', 'sfamil');
            } else {
              this.goTo(this.four);
              if (
                this.codeFour === null ||
                this.codeFour === undefined ||
                this.codeFour === ''
              ) {
                this.champObligatoire(e, 'Fournisseur', 'four');
              } else {
                // tslint:disable-next-line:max-line-length
                if (
                  (this.SelectedArticlePrixUnHT === null ||
                    this.SelectedArticlePrixUnHT === undefined ||
                    this.SelectedArticlePrixUnHT === '') &&
                  this.hiddenBtnModifPrix === false
                ) {
                  this.champObligatoire(e, 'Prix Unit HT', 'prunit');
                } else {
                  this.goTo(this.qteEnt);
                  if (
                    this.SelectedArticleQteEntiere === null ||
                    this.SelectedArticleQteEntiere === undefined
                  ) {
                    this.champObligatoire(e, 'Qunatité entière', 'qteEnt');
                  } else {
                    this.goTo(this.origin);
                    if (
                      this.SelectedArticleOrigine === null ||
                      this.SelectedArticleOrigine === undefined
                    ) {
                      this.champObligatoire(e, 'Origine', 'origin');
                    } else {
                      this.goTo(this.imp);
                      if (
                        this.SelectedArticleImp === null ||
                        this.SelectedArticleImp === undefined
                      ) {
                        this.champObligatoire(e, 'Imprimable', 'imp');
                      } else {
                        try {
                          setTimeout(() => {
                            // document.getElementById(`btnvalider`).click();
                            //  document.getElementById(`btnvalider`).focus();
                          }, 0);
                        } catch (msg) {
                          console.log('erreur saisie article');
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // ****   this.champObligatoire(e, this.SelectedArticlePrixUnHT, 'Prix Unit HT', 'prunit');
  }

  async validerModif(e) {
    this.wasInside = true;
    this.op.hide();
    this.wasInside = true;
    // this.op.hide();
    // tslint:disable-next-line:max-line-length
    console.log('tvaaaaa modif  ', this.SelectedArticleTvaObj);

    if (
      this.SelectedArticleTvaObj === null ||
      this.SelectedArticleTvaObj === undefined ||
      this.SelectedArticleTvaObj.deno === '' ||
      this.SelectedArticleTvaObj.deno === 'null'
    ) {
      this.goTo(this.tva);
      this.champObligatoire(e, 'Taux TVA', 'tva');
    } else {
      if (
        this.SelectedArticleDesign === null ||
        this.SelectedArticleDesign === undefined ||
        this.SelectedArticleDesign === ''
      ) {
        this.champObligatoire(e, 'Désignation', 'des');
      } else {
        if (
          this.codeFamille === null ||
          this.codeFamille === undefined ||
          this.codeFamille === ''
        ) {
          this.goTo(this.famil);
          this.champObligatoire(e, 'Famille', 'famil');
        } else {
          if (
            this.codeSousFamille === null ||
            this.codeSousFamille === undefined ||
            this.codeSousFamille === ''
          ) {
            this.goTo(this.sfamil);
            this.champObligatoire(e, 'Sous Famille', 'sfamil');
          } else {
            if (
              this.codeFour === null ||
              this.codeFour === undefined ||
              this.codeFour === ''
            ) {
              this.goTo(this.four);
              this.champObligatoire(e, 'Fournisseur', 'four');
            } else {
              // tslint:disable-next-line:max-line-length
              if (
                (this.SelectedArticlePrixUnHT === null ||
                  this.SelectedArticlePrixUnHT === undefined ||
                  this.SelectedArticlePrixUnHT === '') &&
                this.hiddenBtnModifPrix === false
              ) {
                this.champObligatoire(e, 'Prix Unit HT', 'prunit');
              } else {
                if (
                  this.SelectedArticleQteEntiere === null ||
                  this.SelectedArticleQteEntiere === undefined
                ) {
                  this.goTo(this.qteEnt);
                  this.champObligatoire(e, 'Qunatité entière', 'qteEnt');
                } else {
                  if (
                    this.SelectedArticleOrigine === null ||
                    this.SelectedArticleOrigine === undefined
                  ) {
                    this.goTo(this.origin);
                    this.champObligatoire(e, 'Origine', 'origin');
                  } else {
                    if (
                      this.SelectedArticleImp === null ||
                      this.SelectedArticleImp === undefined
                    ) {
                      this.goTo(this.imp);
                      this.champObligatoire(e, 'Imprimable', 'imp');
                    } else {
                      try {
                        const article = this.SelectedArticle;

                        console.log(
                          'article avant modif ',
                          this.SelectedArticle
                        );

                        // console.log('const article ',article);
                        article.code = this.SelectedArticleCode;
                        article.agenda = this.SelectedArticleAgenda;
                        article.design = this.SelectedArticleDesign;
                        article.tva = this.SelectedArticleTva;
                        article.origine = this.codeOrigine;
                        article.famille = this.codeFamille;
                        article.sfamille = this.codeSousFamille;
                        article.operateur = this.codeFour;
                        article.imp = this.codeImp;
                        // 1
                        // article.min = null;
                        // 2
                        // article.max = null;
                        // 3
                        //  article.dPachat = null;
                        article.emplacement = this.SelectedArticleEmplacement;
                        // 4
                        // article.achatD = null;
                        article.prix = this.SelectedArticlePrixUnHT;
                        article.qtEnt = this.codeQteEntiere;
                        // 5
                        // article.marge = null;

                        this.blockedDocument = true;
                        await this.stockService
                          .updateStock(article)
                          .toPromise()
                          .then((data) => {
                            console.log('Modif article ...... ', data);
                          });
                        this.blockedDocument = false;

                        this.affichDetails = false;

                        this.grid.selectRows([]);
                        this.hiddenBtnModif = true;
                        if (!this.hiddenBtnModifPrix) {
                          this.hiddenBtnModifPrix = true;
                        }
                        this.hiddenBtnSup = true;
                        this.hiddenBtnAjout = false;

                        await this.initChamps();
                        this.readonly = false;
                        this.readOnlyref = false;
                        await this.loginService
                          .procedureStockeModule(
                            localStorage.getItem('login'),
                            globals.selectedMenu,
                            ' M ' + article.code
                          )
                          .toPromise()
                          .then((data) => {
                            console.log(data);
                          });
                        // article = null;
                        this.validModif = false;
                      } catch (msg) {
                        console.log('erreur Modif art');
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // ****   this.champObligatoire(e, this.SelectedArticlePrixUnHT, 'Prix Unit HT', 'prunit');
  }

  focusRech() {
    this.wasInside = true;
    this.op.hide();

    if (this.hiddenBtnAjout === true) {
      this.readOnlyref = true;
    }

    if (!this.readonly) {
      if (this.grid.getSelectedRowIndexes()[0] >= 0) {
        this.grid.selectRows([]);
        this.hiddenBtnAjout = false;
        this.hiddenBtnModif = true;
        this.hiddenBtnModifPrix = true;
        this.hiddenBtnSup = true;
        this.SelectedArticle = null;
        this.affichDetails = false;
      }
    }
  }

  async validerSupp(code: string, e) {
    this.wasInside = true;
    this.op.hide();
    let listeMouves = new Array();
    let listCommandes = new Array();
    await this.mouveService
      .getMouveByCode(code)
      .toPromise()
      .then((data) => {
        console.log('mouve  ', data['_embedded'].mouves);
        listeMouves = data['_embedded'].mouves;
      })
      .catch((error) => {
        console.log('error ', error);
      })
      .finally(() => {
        console.log('chargement du mouve est terminé !');
      });

    await this.commandeService
      .getByArtCmd(code)
      .toPromise()
      .then((data) => {
        console.log('commande ', data['_embedded'].commandes);
        listCommandes = data['_embedded'].commandes;
      })
      .catch((error) => {
        console.log('error ', error);
      })
      .finally(() => {
        console.log('chargement du commande est terminé !');
      });

    if (listeMouves.length > 0) {
      this.msgerror =
        'ATTENTION! Article mouvementé‚ La suppression est impossible !!';

      this.op.show(e, document.getElementById('btnValider'));
    } else {
      if (listCommandes.length > 0) {
        this.msgerror =
          'ATTENTION! Article commandé‚ La suppression est impossiblee !!';
        this.op.show(e, document.getElementById('btnValider'));
      } else {
        if (Number(this.SelectedArticle.quantite) > 0) {
          this.msgerror =
            'ATTENTION! Quantité en stock > 0‚ La suppression est impossiblee !!';
          this.op.show(e, document.getElementById('btnValider'));
        } else {
          await this.confirmationService.confirm({
            message: 'Voulez vous vraiment supprimer cet article ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: async () => {
              this.blockedDocument = true;
              this.stockService
                .delete(this.SelectedArticle.id)
                .toPromise()
                .then((data) => {
                  console.log('supprimer', data);
                });
              this.blockedDocument = false;

              let i = 0;
              while (
                i < this.listeArticles.length &&
                this.listeArticles[i].id !== this.SelectedArticle.id
              ) {
                i++;
              }
              this.listeArticles.splice(i, 1);
              this.grid.refresh();
              this.affichDetails = false;
              this.hiddenBtnAjout = false;
              this.readOnlyref = false;
              this.hiddenBtnSup = true;
              this.validsupp = false;
              this.initChamps();
              this.loginService
                .procedureStockeModule(
                  localStorage.getItem('login'),
                  globals.selectedMenu,
                  ' Supp ' + this.SelectedArticle.code
                )
                .subscribe((data) => {
                  console.log(data);
                });
              this.readonly = false;
              this.readOnlyref = false;
            },
            reject: () => {
              this.readonly = false;
              this.readOnlyref = false;
            },
          });
        }
      }
    }
  }

  focusEmplacement(id) {
    setTimeout(() => {
      document.getElementById(id).click();
      document.getElementById(id).focus();
    }, 0);
  }

  async valider(e) {
    this.wasInside = true;
    this.op.hide();

    if (this.validAjout) {
      await this.validerAjout(e);
      //  this.validAjout = false;
    } else {
      if (this.SelectedArticle !== null && this.SelectedArticle !== undefined) {
        if (this.validsupp) {
          await this.validerSupp(this.SelectedArticle.code, e);

          //   this.validsupp = false;
        } else {
          if (this.validModif) {
            await this.validerModif(e);
          }
        }
      }
    }
  }

  async annuler() {
    this.wasInside = true;
    this.op.hide();
    this.grid.selectRows([]);
    this.hiddenBtnSup = true;
    this.hiddenBtnModif = true;
    this.hiddenBtnModifPrix = true;
    this.hiddenBtnAjout = false;
    this.affichDetails = false;
    this.SelectedArticle = null;

    await this.initChamps();
    this.readonly = false;
  }

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
    this.wasInside = true;
    this.op.hide();
    this.blockedDocument = false;
    this.SelectedArticlePrixUnHT = null;
    this.module = globals.selectedMenu;
    this.SelectedArticleQteEntiere = { id: 'N', deno: 'Non' };
    this.SelectedArticleImp = { id: 'N', deno: 'Non' };
    this.SelectedArticleOrigine = { id: 'N', deno: 'Non' };
    this.SelectedArticleTvaObj = { id: '19', deno: '19' };
    this.SelectedArticleTva = '19';

    this.affichDetails = false;
    this.hiddenBtnModif = true;
    this.hiddenBtnSup = true;
    this.hiddenBtnAjout = false;
    this.hiddenBtnModifPrix = true;
    this.listeArticles = new Array();

    await this.familleService
      .getFamillesList()
      .toPromise()
      .then((data) => {
        console.log('famille liste  ', data);
        this.listeFamille = data['_embedded'].familles;
      });

    await this.sfamilleService.getSfamillesList().subscribe((data) => {
      this.listesfamilles = data['_embedded'].sfamilles;
      console.log('sous famille liste  ', data);
    });

    await this.fournisseurService
      .getFourList()
      .toPromise()
      .then((data) => {
        this.listeFournisseur = data['_embedded'].fournisseurs;
        console.log('fournisseurs liste  ', this.listeFournisseur);
      });
  }

  async verifierAjout(e) {
    this.wasInside = true;
    this.op.hide();

    if (
      this.SelectedArticleCode === null ||
      this.SelectedArticleCode === undefined ||
      this.SelectedArticleCode === ''
    ) {
      this.msgerror = 'ATTENTION! Code est obligatoire !!';
      this.op.show(e, document.getElementById('cod'));
    } else {
      if (this.SelectedArticleCode.length < 20) {
        let articles = new Array();
        await this.stockService
          .getStock(this.SelectedArticleCode)
          .toPromise()
          .then((data) => {
            console.log('article ', data);
            articles = data['_embedded'].stocks;
          })
          .catch((error) => {
            console.log('erreur chargement article ', error);
          })
          .finally(() => {
            console.log('fin du chargement d\'article ');
          });

        if (articles.length > 0) {
          this.msgerror = 'ATTENTION! Code déja existe, repetez la saisie !!';
          this.op.show(e, document.getElementById('cod'));
        } else {
          this.goTo(this.tva);
          if (
            this.SelectedArticleTvaObj === null ||
            this.SelectedArticleTvaObj === undefined ||
            this.SelectedArticleTvaObj.deno === '' ||
            this.SelectedArticleTvaObj.deno === 'null'
          ) {
            this.champObligatoire(e, 'Taux TVA', 'tva');
          } else {
            if (
              this.SelectedArticleDesign === null ||
              this.SelectedArticleDesign === undefined ||
              this.SelectedArticleDesign === ''
            ) {
              this.champObligatoire(e, 'Désignation', 'des');
            } else {
              this.goTo(this.famil);
              if (
                this.codeFamille === null ||
                this.codeFamille === undefined ||
                this.codeFamille === ''
              ) {
                this.champObligatoire(e, 'Famille', 'famil');
              } else {
                this.goTo(this.sfamil);
                if (
                  this.codeSousFamille === null ||
                  this.codeSousFamille === undefined ||
                  this.codeSousFamille === ''
                ) {
                  this.champObligatoire(e, 'Sous Famille', 'sfamil');
                } else {
                  this.goTo(this.four);
                  if (
                    this.codeFour === null ||
                    this.codeFour === undefined ||
                    this.codeFour === ''
                  ) {
                    this.champObligatoire(e, 'Fournisseur', 'four');
                  } else {
                    // tslint:disable-next-line:max-line-length
                    if (
                      this.SelectedArticlePrixUnHT === null ||
                      this.SelectedArticlePrixUnHT === undefined ||
                      this.SelectedArticlePrixUnHT === ''
                    ) {
                      this.champObligatoire(e, 'Prix Unit HT', 'prunit');
                    } else {
                      this.goTo(this.qteEnt);
                      if (
                        this.SelectedArticleQteEntiere === null ||
                        this.SelectedArticleQteEntiere === undefined
                      ) {
                        this.champObligatoire(e, 'Qunatité entière', 'qteEnt');
                      } else {
                        // tslint:disable-next-line:max-line-length
                        if (
                          this.SelectedArticlePrACHDT === null ||
                          this.SelectedArticlePrACHDT === undefined ||
                          this.SelectedArticlePrACHDT === '' ||
                          Number(this.SelectedArticlePrACHDT) <= 0
                        ) {
                          this.champObligatoire(
                            e,
                            'Prix d\'achat en DT ',
                            'pad'
                          );
                        } else {
                          this.goTo(this.origin);
                          if (
                            this.SelectedArticleOrigine === null ||
                            this.SelectedArticleOrigine === undefined
                          ) {
                            this.champObligatoire(e, 'Origine', 'origin');
                          } else {
                            this.goTo(this.imp);
                            if (
                              this.SelectedArticleImp === null ||
                              this.SelectedArticleImp === undefined
                            ) {
                              this.champObligatoire(e, 'Imprimable', 'imp');
                            } else {
                              try {
                                setTimeout(() => {
                                  // document.getElementById(`btnvalider`).click();
                                  //   document.getElementById(`btnvalider`).focus();
                                }, 0);
                              } catch (e) {
                                console.log('erreur Create art');
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // ****   this.champObligatoire(e, this.SelectedArticlePrixUnHT, 'Prix Unit HT', 'prunit');
        }
      } else {
        // taiile code >20
        this.msgerror = 'ATTENTION! verifiez le code Max 20 caractères !!';
        this.op.show(e, document.getElementById('cod'));
      }
    }
  }

  async validerAjout(e) {
    this.wasInside = true;
    this.op.hide();

    if (
      this.SelectedArticleCode === null ||
      this.SelectedArticleCode === undefined ||
      this.SelectedArticleCode === ''
    ) {
      this.msgerror = 'ATTENTION! Code est obligatoire !!';
      this.op.show(e, document.getElementById('cod'));
    } else {
      if (this.SelectedArticleCode.length < 20) {
        let articles = new Array();
        await this.stockService
          .getStock(this.SelectedArticleCode)
          .toPromise()
          .then((data) => {
            console.log('article ', data);
            articles = data['_embedded'].stocks;
          })
          .catch((error) => {
            console.log('erreur chargement article ', error);
          })
          .finally(() => {
            console.log('fin du chargement d\'article ');
          });

        if (articles.length > 0) {
          this.msgerror = 'ATTENTION! Code déja existe, repetez la saisie !!';
          this.op.show(e, document.getElementById('cod'));
        } else {
          if (
            this.SelectedArticleTvaObj === null ||
            this.SelectedArticleTvaObj === undefined ||
            this.SelectedArticleTvaObj.deno === '' ||
            this.SelectedArticleTvaObj.deno === 'null'
          ) {
            this.champObligatoire(e, 'Taux TVA', 'tva');
          } else {
            if (
              this.SelectedArticleDesign === null ||
              this.SelectedArticleDesign === undefined ||
              this.SelectedArticleDesign === ''
            ) {
              this.champObligatoire(e, 'Désignation', 'des');
            } else {
              if (
                this.codeFamille === null ||
                this.codeFamille === undefined ||
                this.codeFamille === ''
              ) {
                this.champObligatoire(e, 'Famille', 'famil');
              } else {
                if (
                  this.codeSousFamille === null ||
                  this.codeSousFamille === undefined ||
                  this.codeSousFamille === ''
                ) {
                  this.champObligatoire(e, 'Sous Famille', 'sfamil');
                } else {
                  if (
                    this.codeFour === null ||
                    this.codeFour === undefined ||
                    this.codeFour === ''
                  ) {
                    this.champObligatoire(e, 'Fournisseur', 'four');
                  } else {
                    // tslint:disable-next-line:max-line-length
                    if (
                      this.SelectedArticlePrixUnHT === null ||
                      this.SelectedArticlePrixUnHT === undefined ||
                      this.SelectedArticlePrixUnHT === ''
                    ) {
                      this.champObligatoire(e, 'Prix Unit HT', 'prunit');
                    } else {
                      if (
                        this.SelectedArticleQteEntiere === null ||
                        this.SelectedArticleQteEntiere === undefined
                      ) {
                        this.champObligatoire(e, 'Qunatité entière', 'qteEnt');
                      } else {
                        // tslint:disable-next-line:max-line-length
                        if (
                          this.SelectedArticlePrACHDT === null ||
                          this.SelectedArticlePrACHDT === undefined ||
                          this.SelectedArticlePrACHDT === '' ||
                          Number(this.SelectedArticlePrACHDT) <= 0
                        ) {
                          this.champObligatoire(
                            e,
                            'Prix d\'achat en DT ',
                            'pad'
                          );
                        } else {
                          if (
                            this.SelectedArticleOrigine === null ||
                            this.SelectedArticleOrigine === undefined
                          ) {
                            this.champObligatoire(e, 'Origine', 'origin');
                          } else {
                            if (
                              this.SelectedArticleImp === null ||
                              this.SelectedArticleImp === undefined
                            ) {
                              this.champObligatoire(e, 'Imprimable', 'imp');
                            } else {
                              try {
                              } catch (e) {
                                console.log('erreur Create art');
                              }
                              const article = new Stock();
                              article.id = null;
                              article.code = this.SelectedArticleCode;
                              article.prix = this.SelectedArticlePrixUnHT;
                              if (
                                this.SelectedArticlePrACHDT === null ||
                                this.SelectedArticlePrACHDT === undefined
                              ) {
                                this.SelectedArticlePrACHDT = '0';
                              }
                              article.achat = this.SelectedArticlePrACHDT;
                              article.agenda = this.SelectedArticleAgenda;
                              article.design = this.SelectedArticleDesign;
                              article.tva = this.SelectedArticleTva;
                              article.origine = this.codeOrigine;
                              article.famille = this.codeFamille;
                              article.sfamille = this.codeSousFamille;
                              article.operateur = this.codeFour;
                              article.imp = this.codeImp;
                              article.min = null;
                              article.max = null;
                              if (
                                this.SelectedArticleDPachat === null ||
                                this.SelectedArticleDPachat === undefined
                              ) {
                                this.SelectedArticleDPachat = '0';
                              }
                              article.dPachat = this.SelectedArticleDPachat;
                              article.emplacement =
                                this.SelectedArticleEmplacement;
                              article.achatD = this.dateAch;

                              article.achatP = '0';
                              article.qtEnt = this.codeQteEntiere;
                              article.marge = this.SelectedArticleMarge;
                              article.ca = null;
                              article.nbrCl = null;
                              article.qInv = null;
                              article.nbrC = null;
                              article.nbrBl = null;
                              article.pInv = null;
                              article.taxe = null;
                              article.profilCa = null;
                              article.profilTyp = null;
                              article.qtTotal1 = null;
                              article.qtTotal = null;
                              article.devise = null;
                              article.quantite = '0';
                              article.commQuant = null;
                              article.equiv = null;
                              article.nbrC = null;
                              article.qteTotal1 = null;
                              this.blockedDocument = true;
                              await this.stockService
                                .createStock(article)
                                .toPromise()
                                .then((data) => {
                                  console.log('creation article ...... ', data);
                                  this.listeArticles.push(data);
                                  if (data !== null) {
                                  }
                                });
                              /* this.searchWord = null;
                                      this.search('');*/
                              this.blockedDocument = false;
                              this.readonly = false;
                              await this.loginService
                                .procedureStockeModule(
                                  localStorage.getItem('login'),
                                  globals.selectedMenu,
                                  ' Ajout ' + article.code
                                )
                                .toPromise()
                                .then((data) => {
                                  console.log(data);
                                });

                              await this.initChamps();
                              // article = null;
                              this.affichDetails = false;
                              this.validAjout = false;
                              this.readOnlyref = false;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          // ****   this.champObligatoire(e, this.SelectedArticlePrixUnHT, 'Prix Unit HT', 'prunit');
        }
      } else {
        // taiile code >20
        this.msgerror = 'ATTENTION! verifiez le code Max 20 caractères !!';
        this.op.show(e, document.getElementById('cod'));
      }
    }
  }
}
