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
  selector: 'app-modif-cmd-client',
  templateUrl: './modif-cmd-client.component.html',
  styleUrls: ['./modif-cmd-client.component.scss'],
  providers: [ToolbarService, ResizeService, ConfirmationService]
})

export class ModifCmdClientComponent implements OnInit {
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
  ecom: any;
  index: number;
  ref: any;
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
    private equivalenceService: EquivalenceService,
    private mouve2Service: Mouve2Service,
    private ecomService: EcomService,
    private dcomService: DcomService,
    private bcomService: BcomService
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous ';

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

  readonly1: boolean;
  dated ;
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
    qte: any;
    marge: any;
    tva: any;
    prixtot: any;
    numdev: any;
  };
  articleStck: any;
  v_marge: any;

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Set the new row in edit mode
   /* if (this.listeStockCMD.length > 4 && this.ajout === true) {
      this.table.handleVirtualScroll('click');
      event.preventDefault();
    }*/
  }

  async chargerCmd(refCmd , e) {
    this.readonly = true;
    this.listeStockCMD = new Array();
    this.index = 0;
     await this.ecomService.getEcomByNumDev(refCmd)
     .toPromise()
     .then(data => {
       console.log('details commande ', data['_embedded'].ecom[0]);
       this.ecom = data['_embedded'].ecom[0];
     });
     if (this.ecom !== null && this.ecom !== undefined ) {


     this.s_Total1CH = Number(this.ecom.ht).toFixed(3);
     this.s_remisech = Number( this.ecom.remise).toFixed(3);
     this.tva13ch =  Number(this.ecom.base10).toFixed(3);
     this.tva19ch = Number(this.ecom.base17).toFixed(3);
     this.tva7ch  = Number(this.ecom.base29).toFixed(3);
     this.s_netch = Number(this.ecom.net).toFixed(3);

     this.etab_cmd = true;
     this.codeClient = this.ecom.cltDev;
     this.dated = this.ecom.datDev;
     this.ref = this.ecom.ref;
     this.codeVendeur = this.ecom.vendeur;
     if (this.codeClient !== null ) {
       await this.clientService.getClientByCode(this.codeClient)
          .toPromise()
          .then(data => {
          console.log('client cmd ', data);
          this.selectedClient = data['_embedded'].clients[0] ;
        }
          );
          this.codeClient = this.codeClient + '  ' + this.selectedClient.deno;
          this.ville = this.selectedClient.ville;
          this.codeTva = this.selectedClient.codeTva;
          this.m = this.selectedClient.deno;
          this.adresse = this.selectedClient.adresse;
     }

     if (this.codeVendeur !== null ) {
       await this.vendeur1Service.getVendeur1ByCode(this.codeVendeur)
       .toPromise()
       .then(data => {
         console.log('vendeuuur cmd ', data );
           this.selectedVendeur = data['_embedded'].vendeur1[0];

       });
       this.codeVendeur = this.codeVendeur + '  ' + this.selectedVendeur.deno;
     }

     await this.dcomService.getDcomByCombine(this.refCmd)
     .toPromise()
     .then(data => {
       console.log('dcoooooooom liste by comb ', data);
        this.selectedStock = data['_embedded'].dcom;

     //  this.table.value = this.listeStockCMD;
       console.log('liste cmd ', this.selectedStock);

     });
     for (const obj of this.selectedStock )  {
       let des = '';
       let quantite = 0;
       this.index = this.index + 1 ;
       await this.stockService.getStock(obj.code)
       .toPromise()
       .then(data => {
         console.log('rech design article ', data);
           des = data['_embedded'].stocks[0].design;
           quantite = data['_embedded'].stocks[0].quantite;
       });

      const art = {
        index: String(this.index),
        num : obj.num,
        prix: Number(obj.prix).toFixed(3),
        code: obj.code,
        design: des,
        qte: obj.quantite,
        quantite: quantite,
        marge: Number(obj.tRemise).toFixed(2),
        tva: Number( obj.tauxTva).toFixed(2),
        prixtot: null,

      };
      const prixtot = Number(art.qte) * Number(art.prix);
      art.prixtot = Number(prixtot).toFixed(3);

      this.listeStockCMD.push(art);

     }
     this.selectedStock = this.listeStockCMD;
     this.listeStockCMD = this.selectedStock;
    } else {
      this.readonly = false;
      this.msg = 'commande inéxistant !';
      this.op.show(e, document.getElementById('refcmd'));

    }
  }

  onRowEditCancel(rowData, ri) {
    this.ajout = false;
    // rowData = this.selectedArticle;
  }






  async onRowEditSave(rowData, e) {
    this.op.hide();
    this.wasInside = false;
    const art = rowData;

    this.table.initRowEdit(rowData);
    this.calculTotPrix = false;
    const idQte = `row_${rowData.index}_inputQte`;
    if (idQte !== null && idQte !== undefined) {
      document.getElementById(`row_${rowData.index}_inputQte`).focus();
    }
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
  async onRowEditInit(rowData, e) {

    console.log('ligne cmd ', rowData);

    let i = 0;
    while ( i < this.listeStockCMD.length ) {
         if ( this.listeStockCMD[i].index !== rowData.index ) {
          this.verifQuantite(rowData, e);
          this.table.cancelRowEdit(this.listeStockCMD[i]);
         } else {

          this.table.initRowEdit(this.listeStockCMD[i]);
        /*  setTimeout(() => {
            document.getElementById(rowData.index).click();
            document.getElementById(rowData.index).focus();
        }, 0);*/
          this.disable = true;
         }

        i++;
    }
    // this.calculTotPrix = false;
    console.log('rowdata . index ', rowData.index );

   const idQte = `row_${rowData.index}_inputQte`;
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
      console.log('id qte ', `row_${rowData.index}_inputQte`);

    }
    if (idQte !== null && idQte !== undefined) {
      document.getElementById(`row_${rowData.index}_inputQte`).focus();
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
    this.disable = false;
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
    this.disable = false;
    this.dated = null;
    this.readonly = false;
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

  async afficherMvtAnnCourante(e) {
    if (this.selectedArticle !== null && this.selectedArticle !== undefined) {
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

  ngAfterViewChecked() {
    if (this.selectedStock.length > 0 && this.ajout) {
      this.scrollToBottom();
      //  this.commandeLength = this.demandeCommande.length;
    }
  }
  private scrollToBottom(): void {
    if (
      this.selectedStock[this.selectedStock.length - 1].index  !== null &&
      this.selectedStock[this.selectedStock.length - 1].index  !== undefined
    ) {
      document
        .getElementById(
          `row_${this.selectedStock[this.selectedStock.length - 1].index }`
        )
        .scrollIntoView({
          behavior: 'smooth',
          inline: 'start',
          block: 'start',
        });
    }
  }

  async rowSelectedDetailsOffrs(e) {
    if (this.gridDetailsOffre.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridDetailsOffre.getSelectedRecords()[0];
      this.selectedDetailsOffr = selected;
      console.log('selected art ', this.selectedDetailsOffr);
    }
  }

  async verifQuantite(art, e) {

    const qte = art.qte;
    const art_quantite = art.quantite;
    const id = art.index;
    this.op.hide();
    this.wasInside = true;
    console.log('qteeeeeeeeeeee', qte, 'hh');

    if (qte !== null && qte !== undefined && Number(qte) > 0 && qte !== '') {
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
            this.mouveToNext(`row_${id}_marge`);
          },
          reject: () => {
            this.mouveToNext(`row_${id}_inputQte`);
          },
        });
      } else {
        this.mouveToNext(`row_${id}_marge`);
      }
    } else {
      this.ajout = true;
      // this.calculTotPrix = false;
      this.disable = true;
      this.table.initRowEdit(art);
      this.msg = 'veuillez donner la quantité à commander';
      document.getElementById(`row_${id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.op.show(e, document.getElementById(`row_${id}_qte`));
      this.ajout = false;
      this.table.initRowEdit(art);
    }
  }


  async validationCmd(e) {



    const ecom = {
      id: this.ecom.id,
      numDev: this.ecom.numDev,
      datDev: this.ecom.datDev,
      net: this.s_netch,
      ht: this.s_Total1CH,
      remise: this.s_remisech ,
      cltDev: this.ecom.cltDev,
      vendeur: this.ecom.vendeur,
      ref: this.ecom.ref,
      base0: null,
      base10: this.tva13ch,
      base17: this.tva19ch ,
      base29: this.tva7ch,
      tauxTva: this.ecom.tauxTva,
    };

    await this.ecomService.updateEcom(ecom).subscribe((data) => {
      console.log('insert ecom ******** ', data);
    });




    for (const el of this.listeStockCMD) {
      console.log('rllllllll ', el);
      const dcom = {
        combine: null,
        code: null,
        quantite: null,
        tRemise: null,
        prix: null,
        tauxTva: null,
        livre: null,
        operateur: null,
        ref: null,
        qtestk: null,
        qteASatisfaire: null,
        qteEncoursCmd: null,
        qtReserv: null,
        num: null
      };
      dcom.combine =  this.refCmd ;
      dcom.code = el.code;
      dcom.ref = this.ref;
      dcom.prix = el.prix;
      dcom.tRemise = el.marge;
      dcom.tauxTva = el.tva;
      dcom.quantite = el.qte;
      dcom.livre = '0.00';
      dcom.operateur = this.selectedClient.code;
      dcom.ref = this.refCmd;
      console.log('dcommmmmmmmmmmm update ', el);

      await this.dcomService.createDcom(dcom).toPromise()
      .then(data => {
        console.log('apres insert ===== dcom ', data);
      });
    }
      this.annulerCMD(e);

  }

  valider(e) {
    this.totaliser(e, this.listeStockCMD);
    this.confirmationService.confirm({
      message: ' Voulez vous vraiment valider la commande  !!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'OK',
      rejectLabel: 'Annuler',
      accept: async () => {
        await this.dcomService.deleteDcom(this.refCmd).toPromise().then(data => {
          console.log('delete ===== dcom ', data);
        });
        await this.validationCmd(e);
      },
      reject: () => {
        this.annulerCMD(e);
      },
    });
  }



  async verifRemise(remise, rawData, e, id) {
    this.op.hide();
    this.wasInside = true;
    if (remise !== null && remise !== undefined && Number(remise) >= 0) {
      const remiseClt = Number(rawData.marge);
      const remise_saisie = Number(remise);
      if (this.v_marge > 0 && remise_saisie > this.v_marge) {
        rawData.marge = '0.00';
        this.msg = 'Max. Remise pour ce client  ! ' + this.v_marge + ' !!';
        this.op.show(document.getElementById(`row_${rawData.index}_marge`));
      } else {
        this.mouveToNext(`row_${id}_prix`);
        this.v_marge = remiseClt;
      }
    } else {
      this.ajout = true;
      this.msg = 'Remise doit etre un nombre postif';
      document.getElementById(`row_${id}`).scrollIntoView({
        inline: 'start',
        block: 'start',
      });
      this.op.show(e, document.getElementById(`row_${id}_remise`));
      this.ajout = false;
    }
  }

  async verifPrix(prix, rawData, e, id) {
    this.op.hide();
    this.wasInside = true;
    console.log('quantittttttteeee', rawData.qte, 'ggg');

    if (
      rawData.qte === null ||
      rawData.qte === undefined ||
      rawData.qte === '' ||
      Number(rawData.qte) === 0
    ) {
      this.msg = 'veuillez donner la quantite a commander !!';

      this.mouveToNext(`row_${rawData.index}_inputQte`);
      this.op.show(e, document.getElementById(`row_${rawData.index}_inputQte`));
    } else {
      if (prix !== null && prix !== undefined && Number(prix) > 0) {
        const prix_saisie = Number(prix);
        const qte = Number(rawData.qte);
        rawData = this.calculTotalPrix(prix_saisie, qte, rawData);
         this.disable = false;
        this.table.cancelRowEdit(rawData);
        this.affichValider = false;
      } else {
        this.affichValider = true;
        this.ajout = true;
        this.msg = 'veuillez donner le prix de cet article';
        document.getElementById(`row_${rawData.index}`).scrollIntoView({
          inline: 'start',
          block: 'start',
        });
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
    this.index = this.index + 1;
    const art = {
      index: String(this.index) ,
      id: this.selectedArticle.id,
      prix: Number(this.selectedArticle.prix).toFixed(3),
      code: this.selectedArticle.code,
      design: this.selectedArticle.design,
      quantite: this.selectedArticle.quantite,
      qte: null,
      marge: Number(this.selectedClient.marque).toFixed(2),
      tva: Number(this.selectedArticle.tva).toFixed(2),
      prixtot: null,
      numdev: null,
    };

    if (this.flag_exonor) {
      art.tva = '0.00';
    } else {
      art.tva = Number(this.selectedArticle.tva).toFixed(2);
    }

    const idQte = `row_${art.index}_inputQte`;
    if (this.selectedStock.length === 0) {

      await this.selectedStock.push(art);
      this.listeStockCMD = this.selectedStock;
      await this.table.initRowEdit(art);
      this.refArticle = this.selectedArticle.code;
      this.listeStocks = [this.selectedArticle];
      this.gridstock.refresh();
      if (
        document.getElementById(idQte) !== null &&
        document.getElementById(idQte) !== undefined
      ) {
        document.getElementById(idQte).focus();
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
          document
            .getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].index}`
            )
            .scrollIntoView({
              inline: 'start',
              block: 'start',
            });
          this.op.show(
            e,
            document.getElementById(
              `row_${this.selectedStock[this.selectedStock.length - 1].index}_qte`
            )
          );
          this.ajout = false;
          this.table.initRowEdit(art);
        } else {
          this.ajout = true;
          this.refArticle = this.selectedArticle.code;
          this.listeStocks = [this.selectedArticle];
          this.gridstock.refresh();
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

            await this.selectedStock.push(art);
            this.listeStockCMD = this.selectedStock;
            this.table.initRowEdit(art);
            this.disable = true;
            if (
              this.listeStockCMD.length >= 4 &&
              art.index !== null &&
              art.index !== undefined
            ) {
              console.log('id scrolll ', art.index);
              if (
                this.listeStockCMD[this.listeStockCMD.length - 1].index !== null &&
                this.listeStockCMD[this.listeStockCMD.length - 1].index !==
                  undefined
              ) {
                document.getElementById(`row_${this.listeStockCMD[this.listeStockCMD.length - 1].index}`).scrollIntoView({
                  inline: 'start',
                  block: 'start',
                });
              }
            }

            this.wasInside = true;

            this.refArticle = this.selectedArticle.code;
            this.listeStocks = [this.selectedArticle];
            this.gridstock.refresh();
            if (
              document.getElementById(idQte) !== null &&
              document.getElementById(idQte) !== undefined
            ) {
              document.getElementById(idQte).focus();
            }

          } else {
            // this.calculTotPrix = true;
            this.table.initRowEdit(cmd);
            this.msg =
              'Veuillez verifier cette ligne !! , cliquer sur Entrée pour continuer !!';
            this.table.initRowEdit(cmd);
            this.op.show(e, document.getElementById(`row_${cmd.index }`));
            if (
              document.getElementById(`row_${cmd.index }_inputQte`) !== null &&
              document.getElementById(`row_${cmd.index }_inputQte`) !== undefined
            ) {
              document.getElementById(`row_${cmd.index }_inputQte`).focus();
            }
          }
        }
      }
    }

    this.calculTotPrix = false;
    if (
      this.listeStockCMD.length >= 4 &&
      art.index  !== null &&
      art.index !== undefined
    ) {
      const id = this.listeStockCMD[this.listeStockCMD.length - 1].index ;
      this.ajout = true;
      if (
        this.listeStockCMD[this.listeStockCMD.length - 1].index  !== null &&
        this.listeStockCMD[this.listeStockCMD.length - 1].index  !== undefined
      ) {
        const idd = document.getElementById(`row_${id}`);
        if (idd !== null) {
          await document
            .getElementById(`row_${id}`)
            .scrollIntoView({ inline: 'start' });
        }
      }
    }
    if (idQte !== null && idQte !== undefined) {
      console.log('id qte ', idQte);

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
    this.disable = false;
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


  chargerPrixtot(rowdata) {
    rowdata.prixtot = null;
    /* if (rowdata.marge === null || rowdata.marge === '' || Number(rowdata.marge) === 0) {
      rowdata.marge = '0.00';
    }*/
    return rowdata;
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
