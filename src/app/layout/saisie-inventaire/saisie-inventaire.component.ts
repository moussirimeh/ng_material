import { formatDate } from '@angular/common';
import { Component, HostListener, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import {
  GridComponent,
  SearchSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { OverlayPanel } from 'primeng/primeng';
import { isEmpty } from 'rxjs/operators';
import { MouveinventService } from '../services/mouveinvent.service';
import { SteService } from '../services/ste.service';
import { Stock } from '../services/stock';
import { StockService } from '../services/stock.service';
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
  selector: 'app-saisie-inventaire',
  templateUrl: './saisie-inventaire.component.html',
  styleUrls: ['./saisie-inventaire.component.scss'],
})
export class SaisieInventaireComponent implements OnInit {
  public searchOptions: SearchSettingsModel;
  @ViewChild('op')
  public op: OverlayPanel;
  @ViewChild('ngSelectRef')
  public ngSelectRef: NgSelectComponent;
  readonly = false;
  btnaff = false;
  listeReference: any = [];
  SelectedRef: any = {};
  codeRef: string;
  emplacement = '';
  msg: string;
  qte = '0';
  libelle: any;
  date = new Date();
  liste: any;
  btnNon = false;
  btnYes = false;
  listeArticles: any;
  wasInside: any;
  dateServeur: Date;
  year: number;
  month: number;
  dateinvent: string;
  listefindcombine: any;
  rang: number;
  combine: string;
  rg: Object;
  invent: string;
  readonlylib = true;
  btnvalid = false;
  rechCode = '';
  @ViewChild('grid')
  public grid: GridComponent;
  disableGrid = false;
  constructor(
    private stockService: StockService,
    private steService: SteService,
    private mouveinventService: MouveinventService,
    private config: NgSelectConfig,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.op.hide();
    }
    this.wasInside = false;
  }
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    this.wasInside = true;
    this.op.hide();
    if (this.grid !== undefined) {
      if (this.grid.getRowInfo(event.target).rowData !== undefined) {
        this.grid.selectRows([this.grid.getRowInfo(event.target).rowIndex]);
        this.ajouterArt();
      }
    }
  }
  ngOnInit() {
    document.getElementById('rechCode').focus();
    // this.listeReference = new Array() ;
    // this.ngSelectRef.focus();
  }
  async changeReference() {
    if (this.SelectedRef !== null && this.SelectedRef !== undefined) {
      this.codeRef = this.SelectedRef.code;
      this.libelle = this.SelectedRef.design;
      this.btnaff = false;
      this.btnNon = false;
      this.btnYes = false;
      // this.btnaff = true ;
      console.log('stk ****', this.SelectedRef);
      await this.afficher();
      if (this.emplacement === '') {
        setTimeout(() => {
          document.getElementById('inputemp').focus();
        }, 100);
      } else {
        setTimeout(() => {
          document.getElementById('inputqte').focus();
        }, 100);
      }
    } else {
      this.codeRef = '';
    }
  }
  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    console.log('mot', mot);
    await this.stockService
      .getStockList(mot)
      .toPromise()
      .then((data) => {
        console.log('liste Article ', data);
        this.listeReference = data['_embedded'].stocks;
      });
    setTimeout(() => {
      document.getElementById('inputemp').focus();
    }, 100);
  }
  async fliterByCode(e) {
    console.log(e);
    //  this.listeStocks = new Array();
    console.log('mot', this.rechCode);
    await this.stockService
      .getStockList(this.rechCode)
      .toPromise()
      .then((data) => {
        console.log('liste Article ', data);
        this.listeReference = data['_embedded'].stocks;
      });
  }

  public onSearchReference(word: string, item: Stock): boolean {
    return item.code.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  PassQt() {
    setTimeout(() => {
      document.getElementById('inputqte').focus();
    }, 100);
  }
  Passvalid() {
    setTimeout(() => {
      document.getElementById('btn').focus();
    }, 100);
  }

  async afficher() {
    await this.steService
      .getDateServeur()
      .toPromise()
      .then((data: string) => (this.dateServeur = new Date(data)));
    this.year = this.dateServeur.getFullYear();
    this.month = this.dateServeur.getMonth() + 1;
    this.dateinvent = String(this.year).substring(2, 4);

    if (this.month === 1) {
      this.dateinvent = String(Number(this.dateinvent) - 1);
    }
    console.log('year ***** ' + String(this.year).length);
    console.log('dateinvent ***** ' + this.dateinvent);
    this.invent = 'INVENT' + this.dateinvent;
    console.log(
      'year ***' +
        this.year +
        'month*****' +
        this.month +
        'date sys ****' +
        this.date.toLocaleDateString()
    );
    this.btnaff = true;
    console.log('reference   ******* ', this.codeRef);
    await this.mouveinventService
      .getInvCombine(this.codeRef, this.invent)
      .toPromise()
      .then((data) => {
        console.log('liste des ref ', data);
        this.liste = data['_embedded'].stkinvCombines;
      });
    for (let i = 0; i < this.liste.length; i++) {
      this.liste[i].quantite = Number(this.liste[i].quantite).toFixed(0);
    }

    if (this.liste.length === 0) {
      this.btnNon = true;
    } else {
      this.btnYes = true;
    }
  }
  async valider(e) {
    if (this.SelectedRef.achat === null) {
      this.SelectedRef.achat = '';
    }
    console.log(
      'emplacement ******' + this.emplacement + 'qte******' + this.qte
    );
    console.log('emplacementt ******** ', this.emplacement);
    if (
      this.emplacement === null ||
      this.emplacement === undefined ||
      this.emplacement === '' ||
      this.qte === '0' ||
      this.qte === ''
    ) {
      if (
        this.emplacement === null ||
        this.emplacement === undefined ||
        this.emplacement === ''
      ) {
        this.wasInside = true;
        this.op.hide();
        this.msg = 'Veuillez saisir l\'emplacement avant de valider';
        this.op.show(e, document.getElementById('inputemp'));
      } else if (this.qte === '0' || this.qte === '') {
        this.wasInside = true;
        this.op.hide();
        this.msg = 'Veuillez saisir la quantité avant de valider';
        this.op.show(e, document.getElementById('inputqte'));
      }
    } else {
      this.btnvalid = true;

      this.combine = this.invent + ' ' + this.emplacement;
      console.log('combine ****', this.combine);

      await this.mouveinventService
        .findByCombine(this.combine)
        .toPromise()
        .then((data) => {
          console.log('liste inventaire ', data);
          this.listefindcombine = data['_embedded'].mouvesinvent;
        });
      if (this.listefindcombine.length !== 0) {
        await this.mouveinventService
          .getMaxrang(this.combine)
          .toPromise()
          .then((data) => {
            console.log('rang ******', data);
            this.rg = data;
          });
        this.rang = Number(this.rg) + 1;
      } else {
        this.rang = 1;
      } /*
      await this.mouveinventService
        .insertMouveInvent(
          this.combine,
          this.codeRef,
          this.qte,
          this.SelectedRef.achat,
          this.SelectedRef.prix,
          String(this.rang)
        )
        .toPromise()
        .then((data) => {
          console.log('insert  ******', data);
        });*/
        let dateServeur = new Date().toLocaleDateString('en-GB');
        await this.steService
      .getDateServeur()
      .toPromise()
      .then((dataa: string) => (dateServeur = dataa));
      const mouveInvent = {
        id: null,
        combine: this.combine,
        code: this.codeRef,
        quantite: this.qte,
        tRemise: '0',
        prix: this.SelectedRef.prix,
        date: formatDate(new Date(dateServeur), 'dd/MM/yyyy HH:mm:ss.SSS', this.locale),
        operateur: null,
        sens: 'D',
        tauxTva: '0',
        base: '0',
        achat:  this.SelectedRef.achat,
        codeAimprimer: null,
        rang: String(this.rang),
        numbc: null,
        autPrix: null,
        totalBrut: null,
        qtEnt: null,
        prixArt: null,
        qtOffre: null,
        designation: null,
      };
      await this.mouveinventService
        .createMouveInvent(mouveInvent)
        .toPromise()
        .then((data) => {
          console.log('insert  ******', data);
        });
      this.initialiser();
    }
  }

  initialiser() {
    this.btnvalid = false;
    this.btnNon = false;
    this.btnYes = false;
    this.btnaff = false;
    this.codeRef = '';
    // this.emplacement = '' ;
    this.libelle = '';
    this.rang = 0;
    this.qte = '0';
    this.liste = new Array();
    this.msg = '';
    this.SelectedRef = new Array();
    this.listeReference = [];
    this.wasInside = true;
    this.op.hide();
    this.disableGrid = false;
    document.getElementById('rechCode').focus();
  }

  selectArt(e) {
    console.log(e);

    this.SelectedRef = this.listeReference.find((art) => art.code === e.code);
    this.changeReference();
  }
  Onkey(filterValue: string) {
    this.rechCode = filterValue;
  }
  ajouterArt(): void {
    const selected: any = this.grid.getSelectedRecords()[0];
    this.SelectedRef = selected;
    this.changeReference();
    /*setTimeout(() => {
      document.getElementById('inputemp').focus();
    }, 10);*/
    this.disableGrid = true;
  }
  annulerSelection(): void {
    if (this.grid.getSelectedRowIndexes()[0] >= 0) {
      this.grid.selectRows([]);
    }
  }
  public dataBound(args): void {
    if (this.listeReference.length > 0) {
      this.grid.selectRows([0]);
    }
  }
}
