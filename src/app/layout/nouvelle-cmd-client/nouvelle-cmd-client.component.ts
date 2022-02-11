import { Input, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewChecked,
} from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  SearchSettingsModel,
  ToolbarService,
  ResizeService,
  NotifyArgs,
} from '@syncfusion/ej2-angular-grids';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ClientService } from '../services/client.service';
import { StockService } from '../services/stock.service';
import { OverlayPanel } from 'primeng/primeng';
import { MouveService } from '../services/mouve.service';
import { Mouve1Service } from '../services/mouve1.service';
import { Mouve2Service } from '../services/mouve2.service';
import { Vendeur1Service } from '../services/vendeur1.service';
import { EquivalenceService } from '../services/equivalence.service';
import { EditSettingsModel } from '@syncfusion/ej2-angular-grids';
import { EdevisService } from '../services/edevis.service';
import { DdevisService } from '../services/ddevis.service';
import { ScrollableView } from 'primeng/table';
import ResizeObserver from 'resize-observer-polyfill';
import { Table } from 'primeng/table';
import { EcomService } from '../services/ecom.service';
import { DcomService } from '../services/dcom.service';
import { BcomService } from '../services/bcom.service';
import { CommandeService } from '../services/commande.service';
import { SatisfactionService } from '../services/satisfaction.service';
import { LoginService } from 'src/app/login/login.service';
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
  selector: 'app-nouvelle-cmd-client',
  templateUrl: './nouvelle-cmd-client.component.html',
  styleUrls: ['./nouvelle-cmd-client.component.scss'],
  providers: [ToolbarService, ResizeService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})
export class NouvelleCmdClientComponent implements OnInit {
  focusRemise: boolean;
  prixTot: number;
  calculTotPrix = false;
  affichValider = true;
  codeCmd: any;
  sommettc: any;
  totBrut: any;
  remise: any;
  s_base0: any;
  s_base10: any;
  s_base18: any;
  s_base29: any;
  totTTC: number;
  s_Total1: number;
  s_remise: any;
  s_net: any;
  s_ht: any;
  flag_timbre = false;
  flag_exonor = false;
  s_Total1CH: string;
  s_remisech: string;
  tva13: number;
  tva13ch: string;
  tva19: number;
  tva19ch: string;
  tva7: number;
  tva7ch: string;
  s_netch: string;
  numCmd: any;
  qteEncours: any;
  selectedIndex = 0;
  constructor(
    private satisfactionService: SatisfactionService,
    private commandeService: CommandeService,
    private config: NgSelectConfig,
    private clientService: ClientService,
    private edevisService: EdevisService,
    private stockService: StockService,
    private vendeur1Service: Vendeur1Service,
    private mouveService: MouveService,
    private mouve1Service: Mouve1Service,
    private ddevisService: DdevisService,
    private confirmationService: ConfirmationService,
    private mouve2Service: Mouve2Service,
    private ecomService: EcomService,
    private dcomService: DcomService,
    private bcomService: BcomService,
    private loginService: LoginService,
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';
    this.dated = new Date();
  }

  readoonly = true;
  @ViewChild('dt')
  public table: Table;
  focusQte = true;

  public editSettings: EditSettingsModel;
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridOffres')
  public gridOffres: GridComponent;

  ajout = false;
  @ViewChild('gridstock')
  public gridstock: GridComponent;

  @ViewChild('gridDetailsOffre')
  public gridDetailsOffre: GridComponent;

  @ViewChild('gridcmd')
  public gridcmd: GridComponent;

  @ViewChild('op')
  public op: OverlayPanel;
  readonly: boolean;
  tn;
  m;
  editrow = false;
  readonly1: boolean;
  dated: Date;
  adresse;
  codeTva;
  ville;
  numDev;
  codeOffre;
  detailsOffre = new Array();
  etab_cmd: boolean;

  wasInside: boolean;
  refCmd: string;
  clients = [];
  selectedClient;
  codeClient: any;
  vendeurs: any;
  selectedVendeur: any;
  codeVendeur: any;
  listeOffres = new Array();
  afficherOffres: boolean;
  refArticle = '';
  listeStocks: any[];
  selectedArticle: any;
  mvtAnnCournte: any;
  afficherMvsArticlegrid: boolean;
  afficherlisteStockgrid: boolean;
  readonlyrech: boolean;
  equivalences: any;
  listeStockCMD = new Array();
  selectedStock = new Array();
  disable: boolean;
  msg: string;
  afficherNum_dev: boolean;

  public searchOptions: SearchSettingsModel;
  searchDetails: SearchSettingsModel;
  listesOffresload = new Array();
  selectedOff: any;
  selectedDetailsOffr: any;
  newArt: {
    id: any;
    prix: any;
    code: any;
    design: any;
    quantite: any;
    quantiteInitial: any;
    qte: any;
    marge: any;
    margeInitial: any;
    tva: any;
    prixtot: any;
    numdev: any;
  };
  articleStck: any;
  v_marge: any;
  blockedDocument;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Set the new row in edit mode
    if (this.listeStockCMD.length > 3 && this.ajout === true) {
      this.table.handleVirtualScroll('click');
      event.preventDefault();
    }
  }

  onRowEditCancel(rowData, ri) {
    this.ajout = false;
    // rowData = this.selectedArticle;
  }

  async mouveToNext(id) {
    if (id !== null) {
      setTimeout(() => {
        document.getElementById(id).click();
        document.getElementById(id).focus();
    }, 0);

     // await document.getElementById(id).focus();
    }
  }

  async onRowEditSave(rowData, e) {
    this.op.hide();
    this.wasInside = false;
    const art = rowData;

    this.table.initRowEdit(rowData);
    this.calculTotPrix = false;
    const idQte = `row_${rowData.id}_inputQte`;
    if (idQte !== null && idQte !== undefined) {
      document.getElementById(`row_${rowData.id}_inputQte`).focus();
    }
  }

  async onRowEditInit(rowData, e) {

    let i = 0;
    while ( i < this.listeStockCMD.length ) {
         if ( this.listeStockCMD[i].id !== rowData.id ) {
          this.verifQuantite(rowData, e);
          this.table.cancelRowEdit(this.listeStockCMD[i]);

         } else {
          this.disable = true;
          this.table.initRowEdit(rowData);

         }

        i++;
    }
    this.calculTotPrix = false;
    const idQte = `row_${rowData.id}_inputQte`;
    this.op.hide();
    if (rowData !== null && rowData !== undefined) {
      this.refArticle = rowData.code;
      await this.stockService
        .getStock(this.refArticle)
        .toPromise()
        .then((data) => {
          console.log('liste stock ', data);

          this.listeStocks = data['_embedded'].stocks;
        });
      this.articleStck = this.listeStocks[0];
      this.gridstock.refresh();
    }
    console.log('id qte ', `row_${rowData.id}_inputQte`);
    if (idQte !== null && idQte !== undefined) {
      document.getElementById(`row_${rowData.id}_inputQte`).focus();
    }
  }

  supprimer(ri) {
    const index = this.listeStockCMD.indexOf(this.listeStockCMD[ri], 0);
    if (index > -1) {
      this.listeStockCMD.splice(index, 1);
    }
    if (this.listeStockCMD.length === 0) {
      this.affichValider = true;
      this.s_Total1CH = null;
      this.s_remisech = null;
      this.tva13 = null;
      this.tva13ch = null;
      this.tva19 = null;
      this.tva19ch = null;
      this.tva7 = null;
      this.tva7ch = null;
      this.s_netch = null;

      this.s_Total1 = 0;
      this.s_remise = 0;
      this.s_base0 = 0;
      this.s_net = 0;
      this.s_ht = 0;
      this.tva13 = 0;
      this.tva19 = 0;
      this.tva7 = 0;
      this.s_net = 0;
      this.s_base0 = 0;
      this.s_base18 = 0;
      this.s_base10 = 0;
      this.s_base29 = 0;
    }
  }

  rechercheMotGridDetais(mot) {
    console.log('code recherche ', mot);
    this.searchDetails = {
      fields: ['code'],
      operator: 'startswith',
      key: mot,
      ignoreCase: true,
    };
  }

  rechercheMotGrid(mot) {
    console.log('numDev recherche ', mot);
    this.searchOptions = {
      fields: ['numDev'],
      operator: 'startswith',
      key: mot,
      ignoreCase: true,
    };
  }

  annulerCMD(e) {
    this.listeOffres = new Array();
    this.listeStockCMD = new Array();
    this.selectedStock = new Array();
    this.selectedClient = null;
    this.selectedVendeur = null;
    this.qteEncours = null;
    this.m = null;
    this.adresse = null;
    this.codeTva = null;
    this.ville = null;
    this.refCmd = null;
    this.codeClient = null;
    this.codeVendeur = null;
    this.etab_cmd = false;
    this.refArticle = null;
    this.listeStocks = new Array();
    this.codeOffre = null;
    this.detailsOffre = new Array();

    this.s_Total1CH = null;
    this.s_remisech = null;
    this.tva13 = null;
    this.tva13ch = null;
    this.tva19 = null;
    this.tva19ch = null;
    this.tva7 = null;
    this.tva7ch = null;
    this.s_netch = null;

    this.s_Total1 = 0;
    this.s_remise = 0;
    this.s_base0 = 0;
    this.s_net = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_net = 0;
    this.s_base0 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;
  }

  async equivArticle(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      this.afficherMvsArticlegrid = false;
      this.afficherlisteStockgrid = true;
      this.refArticle  = this.selectedArticle.code;
      const equiv = this.selectedArticle.equiv;
      console.log('eaquuuiv stock ', equiv);
      //  const  equiv = '108';
      if (equiv !== null && equiv !== undefined) {
        await this.stockService
          .getStockByEquiv(equiv)
          .toPromise()
          .then((data) => {
            this.equivalences = data['_embedded'].stocks;
          });

        // console.log('equiiiiiv ', this.equivalences );
      } else {
        this.equivalences = new Array();
      }
      this.listeStocks = this.equivalences;
      console.log('equiiiiiv ', this.equivalences);
    }
  }

  async afficherMvtAnnCourante_2(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      this.afficherMvsArticlegrid = true;
      this.afficherlisteStockgrid = false;
      this.refArticle  = this.selectedArticle.code;
      const code = this.selectedArticle.code;
      this.readonlyrech = true;
      await this.mouve2Service
        .getMouve2ByCodeForConsultationRef(code)
        .toPromise()
        .then((data) => {
          console.log('liste mouvts 2 art  ', data);
          this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
        });
      console.log('liste mouvts 2 art ', this.mvtAnnCournte);
    }
  }

  async afficherMvtAnnCourante_1(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      this.refArticle  = this.selectedArticle.code;
      this.afficherMvsArticlegrid = true;
      this.afficherlisteStockgrid = false;
      const code = this.selectedArticle.code;
      this.readonlyrech = true;
      await this.mouve1Service
        .getMouve1ByCodeForConsultationRef(code)
        .toPromise()
        .then((data) => {
          console.log('liste mouvts 1 art ', data);
          this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
        });
      console.log('liste mouvts 1 art ', this.mvtAnnCournte);
    }
  }

  async afficherMvtAnnCourante(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
      this.refArticle  = this.selectedArticle.code;
      this.afficherMvsArticlegrid = true;
      this.afficherlisteStockgrid = false;
      this.readonlyrech = true;
      const code = this.selectedArticle.code;
      await this.mouveService
        .getMouveByCodeForConsultationRef(code)
        .toPromise()
        .then((data) => {
          console.log('liste mouvts art ', data);
          this.mvtAnnCournte = data['_embedded'].mouvementDuStocks;
        });
      console.log('liste mouvts art ', this.mvtAnnCournte);
    }
  }
  async rowSelected(e) {
    if (this.gridstock.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridstock.getSelectedRecords()[0];
      this.selectedArticle = selected;
      console.log('selected art ', this.selectedArticle);
    }
  }



  async rowSelectedDetailsOffrs(e) {
    if (this.gridDetailsOffre.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridDetailsOffre.getSelectedRecords()[0];
      this.selectedDetailsOffr = selected;
      console.log('selected art ', this.selectedDetailsOffr);
    }
  }

  async accepterCmdOffres(el) {
    let qt_a_ajouter_satisf = 0;
    let qte = 0;
    let qteSatisf = 0;
    let ddevis = null;

    await this.ddevisService
      .getDdevisByNumDevAndCode(el.numdev, el.code)
      .toPromise()
      .then((data) => {
        console.log('ddevis   numdev != null ', data);
        ddevis = data['_embedded'].ddevis[0];
      });

    qte = Number(ddevis.quantite);
    console.log( 'ddevis.quantite      ', qte);
    qteSatisf = Number(ddevis.qtSatisf);
    console.log( 'ddevis.qtSatisf      ', qteSatisf);
    qt_a_ajouter_satisf = qte - qteSatisf;
    console.log( 'qt_a_ajouter_satisf       ', qt_a_ajouter_satisf );

    if (qt_a_ajouter_satisf > Number(el.qte)) {
      qt_a_ajouter_satisf = Number(el.qte);
    }
      const qt = String(qt_a_ajouter_satisf);
      console.log( 'qte satisfffffffffffffffffff ', qt);

      await this.ddevisService
        .updateQteSatisf(qt, el.numdev, el.code)
        .toPromise()
        .then((data) => {
          console.log('update staisf ', data);
        });

      const satisf = {
        id: null,
        sdevis: el.numdev,
        scombine: 'CMD      ' + this.numCmd,
        scode: el.code,
        squantite: qt,
        sdate: this.dated.toLocaleDateString('en-GB'),
      };
      console.log(' satisf avant create      ', satisf);
      await this.satisfactionService.createSatisfaction(satisf)
        .toPromise()
        .then((data) => {
          console.log('create satisf ', data);
        });


     if (ddevis !== null && ddevis !== undefined) {
        const mtsatisf = Number(ddevis.prix)
                          * (100 - Number(ddevis.tRemise)) / 100
                          * (100 + Number(ddevis.tauxTva)) / 100 * qt_a_ajouter_satisf;
        console.log('mtsatisf avant update  ', mtsatisf);
         if (mtsatisf !== null && mtsatisf !== undefined && mtsatisf >= 0) {
            await this.edevisService.updateNumero(mtsatisf.toFixed(3), el.numdev).toPromise()
            .then((data) => {
              console.log('update mtsatisf edeviiis ', data);
            });
         }

    }
  }

  async validationCmd(e) {
    const ecom = {
      id: null,
      numDev: null,
      datDev: null,
      net: null,
      ht: null,
      remise: null,
      cltDev: null,
      vendeur: null,
      ref: null,
      base0: null,
      base10: null,
      base17: null,
      base29: null,
      tauxTva: null,
    };
    ecom.numDev = this.numCmd;
    // ecom.ref =  this.numCmd ;
    ecom.datDev = this.dated.toLocaleDateString('en-GB');
    ecom.net = this.s_netch;
    ecom.ht = this.s_Total1CH;
    ecom.remise = this.s_remisech;
    ecom.cltDev = this.codeClient;
    ecom.vendeur = this.codeVendeur;
    ecom.ref = this.refCmd;
    ecom.base0 = Number(this.s_base0).toFixed(3);
    ecom.base10 = this.tva13ch;
    ecom.base17 = this.tva19ch;
    ecom.base29 = this.tva7ch;
    this.blockedDocument = true;
    await this.ecomService.createEcom(ecom).subscribe((data) => {
      console.log('insert ecom ******** ', data);
    });
    for (const ob of this.listeStockCMD) {
      console.log('rllllllll ', ob);
          const el = {
            prix : ob.prix,
            code: ob.code,
            quantite : ob.qte,
            combine : this.numCmd,
            livre : '0.0',
            operateur : this.selectedClient.code,
            ref : this.refCmd,
            tauxTva : ob.tva,
            tRemise : ob.marge,
            qteStk: ob.quantite,
            qteASatisfaire: null,
            qteEnCoursCmd: null,
            qtReserv: null,
            num: null
          };
      if (ob.numdev !== null && ob.numdev !== undefined) {
         await this.accepterCmdOffres(ob);
      }

      console.log('dcommmmmmmmmmmm avant insert ', el);
      // el.quantite =
     await this.dcomService.createDcom(el).subscribe((data) => {
        console.log('apres insert ===== dcom ', data);
      });
    }

    this.blockedDocument = false;
    this.loginService

    .procedureStockeModule(
      localStorage.getItem('login'),
      globals.selectedMenu,
      'Num ' + this.numCmd
    )
    .subscribe((data) => {
      console.log(data);
    });
      this.confirmationService.confirm({
        message: ' Commande enregistrée sous le numero ' + this.numCmd + '!!',
        header: 'INFO',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'OK',
        rejectVisible: false,
      });


      this.annulerCMD(e);

  }

  valider(e) {
    this.wasInside = true;
    let compteur = 0;
    for (const obj of this.listeStockCMD) {
         if ( obj.qte === null || obj.qte === undefined || Number(obj.qte) <= 0
         ||  obj.prix === null || obj.prix === undefined || Number(obj.prix) <= 0
         ||  obj.marge === null || obj.marge === undefined || Number(obj.marge) < 0  ) {
        //  this.table.initRowEdit(obj);
        console.log('objjjjjjjjjjjjjjjjjjjj', obj);
        this.affichValider = true;
          this.msg =
            'Veuillez verifier cette ligne !! ';
       //   this.table.initRowEdit(obj);
          this.op.show(e, document.getElementById(`row_${obj.id}`));
          break;
         } else {
           compteur ++;
         }
    }
    if (compteur === this.listeStockCMD.length) {
      this.totaliser(e, this.listeStockCMD) ;
      this.confirmationService.confirm({
        message: ' Voulez vous vraiment valider la commande  !!',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'OK',
        rejectLabel: 'Annuler',
        accept: async () => {
          await this.bcomService
            .createBcom()
            .toPromise()
            .then((data) => {
              console.log('creation numero cmd ', data);
            });

          await this.bcomService
            .getBcom()
            .toPromise()
            .then((data) => {
              console.log('get  numero cmd ', data);
              this.numCmd = data['_embedded'].bcoms[0].numero;
            });
          await this.validationCmd(e);
        },
        reject: () => {
          this.annulerCMD(e);
        },
      });
    } else {

    }

  }
clickStock() {
  console.log( 'value article rech  ', this.refArticle  );

  this.readonlyrech = false;
    if (this.refArticle !== null && this.refArticle !== undefined && this.refArticle !== '') {
      this.rechArticle(this.refArticle);
    } else {
      this.rechArticle('');
    }

}
  changeSelection(e) {
    console.log(e);
    if (e.index === 0) {
      console.log( 'value article rech  ', this.refArticle  );

      this.readonlyrech = false;
        if (this.refArticle !== null && this.refArticle !== undefined && this.refArticle !== '' && this.refArticle !== ' ') {
          this.rechArticle(this.refArticle);
        } else {
          this.rechArticle('');
        }

    } else if (e.index === 1) {
      this.afficherMvtAnnCourante(e);
    } else if (e.index === 2) {
      this.afficherMvtAnnCourante_1(e);
    } else if (e.index === 3) {
      this.afficherMvtAnnCourante_2(e);
    } else if (e.index === 4) {
      this.equivArticle(e);
    }
  }

  async quantiteCommande(e) {
    let qte = '0';
    await this.commandeService
      .qteCommandeEnCoursByArticle(this.refArticle)
      .toPromise()
      .then((data) => {
        console.log('qte en cours commandes ', data);
        qte = data[0];
      });
    this.qteEncours = qte;
  }

  async verifQuantite(art, e) {
    const qte = art.qte;
    const art_quantite = art.quantite;
    const id = art.id;
    this.op.hide();
    this.wasInside = true;
    if (qte !== null && qte !== undefined && Number(qte) !== 0) {
      const qte_stock = Number(art_quantite);
      const qte_saisie = Number(qte);
      if (qte_stock < qte_saisie) {
        this.confirmationService.confirm({
          message: 'Quantité insufisante ! ' + qte_stock + ' en stock  !!',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          rejectVisible: false,
          accept: async () => {

            art.quantiteInitial = art.qte ;
            if (Number(art.prix) > 0) {
              this.calculTotalPrix(art.prix, art.qte, art);
            }
            this.mouveToNext(`row_${id}_prix`);
          },
          reject: () => {

            this.mouveToNext(`row_${id}_inputQte`);
          },
        });
      } else {
        art.quantiteInitial = art.qte ;
        if (Number(art.prix) > 0) {
          this.calculTotalPrix(art.prix, art.qte, art);
        }
        this.mouveToNext(`row_${id}_prix`);
      }
    } else {
      this.ajout = true;
      // this.calculTotPrix = false;
      this.table.initRowEdit(art);
      this.disable = true;
      this.msg = 'veuillez donner la quantité à commander';
     /* document.getElementById(`row_${id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });*/
      this.op.show(e, document.getElementById(`row_${id}_qte`));
      this.ajout = false;
      this.table.initRowEdit(art);
    }
  }

  blurRemise(rowData, e) {
    if (Number(rowData.marge) > Number(rowData.margeInitial) ) {

      this.msg = 'Max. Remise pour ce client  ! ' + Number(rowData.margeInitial).toFixed(2) + ' !!';
      this.op.show(e);
      rowData.marge = Number(rowData.margeInitial).toFixed(2);
    } else {
      if (Number(rowData.marge) < 0 || rowData.marge === null || rowData.marge) {
        rowData.marge = Number(rowData.margeInitial).toFixed(2);
      } else {
        rowData.marge = Number(rowData.marge).toFixed(2);
      }
    }

  }
  blurQuantite(rowData) {
    // Number(rowData.qte) > Number(rowData.quantiteInitial) ||
    if ( Number(rowData.qte) <= 0 || rowData.qte === null || rowData.qte === undefined) {
      rowData.qte = rowData.quantiteInitial;
      this.calculTotalPrix(rowData.prix, rowData.qte, rowData);
    }

  }

  blurPrix(rowData) {
    // Number(rowData.qte) > Number(rowData.quantiteInitial) ||
    if ( Number(rowData.prix) <= 0 || rowData.prix === null || rowData.prix === undefined) {
      rowData.prix = rowData.prixInitial;
      rowData.prix = Number(rowData.prix).toFixed(3);
      this.calculTotalPrix(rowData.prix, rowData.qte, rowData);
    }

  }

  async verifRemise(remise, rawData, e) {
    this.affichValider = true;
    this.wasInside = true;
    console.log('val remise    ***  ', remise, rawData);

    if (remise !== null && remise !== undefined && Number(remise) >= 0) {
      const remiseClt = Number(rawData.margeInitial);
      const remise_saisie = Number(remise);
      if ( remise_saisie > remiseClt) {
        rawData.marge =  Number(rawData.margeInitial).toFixed(2);
        this.msg = 'Max. Remise pour ce client  ! ' + remiseClt + ' !!';
        this.op.show(e);
      } else {

        rawData.marge =  Number(rawData.marge ).toFixed(2);
        this.table.cancelRowEdit(rawData);
        this.affichValider = false;
      }
    } else {
      this.ajout = true;
      this.msg = 'Remise doit etre un nombre postif';
     /* document.getElementById(`row_${id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });*/
      this.op.show(e);
      this.ajout = false;
    }
  }

  async verifPrix(prix, rawData, e, id) {
    this.op.hide();
    this.wasInside = true;
    console.log('quantittttttteeee', rawData.qte, '***');

    if (
      rawData.qte === null ||
      rawData.qte === undefined ||
      rawData.qte === '' ||
      Number(rawData.qte) === 0
    ) {
      this.msg = 'veuillez donner la quantite à commander !!';

      this.mouveToNext(`row_${rawData.id}_inputQte`);
      this.op.show(e, document.getElementById(`row_${rawData.id}_inputQte`));
    } else {
      if (prix !== null && prix !== undefined && Number(prix) > 0) {
        const prix_saisie = Number(prix);
        const qte = Number(rawData.qte);
        rawData = this.calculTotalPrix(prix_saisie, qte, rawData);
        rawData.prix = Number(rawData.prix ).toFixed(3);
        rawData.prixInitial = Number(rawData.prix ).toFixed(3);
        this.mouveToNext(`row_${id}_marge`);
        this.disable = false;


      } else {

        this.ajout = true;
        this.msg = 'veuillez donner le prix de cet article';
       /* document.getElementById(`row_${rawData.id}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });*/
        rawData.prixtot = null;
        this.op.show(e, document.getElementById(`row_${id}_prix`));
        this.ajout = false;
      }
    }
  }

  calculTotalPrix(prix, qte, art): any {
    if (
      prix === null ||
      prix === undefined ||
      qte === null ||
      qte === undefined
    ) {
      art.prixtot = null;
      // this.calculTotPrix = true;
    } else {
      this.prixTot = Number(prix) * Number(qte);

      const prixx = 0;

      /* if (Number(this.v_marge) > 0) {
        this.prixTot =
          this.prixTot - this.prixTot * Number(this.v_marge * 0.01);
      }*/
      // Result:= FloatToStrF(tot -(tot*var_remise*0.01),ffFixed,15,3);
      art.prixtot = Number(this.prixTot).toFixed(3);
      this.calculTotPrix = true;
    }

    return art;
  }

  async doubleclickDetailsOffre(e) {
    this.qteEncours = null;

    this.s_Total1CH = null;
    this.s_remisech = null;
    this.tva13 = null;
    this.tva13ch = null;
    this.tva19 = null;
    this.tva19ch = null;
    this.tva7 = null;
    this.tva7ch = null;
    this.s_netch = null;

    this.s_Total1 = 0;
    this.s_remise = 0;
    this.s_base0 = 0;
    this.s_net = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_net = 0;
    this.s_base0 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;

    this.wasInside = true;
    this.op.hide();
    console.log(
      'double click selected details offrs',
      this.selectedDetailsOffr
    );
    this.refArticle = this.selectedDetailsOffr.code;

    await this.stockService
      .getStock(this.refArticle)
      .toPromise()
      .then((data) => {
        console.log('liste stock ', data);

        this.listeStocks = data['_embedded'].stocks;
      });
    this.articleStck = this.listeStocks[0];
    this.gridstock.refresh();

    let art = {
      id: this.selectedDetailsOffr.id,
      prix: Number(this.selectedDetailsOffr.prix).toFixed(3),
      prixInitial: Number(this.selectedDetailsOffr.prix).toFixed(3),
      code: this.selectedDetailsOffr.code,
      design: this.selectedDetailsOffr.design,
      qte: this.selectedDetailsOffr.quantite,
      quantite: this.articleStck.quantite,
      quantiteInitial: this.articleStck.quantite,
      marge: Number(this.selectedDetailsOffr.tRemise).toFixed(2),
      margeInitial: Number(this.selectedDetailsOffr.tRemise).toFixed(2),
      tva: null,
      prixtot: null,
      numdev: this.selectedDetailsOffr.combine,
    };

    if (this.flag_exonor) {
      art.tva = '0.00';
    } else {
      art.tva = Number(this.selectedDetailsOffr.tauxTva).toFixed(2);
    }

    if (this.selectedStock.length === 0) {
      art = this.calculTotalPrix(Number(art.prix), Number(art.qte), art);
      this.disable = false;

      if (Number(art.qte) > Number(art.quantite)) {
        this.confirmationService.confirm({
          message: 'Quantité insufisante ! ' + art.quantite + ' en stock  !!',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'OK',
          rejectVisible: false,
        });
      } else {
      }
      setTimeout(() => {
        document.getElementById(`row_${art.id}_qte`).click();
        document.getElementById(`row_${art.id}_qte`).focus();
    }, 0);
      await this.selectedStock.push(art);
      this.listeStockCMD = this.selectedStock;
      this.affichValider = false;
      this.calculTotPrix = true;
      //  await this.table.initRowEdit(art);
      console.log(
        'id quantite selected article details offre ',
        `row_${art.id}_inputQte`
      );

      // await document.getElementById(`row_${art.id}_inputQte`).focus();
      // await this.verifQuantite( art.qte, art.quantite, e, art.id);
    } else {
      let j;
      let index = -1;
      for (j = 0; j <= this.selectedStock.length - 1; j++) {
        if (this.selectedStock[j].code === art.code) {
          this.msg = 'Cet article est déjà dans la liste !! ';
          this.op.show(e);
          index = j;
          break;
        } else {
          index = -1;
        }
      }
      console.log('indice de double clic item', index);
      if (index === -1) {
        if (
          this.selectedStock[this.selectedStock.length - 1].qte === null ||
          this.selectedStock[this.selectedStock.length - 1].qte === null ||
          this.selectedStock[this.selectedStock.length - 1].qte === undefined
        ) {
          this.ajout = true;
          this.affichValider = true;
          this.table.initRowEdit(art);
          this.msg = 'veuillez donner la quantité à commander';
         /* document
            .getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}`
            )
            .scrollIntoView({
              inline: 'start',
              block: 'start',
            });*/
          this.op.show(
            e,
            document.getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}_qte`
            )
          );
          this.table.initRowEdit(art);
        } else {
          this.ajout = true;
          art = this.calculTotalPrix(Number(art.prix), Number(art.qte), art);
          this.disable = false;
          console.log('article apres calcul prix ', art);
          setTimeout(() => {
            document.getElementById(`row_${art.id}_qte`).click();
            document.getElementById(`row_${art.id}_qte`).focus();
        }, 0);
          await this.selectedStock.push(art);
          this.calculTotPrix = true;
          this.affichValider = false;
          this.listeStockCMD = this.selectedStock;
          if (
            this.listeStockCMD.length >= 3 &&
            art.id !== null &&
            art.id !== undefined
          ) {
            console.log('id scrolll ');
            if (
              this.selectedStock[this.selectedStock.length - 1].id !== null &&
              this.selectedStock[this.selectedStock.length - 1].id !== undefined
            ) {
             /* await document
                .getElementById(
                  `row_${this.selectedStock[this.selectedStock.length - 1].id}`
                )
                .scrollIntoView({
                  inline: 'start',
                  block: 'start',
                });*/
            }
          }
        }
      }
    }

    this.ajout = false;
  }

  async doubleclickStock(e) {
    this.qteEncours = null;
    this.s_Total1CH = null;
    this.s_remisech = null;
    this.tva13 = null;
    this.tva13ch = null;
    this.tva19 = null;
    this.tva19ch = null;
    this.tva7 = null;
    this.tva7ch = null;
    this.s_netch = null;

    this.s_Total1 = 0;
    this.s_remise = 0;
    this.s_base0 = 0;
    this.s_net = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_net = 0;
    this.s_base0 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;

    this.affichValider = true;
    this.wasInside = true;

    this.op.hide();
    console.log('double click selected row ', this.selectedArticle);
    const art = {
      id: this.selectedArticle.id,
      prix: Number(this.selectedArticle.prix).toFixed(3),
      prixInitial: Number(this.selectedArticle.prix).toFixed(3),
      code: this.selectedArticle.code,
      design: this.selectedArticle.design,
      quantite: this.selectedArticle.quantite,
      quantiteInitial: this.selectedArticle.quantite,
      qte: null,
      marge: Number(this.selectedClient.marque).toFixed(2),
      margeInitial: Number(this.selectedClient.marque).toFixed(2),
      tva: Number(this.selectedArticle.tva).toFixed(2),
      prixtot: null,
      numdev: null,
    };

    if (this.flag_exonor) {
      art.tva = '0.00';
    } else {
      art.tva = Number(this.selectedArticle.tva).toFixed(2);
    }

    const idQte = `row_${art.id}_inputQte`;
    if (this.selectedStock.length === 0) {
      setTimeout(() => {
        document.getElementById(`row_${art.id}_qte`).click();
        document.getElementById(`row_${art.id}_qte`).focus();
    }, 0);
      await this.selectedStock.push(art);

      this.disable = true;
      this.listeStockCMD = this.selectedStock;
      await this.table.initRowEdit(art);
      this.refArticle = this.selectedArticle.code;
     // this.listeStocks = [this.selectedArticle];
    //  this.gridstock.refresh();
      if (
        document.getElementById(idQte) !== null &&
        document.getElementById(idQte) !== undefined
      ) {
        window.setTimeout(function () {
          document.getElementById(idQte).focus();
      }, 0);
      }
    } else {
      if (this.listeStockCMD[this.listeStockCMD.length - 1].prixtot !== null) {
        this.table.cancelRowEdit(
          this.listeStockCMD[this.listeStockCMD.length - 1]
        );
      }

      let j;
      let index = -1;
      for (j = 0; j <= this.selectedStock.length - 1; j++) {
        if (this.selectedStock[j].code === art.code) {
          this.calculTotPrix = true;
          if (art.prixtot === undefined || art.prixtot === null) {
            this.table.initRowEdit(art);
          } else {
            this.calculTotPrix = false;
            this.table.cancelRowEdit(art);
          }
          this.msg = 'Cet article est déjà dans la liste !!';
          this.op.show(e);
          index = j;

          break;
        } else {
          index = -1;
        }
      }
      if (index === -1) {
        if (
          this.selectedStock[this.selectedStock.length - 1].qte === null ||
          this.selectedStock[this.selectedStock.length - 1].qte === undefined
        ) {
          this.ajout = true;
          // this.calculTotPrix = false;
          this.table.initRowEdit(art);
          this.msg = 'veuillez donner la quantité à commander';
         /* document
            .getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}`
            )
            .scrollIntoView({
              inline: 'start',
              block: 'start',
            });*/
          this.op.show(
            e,
            document.getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}_qte`
            )
          );
          this.ajout = false;
          this.table.initRowEdit(art);
        } else {
          this.ajout = true;
          this.refArticle = this.selectedArticle.code;
        //  this.listeStocks = [this.selectedArticle];
         // this.gridstock.refresh();
          let i = 0;
          let cmd = this.selectedStock[i];
          while (
            i <= this.listeStockCMD.length - 1 &&
            cmd.prixtot !== null &&
            cmd.prixtot !== undefined
          ) {
            i++;
            cmd = this.selectedStock[i];
          }
          console.log('iiiiiiiiiiiiiiiiiii', i);

          if (i > this.listeStockCMD.length - 1) {
            setTimeout(() => {
              document.getElementById(`row_${art.id}_qte`).click();
              document.getElementById(`row_${art.id}_qte`).focus();
          }, 0);
            await this.selectedStock.push(art);
            this.disable = true;
            this.listeStockCMD = this.selectedStock;
            this.table.initRowEdit(art);
            if (
              this.listeStockCMD.length >= 3 &&
              art.id !== null &&
              art.id !== undefined
            ) {
              console.log('id scrolll ');
              if (
                this.selectedStock[this.selectedStock.length - 1].id !== null &&
                this.selectedStock[this.selectedStock.length - 1].id !==
                  undefined
              ) {
               /* document.getElementById(`row_${art.id}`).scrollIntoView({
                  inline: 'start',
                  block: 'start',
                });*/
              }
            }

            this.wasInside = true;

           // this.refArticle = this.selectedArticle.code;
           // this.listeStocks = [this.selectedArticle];
          //  this.gridstock.refresh();
            if (
              document.getElementById(idQte) !== null &&
              document.getElementById(idQte) !== undefined
            ) {
              document.getElementById(idQte).focus();
            }
            //  this.ajout = true;
            /*     document
            .getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].id}`
            )
            .scrollIntoView({
              inline: 'start',
              block: 'start',
            });*/
          } else {
            // this.calculTotPrix = true;
            this.table.initRowEdit(cmd);
            this.msg =
              'Veuillez verifier cette ligne !! , cliquer sur Entrée pour continuer !!';
            this.table.initRowEdit(cmd);
            this.op.show(e, document.getElementById(`row_${cmd.id}`));
            if (
              document.getElementById(`row_${cmd.id}_inputQte`) !== null &&
              document.getElementById(`row_${cmd.id}_inputQte`) !== undefined
            ) {
              document.getElementById(`row_${cmd.id}_inputQte`).focus();
            }
          }
        }
      }
    }

    this.calculTotPrix = false;
    if (
      this.listeStockCMD.length >= 3 &&
      art.id !== null &&
      art.id !== undefined
    ) {
      const id = this.listeStockCMD[this.listeStockCMD.length - 1].id;
      this.ajout = true;
      if (
        this.listeStockCMD[this.listeStockCMD.length - 1].id !== null &&
        this.listeStockCMD[this.listeStockCMD.length - 1].id !== undefined
      ) {
        const idd = document.getElementById(`row_${id}`);
        if (idd !== null) {
         /* await document
            .getElementById(`row_${id}`)
            .scrollIntoView({ inline: 'start' });*/
        }
      }
    }
    if (idQte !== null && idQte !== undefined) {
      console.log('id qte ', idQte);
      window.setTimeout(function () {
        document.getElementById(idQte).focus();
    }, 0);

      const a = document.getElementById(idQte);
      if (a !== null) {
        a.focus();
      }
      console.log('aaaa', a);
    }

    this.ajout = false;
  }

  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    this.refArticle = mot;
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        console.log('liste stock ', data);

        this.listeStocks = data['_embedded'].stocks;
      });
    this.afficherMvsArticlegrid = false;
    this.afficherlisteStockgrid = true;
    this.readonlyrech = false;
    this.gridstock.refresh();
  }
  async EtabCMD(e) {
    let listEcom = new Array();
    this.wasInside = true;
    if (this.op !== null && this.op !== undefined) {
      this.op.hide();
    }
    let refcmdd;
    if (this.refCmd === null || this.refCmd === undefined) {
      refcmdd = null;
    } else {
      refcmdd = this.refCmd;
    }

    if (this.selectedClient !== null && this.selectedClient !== undefined) {
      if (refcmdd !== null) {
        await this.ecomService
          .ExistCMDByCLTRef(refcmdd, this.codeClient)
          .toPromise()
          .then((data) => {
            console.log('liste ecom ', data);
            listEcom = data['_embedded'].ecom;
          });
        if (listEcom.length > 0) {
          this.msg = 'CETTE COMMANDE EXISTE DEJA !!';
          this.op.show(e, document.getElementById('refcmd'));
          this.etab_cmd = false;
        } else {
          if (this.m === null || this.m === undefined || this.m === '') {
            this.msg = 'veuillez saisir le nom du  client !!';
            this.op.show(e, document.getElementById('m'));
            this.etab_cmd = false;
          } else {
            this.readoonly = true;
            if (
              this.selectedVendeur !== null &&
              this.selectedVendeur !== undefined
            ) {
              this.etab_cmd = true;
            } else {
              this.msg = 'veuillez selectionner un vendeur !!';
              this.op.show(e, document.getElementById('vend'));
              this.etab_cmd = false;
            }
          }
        }
      } else {
        if (this.m === null || this.m === undefined || this.m === '') {
          this.msg = 'veuillez saisir le nom du  client !!';
          this.op.show(e, document.getElementById('m'));
          this.etab_cmd = false;
        } else {
          this.readoonly = true;
          if (
            this.selectedVendeur !== null &&
            this.selectedVendeur !== undefined
          ) {
            this.etab_cmd = true;
          } else {
            this.msg = 'veuillez selectionner un vendeur !!';
            this.op.show(e, document.getElementById('vend'));
            this.etab_cmd = false;
          }
        }
      }
    } else {
      this.msg = 'veuillez selectionner un client !!';
      this.op.show(e, document.getElementById('clt'));
      this.etab_cmd = false;
    }
  }
  totaliser(e, liste) {
    console.log('liste totaliser ', liste);

    this.s_Total1 = 0;
    this.s_remise = 0;
    this.s_base0 = 0;
    this.s_net = 0;
    this.s_ht = 0;
    this.tva13 = 0;
    this.tva19 = 0;
    this.tva7 = 0;
    this.s_net = 0;
    this.s_base0 = 0;
    this.s_base18 = 0;
    this.s_base10 = 0;
    this.s_base29 = 0;
    // this.totTTC = 0;
    for (const obj of liste) {
      this.s_Total1 = this.s_Total1 + Number(obj.prixtot);
      this.s_remise =
        this.s_remise + Number(obj.prixtot) * Number(obj.marge) * 0.01;
      console.log('totaliser  ', obj.tva);

      switch (obj.tva) {
        case '0.00': {
          this.s_base0 =
            this.s_base0 + Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
        case '13.00': {
          this.s_base10 =
            this.s_base10 +
            Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
        case '19.00': {
          this.s_base18 =
            this.s_base18 +
            Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
        case '7.00': {
          this.s_base29 =
            this.s_base29 +
            Number(obj.prixtot) * (1 - Number(obj.marge) * 0.01);
          break;
        }
      }
    }
    this.s_net =
      this.s_base0 +
      this.s_base10 * 1.13 +
      this.s_base18 * 1.19 +
      this.s_base29 * 1.07;
    this.s_ht = this.s_base0 + this.s_base10 + this.s_base18 + this.s_base29;
    this.s_remise = this.s_Total1 - this.s_ht;
    this.s_Total1CH = Number(this.s_Total1).toFixed(3);
    this.s_remisech = Number(this.s_remise).toFixed(3);

    this.tva13 = this.s_base10 * 0.13;
    this.tva13ch = Number(this.tva13).toFixed(3);
    this.tva19 = this.s_base18 * 0.19;
    this.tva19ch = Number(this.tva19).toFixed(3);
    this.tva7 = this.s_base29 * 0.07;
    this.tva7ch = Number(this.tva7).toFixed(3);
    if (this.flag_timbre) {
      this.s_net = this.s_net + 0.6;
    }
    this.s_netch = Number(this.s_net).toFixed(3);
  }
  async ngOnInit() {
    this.flag_timbre = false;
    this.flag_exonor = false;
    // this.v_marge = 0;

    this.tn = {
      firstDayOfWeek: 0,
      dayNames: [
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi',
        'Dimanche',
      ],
      dayNamesShort: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      dayNamesMin: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
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
    this.etab_cmd = false;
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
    };
    this.afficherNum_dev = false;
    this.readonlyrech = false;
    this.afficherlisteStockgrid = true;
    this.afficherMvsArticlegrid = false;
    this.afficherOffres = false;
    this.codeVendeur = '';
    this.codeClient = '';
    await this.clientService
      .getClientsListOrdByDeno()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].clients;
      });
    console.log('liste des clients ', this.clients);

    await this.vendeur1Service
      .getVendeur1sList()
      .toPromise()
      .then((data) => {
        this.vendeurs = data['_embedded'].vendeur1;
      });
    console.log('vendeur liste  ', this.vendeurs);
  }

  async selectedOffre(e) {
    console.log('double click details ', this.codeOffre);
    if (this.gridOffres.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridOffres.getSelectedRecords()[0];
      this.selectedOff = this.gridOffres.getSelectedRecords()[0];

      const combine = this.selectedOff.numDev;
      await this.ddevisService
        .getDdevisByNumDev(combine)
        .toPromise()
        .then((data) => {
          console.log('liste d devis ', data);
          this.detailsOffre = data['_embedded'].ddevis;
          for (const obj of this.detailsOffre) {
            obj.quantite = Number(obj.quantite).toFixed(3);
            obj.tRemise = Number(obj.tRemise).toFixed(2);
            obj.prix = Number(obj.prix).toFixed(3);
          }
        });
    }
  }
  chargerPrixtot(rowdata) {
    rowdata.prixtot = null;
    if (
      rowdata.qte !== null &&
      rowdata.qte !== undefined &&
      rowdata.qte !== '' &&
      Number(rowdata.qte) !== 0
    ) {

      if (rowdata.prix !== null && rowdata.prix !== undefined && Number(rowdata.prix) > 0) {
        const prix_saisie = Number(rowdata.prix);
        const qte = Number(rowdata.qte);
        rowdata = this.calculTotalPrix(prix_saisie, qte, rowdata);
       // rowdata.prix = Number(rowdata.prix ).toFixed(3);
      }
    }
    return rowdata;
  }

  async offrsClient(e) {
    this.wasInside = true;
    this.op.hide();
    this.listeOffres = new Array();
    await this.edevisService
      .listeOffreClient(this.codeClient)
      .toPromise()
      .then((data) => {
        console.log('liste des offres ', data['_embedded'].edevis);
        this.listeOffres = data['_embedded'].edevis;
      });
    if (this.listeOffres.length === 0) {
      this.msg = 'aucun offre trouvé !! ';
      this.op.show(e, document.getElementById('affdetails'));
      this.afficherOffres = false;
    } else {
      this.afficherOffres = true;
    }
  }

  changeSelectedItem() {
    if (this.selectedClient !== null && this.selectedClient !== undefined) {
      console.log('selected client ', this.selectedClient);
      this.codeClient = this.selectedClient.code;
      this.ville = this.selectedClient.ville;
      this.codeTva = this.selectedClient.codeTva;
      this.m = this.selectedClient.deno;
      this.adresse = this.selectedClient.adresse;
      if (
        Number(this.selectedClient.marque) > 0 &&
        (this.selectedClient.terme === 'O' || this.selectedClient.typeC === 'O')
      ) {
        this.v_marge = this.selectedClient.marque;
      } else {
        this.v_marge = 0;
      }
      console.log('selected client ++++++++', this.selectedClient);

      if (this.selectedClient.timbre === 'O') {
        this.flag_timbre = true;
      } else {
        this.flag_timbre = false;
      }
      if (this.selectedClient.exonor === 'O') {
        this.flag_exonor = true;
      } else {
        this.flag_exonor = false;
      }

      // v_assujet:= DataModuleClient.TableClientASSUJET.Value;

      if (
        this.selectedClient.code === '7200' ||
        this.selectedClient.code === '7300' ||
        this.selectedClient.code === '7500'
      ) {
        // enabled editing m. adr ville code tva
        this.readoonly = false;
      } else {
        this.readoonly = true;
      }
    } else {
      this.codeClient = null;
      this.ville = null;
      this.codeTva = null;
      this.m = null;
      this.adresse = null;
    }
  }

  changeSelectedVendeur() {
    if (this.selectedVendeur !== null && this.selectedVendeur !== undefined) {
      this.codeVendeur = this.selectedVendeur.code;
    } else {
      this.codeVendeur = '';
    }
  }
  public onSearchItemclt(word: string, item: any): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }
}
