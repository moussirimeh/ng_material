import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { Stock } from '../services/stock';
import { SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';
import { SearchSettingsModel } from '@syncfusion/ej2-grids';
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
  selector: 'app-consultation-ref',
  templateUrl: './consultation-ref.component.html',
  styleUrls: ['./consultation-ref.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    FilterService,
    SortService,
    ColumnMenuService,
    GroupService,
    PageService,
  ],
})
export class ConsultationRefComponent implements OnInit {
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
  @ViewChild('grid')
  public grid: GridComponent;
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
  selectedEquiv;
  num: String;
  items: any[];
  btn = false;
  prixbtn = false;
  exsit: any;
  drPrixAchat = '';
  prixAchat = '';
  prixAchatPond = '';
  qteCmdFrs = '';
  arvPrvLe = '';
  qteCmdClt = '';
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

  async ngOnInit() {
    await this.reloadData();
    this.customAttributes = { class: 'customcss' };
    this.customAttributesStable = { class: 'customcssStable' };
    this.mouvesClickek = true;
    this.VoirTotaux = false;
    this.contRechercher = '';
    this.refRechercher = '';
    this.desRechercher = '';
  }

  rowSelected() {
    this.readonlynom = true;
    this.readonly = true;
    // this.ajouterClicked = true;
    this.modifierClicked = false;
    this.supprimerClicked = false;
    this.annulerShow = false;
    this.modifierShow = true;

    this.mouvesClickek = true;
    this.mouves1Clickek = false;
    this.mouves2Clickek = false;

    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.valide = true;
      const selected: any = this.grid.getSelectedRecords()[0];
      this.selectedstock = selected;
    }
  }
  async afficher() {
    if (this.grid.getSelectedRecords().length > 0) {
      this.selectedstock = this.grid.getSelectedRecords()[0];
      this.selectedstock.min = Number(this.selectedstock.min).toFixed(0);
      this.selectedstock.max = Number(this.selectedstock.max).toFixed(0);
      this.VoirTotaux = false;
      this.equivalences = [];
      this.res1 = new Array();
      this.ttc = (
        parseFloat(this.selectedstock.prix) +
        (parseFloat(this.selectedstock.prix) *
          parseFloat(this.selectedstock.tva)) /
          100
      ).toFixed(3);
      if (String(this.selectedstock.achatP) !== 'null') {
        this.prixAchat = parseFloat(this.selectedstock.achatP).toFixed(3);
        if (this.selectedstock.devise !== 'DT') {
          this.drPrixAchat = parseFloat(this.selectedstock.achatP).toFixed(3);
        } else if (String(this.selectedstock.achatP) === 'null') {
          this.drPrixAchat = '';
        } else {
          this.drPrixAchat = parseFloat(this.selectedstock.achatP).toFixed(3);
        }
      } else {
        this.drPrixAchat = '';
      }
      if (String(this.selectedstock.achat) !== 'null') {
        this.prixAchatPond = parseFloat(this.selectedstock.achat).toFixed(3);
      } else {
        this.prixAchatPond = '';
      }
      this.selectedstockindex = this.grid.getSelectedRowIndexes()[0];
      // rechercher fournisseur
      await this.fournisseurService
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
      // rechercher qte comm
      await this.stockService
        .getQteComm(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.qteCmdFrs = Number(data[0][0]).toFixed(0);
          if (String(data[0][1]) !== 'null') {
            this.arvPrvLe =
              String(data[0][1]).substr(8, 2) +
              '/' +
              String(data[0][1]).substr(5, 2) +
              '/' +
              String(data[0][1]).substr(0, 4);
          }
          this.qteCmdClt = Number(data[0][2]).toFixed(0);
        });
      // rechercher mouve
      await this.mouveService
        .getMouveByCodeForConsultationRef(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.mouves = data['_embedded'].mouvementDuStocks;
          console.log('listemouve', this.mouves);
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
      await this.marqueService
        .getMarquesByCodeArticle(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.marques = data['_embedded'].marques;
        });

      if (this.selectedstock.equiv != null) {
        await this.stockService
          .getStockByEquiv(this.selectedstock.equiv)
          .toPromise()
          .then((data) => {
            this.res1 = data['_embedded'].stocks;
          });
        /*
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
        }*/
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
      ];
    }
    this.detail = true;
    this.ajouterClicked = true;
    this.mouvesClickek = true;
    this.VoirTotaux = false;
  }
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
  }

  async reloadData() {
    let stocksTemp = [];
    await this.stockService
      .getStockList('')
      .toPromise()
      .then((data) => {
        stocksTemp = data['_embedded'].stocks;
        for (const stk of stocksTemp) {
          if (String(stk.equiv) !== 'null' && String(stk.equiv) !== '0') {
            stk.equivalence = 'Voir Equiv !';
          }
          if (String(stk.marge) === '0.0' || String(stk.marge) === 'null') {
            stk.marge = '';
          } else {
            stk.marge = 'STABLE!';
          }
          if (String(stk.taxe) === '0.0' || String(stk.taxe) === 'null') {
            stk.taxe = '';
          } else {
            stk.taxe = 'Mort!';
          }
        }
      });
    this.stocks = stocksTemp;
    if ((this.selectedstock.code = '')) {
      this.valide = true;
    }
  }
  afficherTot() {
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
    let tableMouve = [];
    if (this.mouvesClickek) {
      tableMouve = this.mouves;
    }
    if (this.mouves1Clickek) {
      tableMouve = this.mouves1;
    }
    if (this.mouves2Clickek) {
      tableMouve = this.mouves2;
    }
    for (this.tab of tableMouve) {
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
    /*
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
    }*/
  }
  changer(v1: string, v2: string) {
    v1 = '';
    v2 = '';
  }
  Onkey(filterValue: string) {
    this.refRechercher = filterValue;
    this.desRechercher = '';
    this.contRechercher = '';
  }
  Onkey1(filterValue: string) {
    this.desRechercher = filterValue;
    this.refRechercher = '';
    this.contRechercher = '';
  }
  Onkey2(filterValue: string) {
    this.contRechercher = filterValue;
    this.desRechercher = '';
    this.refRechercher = '';
  }
  async applyFilterArtParCode(filterValue: string) {
    this.ajouterClicked = false;
    this.refRechercher = filterValue;
    let stocksTemp = [];
    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then((data) => {
        stocksTemp = data['_embedded'].stocks;
        console.log(stocksTemp);
        for (const stk of stocksTemp) {
          if (String(stk.equiv) !== 'null' && String(stk.equiv) !== '0') {
            stk.equivalence = 'Voir Equiv !';
          }
          if (String(stk.marge) === '0.0' || String(stk.marge) === 'null') {
            stk.marge = '';
          } else {
            stk.marge = 'STABLE!';
          }
          if (String(stk.taxe) === '0.0' || String(stk.taxe) === 'null') {
            stk.taxe = '';
          } else {
            stk.taxe = 'Mort!';
          }
        }
      });
    this.stocks = stocksTemp;
    this.modifierShow = false;
  }
  async contCarParDes(filterValue: string) {
    this.ajouterClicked = false;
    this.contRechercher = filterValue;
    let stocksTemp = [];
    await this.stockService
      .containsdes(filterValue)
      .toPromise()
      .then((data) => {
        stocksTemp = data['_embedded'].stocks;
        for (const stk of stocksTemp) {
          if (String(stk.equiv) !== 'null' && String(stk.equiv) !== '0') {
            stk.equivalence = 'Voir Equiv !';
          }
          if (String(stk.marge) === '0.0' || String(stk.marge) === 'null') {
            stk.marge = '';
          } else {
            stk.marge = 'STABLE!';
          }
          if (String(stk.taxe) === '0.0' || String(stk.taxe) === 'null') {
            stk.taxe = '';
          } else {
            stk.taxe = 'Mort!';
          }
        }
      });
    this.stocks = stocksTemp;
    this.modifierShow = false;
  }
  async applyFilterArtParDes(filterValue: string) {
    this.ajouterClicked = false;
    this.desRechercher = filterValue;
    this.refRechercher = '';
    this.contRechercher = '';
    let stocksTemp = [];
    await this.stockService
      .getStockByDes(filterValue)
      .toPromise()
      .then((data) => {
        stocksTemp = data['_embedded'].stocks;
        for (const stk of stocksTemp) {
          if (String(stk.equiv) !== 'null' && String(stk.equiv) !== '0') {
            stk.equivalence = 'Voir Equiv !';
          }
          if (String(stk.marge) === '0.0' || String(stk.marge) === 'null') {
            stk.marge = '';
          } else {
            stk.marge = 'STABLE!';
          }
          if (String(stk.taxe) === '0.0' || String(stk.taxe) === 'null') {
            stk.taxe = '';
          } else {
            stk.taxe = 'Mort!';
          }
        }
      });
    this.stocks = stocksTemp;
    this.modifierShow = false;
  }
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

  ajouterArt(): void {
    this.des = false;
    this.ref = true;
    for (this.tab_equiv of this.stocks) {
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
    }
  }
}
