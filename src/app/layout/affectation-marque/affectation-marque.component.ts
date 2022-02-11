import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { Stock } from '../services/stock';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SearchSettingsModel, RowSelectEventArgs } from '@syncfusion/ej2-grids';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { StockService } from '../services/stock.service';
import { FournisseurService } from '../services/fournisseur.service';
import { FamilleService } from '../services/famille.service';
import { Fournisseur } from '../services/fournisseur';
import { Famille } from '../services/famille';
import { SfamilleService } from '../services/sfamille.service';
import { Sfamille } from '../services/sfamille';
import { MouveService } from '../services/mouve.service';
import { Mouve } from '../services/mouve';
import { Mouve1 } from '../services/mouve1';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2 } from '../services/mouve2';
import { Mouve2Service } from '../services/mouve2.service';
import { StkMRQ } from '../services/stkMRQ';
import { StkMRQService } from '../services/stkMRQ.service';
import { MarqueService } from '../services/marque.service';
import { Marque } from '../services/marque';
import { EquivalenceService } from '../services/equivalence.service';
import { Equivalence } from '../services/equivalence';
import {
  GroupSettingsModel,
  FilterSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import {
  SortService,
  GroupService,
  ColumnMenuService,
  PageService,
  FilterService,
} from '@syncfusion/ej2-angular-grids';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { Client } from '../services/client';
import { OverlayPanel } from 'primeng/primeng';
setCulture('fr-FR');
L10n.load({
  'fr-FR': {
    grid: {
      EmptyRecord: ' ',
      EmptyDataSourceError: ' ',
    },
  },
});
@Component({
  selector: 'app-affectation-marque',
  templateUrl: './affectation-marque.component.html',
  styleUrls: ['./affectation-marque.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    FilterService,
    SortService,
    ColumnMenuService,
    GroupService,
    PageService,
  ],
})
export class AffectationMarqueComponent implements OnInit {
  constructor(
    private stockService: StockService,
    private mouveService: MouveService,
    private fournisseurService: FournisseurService,
    private sfamilleService: SfamilleService,
    private familleService: FamilleService,
    private mouve1Service: Mouve1Service,
    private mouve2Service: Mouve2Service,
    private stkmrqService: StkMRQService,
    private marqueService: MarqueService,
    private equivalenceService: EquivalenceService
  ) {}
  public groupOptions: GroupSettingsModel;
  public filterSettings: FilterSettingsModel;
  public customAttributes: Object;
  public customAttributesStable: Object;
  public totaux: Object;
  result: boolean;
  ref = true;
  des = false;
  detail = false;
  marque_nom = '';
  public selectionOptions: SelectionSettingsModel;
  cols: any[];
  stocks1: Stock[];
  stocks2: Stock[];
  stocks3: Stock[];
  stocks4: Stock[];
  stocks5: Stock[];
  stocks: Stock[];
  refRechercher = '';
  desRechercher = '';
  contRechercher = '';
  clickedmouv = false;
  invent: number;
  mouv1: any;
  reserv: number;
  achat: number;
  av_f: number;
  av_b_l: number;
  b_l: number;
  av_cpt: number;
  fre_cpt: number;
  reg_plus: number;
  reg_moin: number;
  entreesom: number;
  sortiesom: number;
  stocksequiv: Stock[];
  res1 = [];
  valide = false;
  equivalence = '';
  clients: Client[];
  ttc = '';
  fournisseur: Fournisseur[];
  fournisseurs: Fournisseur = {
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
  };
  familles: Famille = {
    id: '',
    code: '',
    nom: '',
  };
  sfamilles: Sfamille = {
    id: '',
    code: '',
    nom: '',
  };
  stkmrq: StkMRQ = {
    id: '',
    code: '',
    marque: '',
  };
  mouves2: Mouve2[];
  mouves1: Mouve1[];
  mouves: Mouve[];
  marques: Marque = {
    id: '',
    code: '',
    nom: '',
  };
  marques1: Marque[];
  equivalences = [];
  /*: Equivalence = {
    id: '',
    code: '',
    code1: '',
    code2: '',
    code3: '',
    code4: '',
    code5: '',
  };*/

  @ViewChild('ov')
  public ov: OverlayPanel;
  msgs = '';
  wasInside: boolean;
  styleOvPanelError = {
    'text-align': 'center',
    'font-size': '14px',
    'background-color': ' #f8b7bd',
  };
  styleOvPanelSuccess = {
    'text-align': 'center',
    'font-size': '12px',
    'background-color': ' #b7d8b7',
  };
  styleOvPanel = {};

  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridMarque')
  public gridMarque: GridComponent;
  @ViewChild('gridSelctionnee')
  public gridSelctionnee: GridComponent;
  @ViewChild('gridEquiv')
  public gridEquiv: GridComponent;
  @ViewChild('div_grid')
  public divGrid: ElementRef;
  /*refRechercher: any;
  desRechercher: any;
  contRechercher: any;*/
  selectedIndexStock = 0;
  public searchOptions: SearchSettingsModel;
  readonly = true;
  mouveg = false;
  test = false;
  tab1 = null;
  readonlynom = true;
  ajouterShow = true;
  modifierShow = true;
  supprimerShow = true;
  annulerShow = false;
  ajouterClicked = false;
  modifierClicked = false;
  supprimerClicked = false;
  reference = null;
  designation = null;
  prix = null;
  stock = null;
  denomination: '';
  totclicked = false;
  VoirTotaux = false;
  clikcked = false;
  excelShow: boolean;
  buttonShow: boolean;
  detailarticle: Fournisseur;
  selectedIndex = null;
  fieldDisable = true;
  stmrk_code = '';
  tab_equiv: any;
  tab = null;
  item = null;
  identif = false;
  mouvesClickek = true;
  mouves1Clickek = false;
  mouves2Clickek = false;
  selectedstock: any = { ref: '', desg: '', prix: '', stock: '' };
  selectedstockindex: any = { ref: '', desg: '', prix: '', stock: '' };
  selectedstkmrq: any = { code: '', nom: '' };
  selectedstkmrq2: any = { id: '', code: '', nom: '' };
  selectedEquiv;
  num: String;
  items: any[];
  btn = false;
  prixbtn = false;
  exsit: any;
  drPrixAchat = '';
  prixAchat = '';
  prixAchatPond = '';
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }

  async ngOnInit() {
    await this.reloadData();
    this.customAttributes = { class: 'customcss' };
    this.customAttributesStable = { class: 'customcssStable' };
    this.mouvesClickek = true;
    this.VoirTotaux = false;
    this.contRechercher = '';
    this.refRechercher = '';
    this.desRechercher = '';
    await this.loadData();
  }

  async rowSelected(e) {
    this.readonlynom = true;
    this.readonly = true;
    // this.ajouterClicked = true;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.annulerShow = false;
    this.modifierShow = true;
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.valide = true;
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedstock = selected;

      await this.ajouterArt();
    }
  }

  async Doubleclick(e) {
    let marqueExist;
    // const stkMrq: StkMRQ = this.gridSelctionnee.getSelectedRecords()[0];
    await this.stkmrqService
      .existsByCodeAndMarque(this.selectedstock.code, this.selectedstkmrq.code)
      .toPromise()
      .then((value) => {
        marqueExist = value;
      });
    if (marqueExist === false) {
      const stkMrq: StkMRQ = {
        id: '',
        code: '',
        marque: '',
      };
      stkMrq.id = null;
      stkMrq.code = this.selectedstock.code;
      stkMrq.marque = this.selectedstkmrq.code;
      this.stkmrqService
        .createStkMRK(stkMrq)
        .toPromise()
        .then(async (data) => {
          // this.marques1 = new Array();
          await this.ajouterArt();
        });
    } else {
      this.msgs = 'Référence en double';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e);
    }
  }

  async DoubleclickK(e) {
    await this.stkmrqService
      .deleteStkMRK(this.selectedstkmrq2.id)
      .toPromise()
      .then(
        async (data) => {
          console.log('delete success');
          // this.marques1 = new Array();
          await this.ajouterArt();
        },
        (error) => console.log('There was an error: ', error)
      );
  }

  rowSelected1(args: RowSelectEventArgs) {
    if (this.gridMarque.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridMarque.getSelectedRecords()[0];
      this.selectedstkmrq = selected;
      // this.selectedstkmrq.code = this.selectedstock.code;
    }
  }

  rowSelected2(args: RowSelectEventArgs) {
    if (this.gridSelctionnee.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridSelctionnee.getSelectedRecords()[0];
      this.selectedstkmrq2 = selected;
    }
  }

  async loadData() {
    await this.marqueService
      .getMarquesList()
      .toPromise()
      .then((data) => {
        this.marques = data['_embedded'].marques;
      });
  }
  /*
  async loadData2() {
   await this.stkmrqService.getStkMRQByCode
      .toPromise()
      .then((data) => {
        this.marques = data['_embedded'].marques;
      });
  }*/
  async afficher() {
    if (this.grid.getSelectedRecords().length > 0) {
      this.selectedstock = this.grid.getSelectedRecords()[0];
      this.VoirTotaux = false;
      this.equivalences = [];
      this.res1 = new Array();
      this.ttc = (
        parseFloat(this.selectedstock.prix) +
        (parseFloat(this.selectedstock.prix) *
          parseFloat(this.selectedstock.tva)) /
          100
      ).toFixed(3);
      this.drPrixAchat = parseFloat(this.selectedstock.achatP).toFixed(3);
      this.prixAchat = parseFloat(this.selectedstock.achatP).toFixed(3);
      this.prixAchatPond = parseFloat(this.selectedstock.achat).toFixed(3);

      this.selectedstockindex = this.grid.getSelectedRowIndexes()[0];
      // rechercher fournisseur
      /*await this.fournisseurService
        .FourByCode(this.selectedstock.operateur)
        .toPromise()
        .then((data) => {
          if (data['_embedded'].fournisseurs.length > 0) {
            this.fournisseurs = data['_embedded'].fournisseurs[0];
          } else {
            this.fournisseurs = {
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
            };
          }
        });
      // rechercher  famille
      await this.familleService
        .FamByCode(this.selectedstock.famille)
        .toPromise()
        .then((data) => {
          if (data['_embedded'].familles.length > 0) {
            this.familles = data['_embedded'].familles[0];
          } else {
            this.familles = {
              id: '',
              code: '',
              nom: '',
            };
          }
        });
      // rechercher sfamille
      await this.sfamilleService
        .getSfamilleByCode(this.selectedstock.sfamille)
        .toPromise()
        .then((data) => {
          if (data['_embedded'].sfamilles.length > 0) {
            this.sfamilles = data['_embedded'].sfamilles[0];
          } else {
            this.sfamilles = {
              id: '',
              code: '',
              nom: '',
            };
          }
        });
      // rechercher mouve
      await this.mouveService
        .getMouveByCodeForConsultationRef(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.mouves = data['_embedded'].mouvementDuStocks;
        });
      // afficher les mouve1
      this.mouves1 = [];
      await this.mouve1Service
        .getMouve1ByCodeForConsultationRef(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.mouves1 = data['_embedded'].mouvementDuStocks;
        });
      // afficher les mouve2
      this.mouves2 = [];
      await this.mouve2Service
        .getMouve2ByCodeForConsultationRef(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.mouves2 = data['_embedded'].mouvementDuStocks;
        });
      let marqueExist;
      await this.stkmrqService
        .existsByCode(this.selectedstock.code)
        .toPromise()
        .then((value) => {
          marqueExist = value;
        });
      if (marqueExist === true) {
        await this.stkmrqService
          .getStkMrqByCode(this.selectedstock.code)
          .toPromise()
          .then((data) => {
            this.stkmrq = data['_embedded'].StkMRQ;
            this.stmrk_code = this.stkmrq[0].marque;
          });
        await this.marqueService
          .getMrqByCode(this.stmrk_code)
          .toPromise()
          .then((data) => {
            this.marques = data['_embedded'].marques;
          });
      }
      if (this.selectedstock.equiv != null) {
        await this.equivalenceService
          .getEquivalence(this.selectedstock.equiv)
          .toPromise()
          .then((data) => {
            this.equivalences = data['_embedded'].equivalences;
          });
        if (this.equivalences.length > 0) {
          if (this.equivalences[0].code1 !== '') {
            await this.stockService
              .getStockByCode(this.equivalences[0].code1)
              .toPromise()
              .then((data) => {
                this.stocks1 = data['_embedded'].stocks[0];
                if (String(this.stocks1) !== 'undefined') {
                  this.res1.push(this.stocks1);
                }
              });
          }
          if (this.equivalences[0].code2 !== '') {
            await this.stockService
              .getStockByCode(this.equivalences[0].code2)
              .toPromise()
              .then((data) => {
                this.stocks1 = data['_embedded'].stocks[0];
                if (String(this.stocks1) !== 'undefined') {
                  this.res1.push(this.stocks1);
                }
              });
          }
          if (this.equivalences[0].code3 !== '') {
            await this.stockService
              .getStockByCode(this.equivalences[0].code3)
              .toPromise()
              .then((data) => {
                this.stocks1 = data['_embedded'].stocks[0];
                if (String(this.stocks1) !== 'undefined') {
                  this.res1.push(this.stocks1);
                }
              });
          }
          if (this.equivalences[0].code4 !== '') {
            await this.stockService
              .getStockByCode(this.equivalences[0].code4)
              .toPromise()
              .then((data) => {
                this.stocks1 = data['_embedded'].stocks[0];
                if (String(this.stocks1) !== 'undefined') {
                  this.res1.push(this.stocks1);
                }
              });
          }
          if (this.equivalences[0].code5 !== '') {
            await this.stockService
              .getStockByCode(this.equivalences[0].code5)
              .toPromise()
              .then((data) => {
                this.stocks1 = data['_embedded'].stocks[0];
                if (String(this.stocks1) !== 'undefined') {
                  this.res1.push(this.stocks1);
                }
              });
          }
        }
      }
      this.items = [
        {
          header: 'Mvmt année courante',
          datasource: this.mouves,
          headers: [
            { field: 'date', text: 'date', width: '50', textAlign: 'Left' },
            {
              field: 'document',
              text: 'document',
              width: '65',
              textAlign: 'Left',
            },
            {
              field: 'deno',
              text: 'dénomination',
              width: '110',
              textAlign: 'Left',
            },
            { field: 'prix', text: 'prix', width: '45', textAlign: 'Right' },
            {
              field: 'entree',
              text: 'entree',
              width: '40',
              textAlign: 'Right',
            },
            {
              field: 'sortie',
              text: 'sortie',
              width: '40',
              textAlign: 'Right',
            },
          ],
        },
        {
          header: 'Mvmt année -1',
          datasource: this.mouves1,
          headers: [
            { field: 'date', text: 'date', width: '50', textAlign: 'Left' },
            {
              field: 'document',
              text: 'document',
              width: '65',
              textAlign: 'Left',
            },
            {
              field: 'deno',
              text: 'dénomination',
              width: '110',
              textAlign: 'Left',
            },
            { field: 'prix', text: 'prix', width: '45', textAlign: 'Right' },
            {
              field: 'entree',
              text: 'entree',
              width: '40',
              textAlign: 'Right',
            },
            {
              field: 'sortie',
              text: 'sortie',
              width: '40',
              textAlign: 'Right',
            },
          ],
        },
        {
          header: 'Mvmt année -2',
          datasource: this.mouves2,
          headers: [
            { field: 'date', text: 'date', width: '50', textAlign: 'Left' },
            {
              field: 'document',
              text: 'document',
              width: '65',
              textAlign: 'Left',
            },
            {
              field: 'deno',
              text: 'dénomination',
              width: '110',
              textAlign: 'Left',
            },
            { field: 'prix', text: 'prix', width: '45', textAlign: 'Right' },
            {
              field: 'entree',
              text: 'entree',
              width: '40',
              textAlign: 'Right',
            },
            {
              field: 'sortie',
              text: 'sortie',
              width: '40',
              textAlign: 'Right',
            },
          ],
        },
        {
          header: 'Marque',
          datasource: this.marques,
          headers: [
            { field: 'nom', text: 'nom', width: '50', textAlign: 'Left' },
          ],
        },
        {
          header: 'Equivalences',
          datasource: this.res1,
          headers: [
            { field: 'code', text: 'code', width: '80', textAlign: 'Left' },
            {
              field: 'design',
              text: 'designation',
              width: '120',
              textAlign: 'Left',
            },
            { field: 'prix', text: 'prix', width: '50', textAlign: 'Right' },
            {
              field: 'quantite',
              text: 'quantite',
              width: '40',
              textAlign: 'Right',
            },
          ],
        },
      ];*/
    }
    this.detail = true;
    this.ajouterClicked = true;
    this.mouvesClickek = true;
    this.VoirTotaux = false;
  }
  /*
  handleChange(e) {
    const index = e.index;

    this.mouves2Clickek = false;
    this.mouves1Clickek = false;
    this.mouvesClickek = false;
    this.VoirTotaux = false;
    if (index === 0) {
      this.mouvesClickek = true;
    }
    if (index === 1) {
      this.mouves1Clickek = true;
    }
    if (index === 2) {
      this.mouves2Clickek = true;
    } else {
      this.VoirTotaux = false;
    }
  }*/

  async reloadData() {
    await this.stockService
      .getStockList('')
      .toPromise()
      .then((data) => {
        this.stocks = data['_embedded'].stocks;
        /*for (this.tab_equiv of this.stocks) {
          if (
            String(this.tab_equiv.equiv) !== 'null' &&
            String(this.tab_equiv.equiv) !== '0'
          ) {
            this.tab_equiv.equivalence = 'Voir Equiv !';
          }
          if (
            String(this.tab_equiv.taxe) === '0.0' ||
            String(this.tab_equiv.taxe) === 'null'
          ) {
          } else {
            this.tab_equiv.qteenstock = 'STABLE!';
          }
        }*/
      });
    if ((this.selectedstock.code = '')) {
      this.valide = true;
    }
  }
  /*
  async afficherTot() {
    this.VoirTotaux = true;
    this.invent = 0;
    this.reserv = 0;
    this.achat = 0;
    this.av_f = 0;
    this.av_b_l = 0;
    this.b_l = 0;
    this.av_cpt = 0;
    this.fre_cpt = 0;
    this.reg_plus = 0;
    this.reg_moin = 0;
    this.entreesom = 0;
    this.sortiesom = 0;

    if (this.mouvesClickek === true) {
      for (this.tab of this.mouves) {
        if (this.tab.document.substring(0, 6) === 'INVENT') {
          this.invent = this.invent + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 5) === 'ACHAT') {
          this.achat = this.achat + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 9) === 'AVOIR B/L') {
          this.av_b_l = this.av_b_l + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 6) === 'AVOIR ') {
          this.av_b_l = this.av_b_l + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 6) === 'AVOIRP') {
          this.av_cpt = this.av_cpt + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 4) === 'REGU') {
          this.reg_plus = this.reg_plus + Number(this.tab.entree);
        }
        this.entreesom =
          this.invent + this.achat + this.av_b_l + this.av_cpt + this.reg_plus;
        if (this.tab.document.substring(0, 7) === 'AVOIR/F') {
          this.av_f = this.av_f + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 6) === 'RESERV') {
          this.reserv = this.reserv + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 3) === 'B/L') {
          this.b_l = this.b_l + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 7) === 'FACTURE') {
          this.fre_cpt = this.fre_cpt + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 4) === 'REGU') {
          this.reg_moin = this.reg_moin + Number(this.tab.sortie);
        }
        this.sortiesom =
          this.reg_moin + this.fre_cpt + this.b_l + this.reserv + this.av_f;
      }
    }
    if (this.mouves1Clickek === true) {
      for (this.tab of this.mouves1) {
        if (this.tab.document.substring(0, 6) === 'INVENT') {
          this.invent = this.invent + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 5) === 'ACHAT') {
          this.achat = this.achat + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 9) === 'AVOIR B/L') {
          this.av_b_l = this.av_b_l + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 6) === 'AVOIR ') {
          this.av_b_l = this.av_b_l + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 6) === 'AVOIRP') {
          this.av_cpt = this.av_cpt + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 4) === 'REGU') {
          this.reg_plus = this.reg_plus + Number(this.tab.entree);
        }
        this.entreesom =
          this.invent + this.achat + this.av_b_l + this.av_cpt + this.reg_plus;
        if (this.tab.document.substring(0, 7) === 'AVOIR/F') {
          this.av_f = this.av_f + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 6) === 'RESERV') {
          this.reserv = this.reserv + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 3) === 'B/L') {
          this.b_l = this.b_l + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 7) === 'FACTURE') {
          this.fre_cpt = this.fre_cpt + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 4) === 'REGU') {
          this.reg_moin = this.reg_moin + Number(this.tab.sortie);
        }
        this.sortiesom =
          this.reg_moin + this.fre_cpt + this.b_l + this.reserv + this.av_f;
      }
    }
    if (this.mouves2Clickek === true) {
      for (this.tab of this.mouves2) {
        if (this.tab.document.substring(0, 6) === 'INVENT') {
          this.invent = this.invent + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 5) === 'ACHAT') {
          this.achat = this.achat + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 9) === 'AVOIR B/L') {
          this.av_b_l = this.av_b_l + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 6) === 'AVOIR ') {
          this.av_b_l = this.av_b_l + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 6) === 'AVOIRP') {
          this.av_cpt = this.av_cpt + Number(this.tab.entree);
        }
        if (this.tab.document.substring(0, 4) === 'REGU') {
          this.reg_plus = this.reg_plus + Number(this.tab.entree);
        }
        this.entreesom =
          this.invent + this.achat + this.av_b_l + this.av_cpt + this.reg_plus;
        if (this.tab.document.substring(0, 7) === 'AVOIR/F') {
          this.av_f = this.av_f + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 6) === 'RESERV') {
          this.reserv = this.reserv + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 3) === 'B/L') {
          this.b_l = this.b_l + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 7) === 'FACTURE') {
          this.fre_cpt = this.fre_cpt + Number(this.tab.sortie);
        }
        if (this.tab.document.substring(0, 4) === 'REGU') {
          this.reg_moin = this.reg_moin + Number(this.tab.sortie);
        }
        this.sortiesom =
          this.reg_moin + this.fre_cpt + this.b_l + this.reserv + this.av_f;
      }
    }
  }
  changer(v1: string, v2: string) {
    v1 = '';
    v2 = '';
  }*/
  Onkey(filterValue: string) {
    this.refRechercher = filterValue;
    this.desRechercher = '';
    this.contRechercher = '';
  } /*
  Onkey1(filterValue: string) {
    this.desRechercher = filterValue;
    this.refRechercher = '';
    this.contRechercher = '';
  }
  Onkey2(filterValue: string) {
    this.contRechercher = filterValue;
    this.desRechercher = '';
    this.refRechercher = '';
  }*/
  async applyFilterArtParCode(filterValue: string) {
    this.ajouterClicked = false;
    this.refRechercher = filterValue;

    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then((data) => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
        /*for (this.tab_equiv of this.stocks) {
          if (
            String(this.tab_equiv.equiv) !== 'null' &&
            String(this.tab_equiv.equiv) !== '0'
          ) {
            this.tab_equiv.equivalence = 'Voir Equiv !';
          }
          if (
            String(this.tab_equiv.taxe) === '0.0' ||
            String(this.tab_equiv.taxe) === 'null'
          ) {
          } else {
            this.tab_equiv.qteenstock = 'STABLE!';
          }
        }*/
      });
    this.modifierShow = false;
  }
  /*async contCarParDes(filterValue: string) {
    this.ajouterClicked = false;
    this.contRechercher = filterValue;

    await this.stockService
      .containsdes(filterValue)
      .toPromise()
      .then((data) => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
      });
    this.modifierShow = false;
  }
  async applyFilterArtParDes(filterValue: string) {
    this.ajouterClicked = false;
    this.desRechercher = filterValue;
    this.refRechercher = '';
    this.contRechercher = '';
    await this.stockService
      .getStockByDes(filterValue)
      .toPromise()
      .then((data) => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
      });
    this.modifierShow = false;
  }*/
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
    this.ajouterShow = true;
    this.modifierShow = false;
    this.supprimerShow = false;
    this.annulerShow = false;
    this.ajouterClicked = false;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.readonlynom = true;
    this.readonly = true;
    this.res1 = [];

    this.selectedstock = { code: '', design: '', prix: '', quantite: '' };
  }

  async ajouterArt(): Promise<void> {
    // let marqueExist;
    this.marques1 = new Array();

    /*await this.stkmrqService
        .existsByCode(this.selectedstock.code)
        .toPromise()
        .then((value) => {
          marqueExist = value;
          console.log('jjjjjjjjjjjjjjjj', marqueExist);
        });*/
      // if (marqueExist === true) {
        await this.stkmrqService
          .getStkMrqByCode(this.selectedstock.code)
          .toPromise()
          .then(async (data) => {
            // this.marques1 = data['_embedded'].StkMRQ;
            // this.marques1 = new Array();
            this.stkmrq = data['_embedded'].StkMRQ;

            for (const stkMrki of data['_embedded'].StkMRQ) {
              this.stmrk_code = stkMrki.marque;

              await this.marqueService
              .getMrqByCode(this.stmrk_code)
              .toPromise()
              .then((data) => {

                 data['_embedded'].marques[0].id = stkMrki.id;
                this.marques1.push( data['_embedded'].marques[0]);


              });
            }


           // this.stmrk_code = this.stkmrq[0].marque;
            // console.log('hhhhhhhhhhh', this.stkmrq[0].marque);
            // console.log('vvvvvvvvvvvvv', data['_embedded'].StkMRQ);
          });
      /*  await this.marqueService
          .getMrqByCode(this.stmrk_code)
          .toPromise()
          .then((data) => {
            this.marques1 = data['_embedded'].marques;
            console.log('fffffffff', data['_embedded'].marques);

          });*/
    // }
    this.gridSelctionnee.refresh();
  }
}
