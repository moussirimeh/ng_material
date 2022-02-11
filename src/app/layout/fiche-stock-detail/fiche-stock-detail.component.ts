import {
  ViewChild,
} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { SearchSettingsModel } from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { Stock } from '../services/stock';
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
import { MarqueService } from '../services/marque.service';
import { Marque } from '../services/marque';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2 } from '../services/mouve2';
import { Mouve2Service } from '../services/mouve2.service';
import { EquivalenceService } from '../services/equivalence.service';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { DatePipe } from '@angular/common';
import { EtatOffreEnvoyeComponent } from '../etat-offre-envoye/etat-offre-envoye.component';
import { Dialog } from 'primeng/primeng';
import { EtatCommandeClientComponent } from '../etat-commande-client/etat-commande-client.component';
import { CmdsFrsNonSoldeesComponent } from '../cmds-frs-non-soldees/cmds-frs-non-soldees.component';
import { globals } from 'src/environments/environment';
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
  selector: 'app-fiche-stock-detail',
  templateUrl: './fiche-stock-detail.component.html',
  styleUrls: ['./fiche-stock-detail.component.scss'],
  providers: [DatePipe],
})
export class FicheStockDetailComponent implements OnInit {
  @ViewChild(EtatOffreEnvoyeComponent) etatoffrenv ;
  @ViewChild(EtatCommandeClientComponent) etatcmdclt ;
  @ViewChild(CmdsFrsNonSoldeesComponent) cmdfrs ;
  @ViewChild('gridequiv')
  public gridequiv: GridComponent;
  public searchOptions: SearchSettingsModel;
  public customAttributes: Object;
  refRechercher: string;
  desRechercher: string;
  ref = true;
  label: string ;
  modifierShow = true;
  ajouterClicked = false;
  stocks: Stock[];
  stocks1: Stock[];
  stocks2: Stock[];
  stocks3: Stock[];
  stocks4: Stock[];
  stocks5: Stock[];
  tab_equiv: any;
  des: boolean;
  readonlynom: boolean;
  selectedstockindex: any = { ref: '', desg: '', prix: '', stock: '' };
  showConfirm = false;
  ttc = '';
  vl_stk_ach ;
  vl_stk_v = '';
  Marge0 = '';
  Marge15 = '';
  qteCmdFrs = '';
  readonly = true;
  modifierClicked: boolean;
  supprimerClicked: boolean;
  disableGrid = false ;
  annulerShow: boolean;
  detail = false ;
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
  mouves2: Mouve2[];
  mouves1: Mouve1[];
  mouves: Mouve[];
  mouvesClickek = true;
  mouves1Clickek = false;
  mouves2Clickek = false;
  equivalences = [];
  prixAchatPond = '';
  VoirTotaux = false ;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('grid1')
  public grid1: GridComponent;
  @ViewChild('grid2')
  public grid2: GridComponent;
  @ViewChild('grid3')
  public grid3: GridComponent;
  @ViewChild('grid4')
  public grid4: GridComponent;
  valide: boolean;
  selectedstock: any = {};
  drPrixAchat = '';
  prixAchat = '';
  items: { header: string; datasource: any; headers: { field: string; text: string; width: string; textAlign: string; }[]; }[];
  venteAucomptant: {date: string ; combine: string ; deno: string ; prix: string ; quantite: string ; };
  venteATerme: {date: string ; combine: string ; deno: string ; prix: string ; quantite: string ; };
  Achats: {date: string ; combine: string ; deno: string ; prix: string ; quantite: string ; };
  Ajustements: {date: string ; combine: string ; deno: string ; prix: string ; quantite: string ; };
  marques: any;
  res1: any;
  arvPrvLe: string;
  qteCmdClt: string;
  invent: number;
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
  tab = null;
  menu = false ;
  datas0 ;
  listInventaire = new Array();
  listVentesAuComptant = new Array();
  datas ;
  listVentesATerme = new Array();
  datas1;
  listAchats = new Array();
  datas2 ;
  listeAjustements = new Array();
  datas3;
  btnInventaire = false ;
  btnVenteAucomptant = false ;
  btnVenteAtemre = false ;
  btnAchat = false ;
  btnAjustement = false ;
  visible: boolean;
  visible1: boolean;
  visible2: boolean;
  constructor(
    private config: NgSelectConfig,
    private datePipe: DatePipe,
    private stockService: StockService,
    private mouveService: MouveService,
    private fournisseurService: FournisseurService,
    private sfamilleService: SfamilleService,
    private marqueService: MarqueService,
    private equivalenceService: EquivalenceService,
    private familleService: FamilleService,
    private mouve1Service: Mouve1Service,
    private mouve2Service: Mouve2Service,
    ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }

  async ngOnInit() {
    this.etatoffrenv.Formshowyes = false ;
    await this.reloadData();
    this.visible = false;
    this.customAttributes = { class: 'customcss' };
    this.mouvesClickek = true;
    this.VoirTotaux = false;
    this.refRechercher = '';
    this.desRechercher = '';
    if (globals.selectedMenu === 'Fiche de Stock') {

      this.menu = false;
    }
    if (globals.selectedMenu === 'Fiche de Stock Detailee') {
      this.menu = true;
    }


  }
  Onkey(filterValue: string) {
    this.refRechercher = filterValue;
    this.desRechercher = '';
  }
  Onkey2(filterValue: string) {
    this.desRechercher = filterValue;
    this.refRechercher = '';
  }
  async handleChange(e) {
    const index = e.index;
    console.log('indice', index);
    this.marques = new Array();
    this.mouves1 = new Array();
    this.mouves2 = new Array();
    this.mouves2Clickek = false;
    this.mouves1Clickek = false;
    this.mouvesClickek = false;
    this.VoirTotaux = false;
    if (index === 0) {
      this.mouvesClickek = true;
    }
    if (index === 1) {
      this.mouves1Clickek = true;
      this.mouves1 = [];
      await this.mouve1Service
        .getMouve1ByCodeForConsultationRef(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.mouves1 = data['_embedded'].mouvementDuStocks;
        });
    }
    if (index === 2) {
      this.mouves2Clickek = true;
      this.mouves2 = [];
      await this.mouve2Service
        .getMouve2ByCodeForConsultationRef(this.selectedstock.code)
        .toPromise()
        .then((data) => {
          this.mouves2 = data['_embedded'].mouvementDuStocks;
        });
    }
    if (index === 3) {
      await this.marqueService
          .getMarquesByCodeArticle(this.selectedstock.code)
          .toPromise()
          .then((data) => {
            this.marques = data['_embedded'].marques;
          });
    }
    if (index === 4) {
      console.log('res 1 ***** ' , this.res1);
      this.gridequiv.refresh();

    } else {
      this.VoirTotaux = false;
    }
  }
  async afficherAjustements() {
    this.btnAjustement = true ;
    this.listeAjustements = new Array();
    await this.mouveService.getAjustements(this.selectedstock.code).toPromise().then((data) => {
      this.datas3 = data ;
    });
    for ( let i = 0 ; i < this.datas3.length; i++) {
      this.Ajustements = {date: '', combine: '', deno: '' , prix : '' , quantite: ''};
      const obj = this.datas3[i];
      const dateformat: string = this.datePipe.transform(obj[0], 'dd/MM/yyyy');
      this.Ajustements.date = dateformat ;
      this.Ajustements.combine = obj[1];
      this.Ajustements.deno = obj[2];
      this.Ajustements.prix = Number(obj[3]).toFixed(3);
      this.Ajustements.quantite = String(Number(obj[4]));
      this.listeAjustements.push(this.Ajustements);
    }

    this.grid4.refresh();
    console.log('liste vente a terme ', this.listeAjustements);
  }
  async afficherVenteATerme() {
    this.btnVenteAtemre = true ;
    this.listVentesATerme = new Array();
    await this.mouveService
    .getVenteATerme(this.selectedstock.code)
    .toPromise()
    .then((data) => {
      this.datas1 = data ;
    });
    for ( let i = 0 ; i < this.datas1.length; i++) {
      this.venteATerme = {date: '', combine: '', deno: '' , prix : '' , quantite: ''};
      const obj = this.datas1[i];
      const dateformat: string = this.datePipe.transform(obj[0], 'dd/MM/yyyy');
      this.venteATerme.date = dateformat ;
      this.venteATerme.combine = obj[1];
      this.venteATerme.deno = obj[2];
      this.venteATerme.prix = Number(obj[3]).toFixed(3);
      this.venteATerme.quantite = String(Number(obj[4]));
      this.listVentesATerme.push(this.venteATerme);
    }
    this.grid2.refresh();
    console.log('liste vente a terme ', this.listVentesATerme);
  }
  async afficherVentesAuComptant() {
    this.btnVenteAucomptant = true ;
    this.listVentesAuComptant = new Array();
    await this.mouveService
    .getVentAuComptant(this.selectedstock.code)
    .toPromise()
    .then((data) => {
       this.datas = data;
    console.log('liste des mvts ', data );
    });

    console.log('dataaaaas ', this.datas);

    for (let i = 0 ; i < this.datas.length ; i++) {
      this.venteAucomptant = {date: '', combine: '', deno: '' , prix : '' , quantite: ''};
      const obj = this.datas[i];
      console.log('obj ', obj);
      const dateformat: string = this.datePipe.transform(obj[0], 'dd/MM/yyyy');
      this.venteAucomptant.date = dateformat ;
      this.venteAucomptant.combine = obj[1];
      this.venteAucomptant.deno = obj[2];
      this.venteAucomptant.prix = Number(obj[3]).toFixed(3);
      this.venteAucomptant.quantite = String(Number(obj[4]));
      this.listVentesAuComptant.push(this.venteAucomptant);
    }

    this.grid1.refresh();
      console.log('liste vente au comptant ', this.listVentesAuComptant);



  }
  async afficheAchats() {
    this.btnAchat = true ;
    this.listAchats = new Array();
    await this.mouveService
    .getAchats(this.selectedstock.code)
    .toPromise()
    .then((data) => {
       this.datas2 = data;
    });

    console.log('dataaaaas2 ', this.datas2);

    for (let i = 0 ; i < this.datas2.length ; i++) {
      this.Achats = {date: '', combine: '', deno: '' , prix : '' , quantite: ''};
      const obj = this.datas2[i];
      console.log('obj ', obj);
      const dateformat: string = this.datePipe.transform(obj[0], 'dd/MM/yyyy');
      this.Achats.date = dateformat ;
      this.Achats.combine = obj[1];
      this.Achats.deno = obj[2];
      this.Achats.prix = Number(obj[3]).toFixed(3);
      this.Achats.quantite = String(Number(obj[4]));
      this.listAchats.push(this.Achats);
    }

    this.grid3.refresh();
      console.log('liste Achats ', this.Achats);



  }
  async afficherInventaire() {
    this.btnInventaire = true ;
    await this.mouveService
    .getInventaireByCode(this.selectedstock.code)
    .toPromise()
    .then((data) => {
      this.listInventaire = data['_embedded'].mouves;
      for (let i = 0 ; i < this.listInventaire.length ; i++) {
        const qte = String(this.listInventaire[i].quantite).substring(0, String(this.listInventaire[i].quantite).indexOf('.'));
        this.listInventaire[i].quantite = qte ;
      }
      console.log('listestock', this.selectedstock.code);
      console.log('listeInventaires', this.listInventaire);

    });
  }
  async applyFilterArtParCode(filterValue: string) {
    this.ajouterClicked = false;
    this.refRechercher = filterValue;

    await this.stockService
      .getStockList(filterValue)
      .toPromise()
      .then((data) => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
        console.log('STOCK', this.stocks);

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
          if (String(this.tab_equiv.taxe) === '0.0' || String(this.tab_equiv.taxe) === 'null') {
            this.tab_equiv.taxe = '';
          } else {
            this.tab_equiv.taxe = 'Mort!';
          }
        }
      });
    this.modifierShow = false;
  }
  async applyFilterArtParDes(filterValue: string) {
    this.ajouterClicked = false;
    this.desRechercher = filterValue;
    this.refRechercher = '';
    await this.stockService
      .getStockByDes(filterValue)
      .toPromise()
      .then((data) => {
        const stocksTemp = data['_embedded'].stocks;
        this.stocks = stocksTemp;
      });
    this.modifierShow = false;
  }
  async reloadData() {
    await this.stockService
      .getStockList('')
      .toPromise()
      .then((data) => {
        this.stocks = data['_embedded'].stocks;
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
          if (String(this.tab_equiv.taxe) === '0.0' || String(this.tab_equiv.taxe) === 'null') {
            this.tab_equiv.taxe = '';
          } else {
            this.tab_equiv.taxe = 'Mort!';
          }
        }
      });
    if ((this.selectedstock.code = '')) {
      this.valide = true;
    }
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
      if (String(this.tab_equiv.taxe) === '0.0' || String(this.tab_equiv.taxe) === 'null') {
        this.tab_equiv.taxe = '';
      } else {
        this.tab_equiv.taxe = 'Mort!';
      }
    }

  }
  closeDialog() {
    this.btnInventaire = false ;
    this.btnVenteAucomptant = false ;
    this.btnVenteAtemre = false ;
    this.btnAchat = false ;
    this.btnAjustement = false ;
    this.listInventaire = new Array() ;
    this.listVentesAuComptant = new Array();
    this.listVentesATerme = new Array();
    this.listeAjustements = new Array();
    this.listAchats = new Array() ;
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
      console.log('stk****', this.selectedstock);

    }

  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
    this.ajouterClicked = false;
    this.modifierShow = false ;
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
  }
  showDialog() {
    this.showConfirm = true ;
  }
  async afficher() {

    if (this.grid.getSelectedRecords().length > 0) {
      this.selectedstock = this.grid.getSelectedRecords()[0];
      this.selectedstock.min = Number(this.selectedstock.min).toFixed(0);
      this.selectedstock.max = Number(this.selectedstock.max).toFixed(0);
      this.selectedstock.achatP = Number(this.selectedstock.achatP).toFixed(3);
      this.VoirTotaux = false;
      this.equivalences = [];
      this.res1 = new Array();
      this.ttc = Number(
        Number(this.selectedstock.prix) + (Number(this.selectedstock.prix) * Number(this.selectedstock.tva)) /  100 ).toFixed(3);
        let  vl_stk_achN = 0;
        if (this.selectedstock.achat !== null && this.selectedstock.achat !== undefined
                   &&  this.selectedstock.quantite !== undefined  &&  this.selectedstock.quantite !== null) {

                    vl_stk_achN = Number(this.selectedstock.achat) * Number(this.selectedstock.quantite);
        }
        this.vl_stk_ach = vl_stk_achN.toFixed(3);
        let vl_stk_vN = 0 ;
        if (this.selectedstock.prix !== null && this.selectedstock.prix !== undefined
          &&  this.selectedstock.quantite !== undefined  &&  this.selectedstock.quantite !== null) {

            vl_stk_vN = Number(this.selectedstock.prix) * Number(this.selectedstock.quantite);
        }
        this.vl_stk_v = vl_stk_vN.toFixed(3);
        let  Marge0N = 0 ;
        if (this.selectedstock.prix !== null && this.selectedstock.prix !== undefined
          &&  this.selectedstock.achat !== undefined  &&  this.selectedstock.achat !== null) {
           console.log('achat', Number(this.selectedstock.achat).toFixed(15));

            Marge0N = (Number(this.selectedstock.prix) - Number(this.selectedstock.achat)) / Number(this.selectedstock.achat) * 100;
        }
        let  Marge15N = 0 ;
        if (this.selectedstock.prix !== null && this.selectedstock.prix !== undefined
          &&  this.selectedstock.achat !== undefined  &&  this.selectedstock.achat !== null) {

            Marge15N = (Number(this.selectedstock.prix) * 0.85 - Number(this.selectedstock.achat)) / Number(this.selectedstock.achat) * 100;
        }
        if ( this.selectedstock.achat > 0 ) {
         this.Marge0 = Marge0N.toFixed(2);
         this.Marge15 = Marge15N.toFixed(2);
        } else {
        this.Marge0 = 'NON DEFINI' ;
        this.Marge15 = 'NON DEFINI' ;
      }

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
          } else { this.arvPrvLe = '' ; }
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
      if (this.selectedstock.equiv != null) {
        this.VoirTotaux = false;
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
            console.log('equiv *** ' , this.equivalences  );

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

  }
  console.log('res1  ', this.res1);

  this.detail = true;
  // this.disableGrid = true ;
  this.ajouterClicked = true;
  this.mouvesClickek = true;
  this.VoirTotaux = false;
  console.log('listestock', this.selectedstock);

  }
  nouvelsaisie() {
    this.modifierShow = true ;
    this.disableGrid = false ;
    this.detail = false ;
  }


  showDialogMaximized(dialog: Dialog) {
    setTimeout(() => {
      dialog.maximize();
    }, 0);
  }




  close() {}
  async etatOffreEnv() {
   console.log(this.selectedstock.code);
   this.etatoffrenv.op.hide();
   this.etatoffrenv.NouvelleListe();
    // localStorage.setItem('selectedMenu', 'Etat Offre Envoye');
    // console.log('local storage  ', globals.selectedMenu);
      this.etatoffrenv.SelectedArticles = this.selectedstock.code;
      this.etatoffrenv.codearticle = this.selectedstock.code;
      this.etatoffrenv.fromOutside = true ;
      this.visible = true;
      // this.etatoffrenv.btnaff = true ;

     await this.etatoffrenv.Afficher();
     this.etatoffrenv.btnfichstk = true ;
  }



  async etatCmdClt() {
    console.log(this.selectedstock.code);
     // localStorage.setItem('selectedMenu', 'Etat CMDs Client');
     // console.log('local storage  ', globals.selectedMenu);
     this.etatcmdclt.code_art = this.selectedstock.code ;
     this.etatcmdclt.selected_art = this.selectedstock.code ;
     this.etatcmdclt.selectedradiobtcmdQPES = '3' ;
     this.etatcmdclt.selectedradiobtart = '3' ;
      this.visible1 = true;
      this.etatcmdclt.datasourceGrid = new Array();
      this.etatcmdclt.datasourceGrid1 = new Array();
      this.etatcmdclt.datasourceGrid2 = new Array();
      await this.etatcmdclt.afficher();
      this.etatcmdclt.btninitialiser = true ;
      this.etatcmdclt.btnaff = true ;
      this.etatcmdclt.readonly = true ;
  }


  async cmdFrs() {
      this.cmdfrs.SelectedArticles = this.selectedstock.code ;
      this.cmdfrs.codearticle = this.selectedstock.code ;
      this.cmdfrs.SelectedArticles = this.selectedstock ;
      this.cmdfrs.typef = '';
      await this.cmdfrs.Afficher();
      this.cmdfrs.btnaff = true ;
      this.visible2 = true;
  }
}

