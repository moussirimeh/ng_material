

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
/** Hack: align header */
ScrollableView.prototype.ngAfterViewChecked = function () {
  if (!this.initialized && this.el.nativeElement.offsetParent) {
    // this.alignScrollBar();
    this.initialized = true;

    new ResizeObserver((entries) => {
      // for (let entry of entries)
      this.alignScrollBar();
    }).observe(this.scrollBodyViewChild.nativeElement);
  }
};

@Component({
    selector: 'app-annulation-cmd-clt',
    templateUrl: './annulation-cmd-clt.component.html',
    styleUrls: ['./annulation-cmd-clt.component.scss'],
  providers: [ToolbarService, ResizeService, ConfirmationService],
  encapsulation: ViewEncapsulation.None,
})

export class AnnulationCmdCltComponent implements OnInit {
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
  blockedDocument = false;
  constructor(
    private loginService: LoginService,
    private config: NgSelectConfig,
    private clientService: ClientService,
    private stockService: StockService,
    private vendeur1Service: Vendeur1Service,
    private confirmationService: ConfirmationService,
    private ecomService: EcomService,
    private dcomService: DcomService,

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
        });
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
        livre: Number(obj.livre).toFixed(2),

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




  annulerCMD(e) {
    this.disable = false;
    this.dated = null;
    this.readonly = false;
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
    this.ref = null;
  }


  async rowSelected(e) {
    if (this.gridstock.getSelectedRowIndexes()[0] >= 0) {
      const selected: any = this.gridstock.getSelectedRecords()[0];
      this.selectedArticle = selected;
      console.log('selected art ', this.selectedArticle);
    }
  }









  async validationCmd(e) {

      this.annulerCMD(e);

  }

  valider(e) {
    console.log('numero commande *************', this.refCmd );
    const ref = this.refCmd;

    this.totaliser(e, this.listeStockCMD);
    this.confirmationService.confirm({
      message: ' Voulez vous vraiment annuler la commande  !!',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'OK',
      rejectLabel: 'Annuler',
      accept: async () => {
        this.blockedDocument = true;
        await this.dcomService.deleteDcom(this.refCmd).toPromise().then(data => {
          console.log('delete ===== dcom ', data);
        });

        await this.ecomService.deleteEcom(this.ecom.id).toPromise().then(data => {
          console.log('delete ===== ecom ', data);
        });

        await this.validationCmd(e);
        this.loginService
        .procedureStockeModule(
          localStorage.getItem('login'),
          globals.selectedMenu,
          'Num ' + ref
        )
        .subscribe((data) => {
          console.log(data);
        });
        this.blockedDocument = false;
      },
      reject: () => {
        this.annulerCMD(e);
      },
    });
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

  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }
}


