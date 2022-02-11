import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import { NgSelectComponent, NgSelectConfig } from '@ng-select/ng-select';
import { GridComponent } from '@syncfusion/ej2-angular-grids';
import { StockService } from '../services/stock.service';
import { MouveinventService } from '../services/mouveinvent.service';
import { SteService } from '../services/ste.service';
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
  selector: 'app-consultationreference',
  templateUrl: './consultationreference.component.html',
  styleUrls: ['./consultationreference.component.scss'],
})
export class ConsultationreferenceComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  @ViewChild('gridStock')
  public gridStock: GridComponent;
  @ViewChild('ngselectRef')
  public ngselectRef: NgSelectComponent;
  listeArticles = new Array();
  listeReference = [];
  Quantite_Stock = '0';
  Quantite_Inv = '0';

  datasourceGrid: any[];
  coderef = '';
  invent: string;
  desgin_art = '';
  selected_art: any;
  liste: any;
  readonly = false;
  btnaff = false;
  btnNon = false;
  btnYes = false;
  dateServeur: Date;
  year: number;
  month: number;
  dateinvent: string;
  disableGrid = false;
  rechCode = '';

  listee: any;
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.gridStock !== undefined) {
      if (this.gridStock.getRowInfo(event.target).rowData !== undefined) {
        this.gridStock.selectRows([this.gridStock.getRowInfo(event.target).rowIndex]);
        this.afficherDetails();
      }
    }
  }
  constructor(
    private config: NgSelectConfig,
    private mouveinventService: MouveinventService,
    private steService: SteService,
    private stockService: StockService
  ) {
    this.config.notFoundText = 'Aucun élement trouvé';
    this.config.clearAllText = 'Supprimer tous ';
  }
  async rechArticle(mot) {
    //  this.listeStocks = new Array();
    console.log('mot', mot);
    await this.mouveinventService
      .getListeArticlesInvent(mot)
      .toPromise()
      .then((data: any) => {
        const artsTemp = [];
        for (const art of data) {
          artsTemp.push({
            code: art[0],
            design: art[1],
            qteEnStock: art[2],
            qteInvent: art[3],
          });
        }
        this.listeReference = artsTemp;
      });
  }

  changeArticle() {
    if (this.selected_art !== null && this.selected_art !== undefined) {
      this.coderef = this.selected_art.code;
      console.log('****ref *******', this.coderef);

      this.desgin_art = this.selected_art.design;
      this.Quantite_Stock = this.selected_art.quantite;
      this.btnaff = false;
      this.afficher();
      this.btnNon = false;
      this.btnYes = false;
    } else {
      this.coderef = '';
      this.desgin_art = '';
      this.Quantite_Stock = '';
    }
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
    this.invent = 'INVENT' + this.dateinvent;
    this.btnaff = true;
    console.log('reference   ******* ', this.coderef);
    console.log('dateinv   ******* ', this.dateinvent);

    await this.mouveinventService
      .getInvCombine(this.coderef, this.invent)
      .toPromise()
      .then((data) => {
        console.log('liste des ref ', data);
        this.liste = data['_embedded'].stkinvCombines;
      });
    for (let i = 0; i < this.liste.length; i++) {
      this.liste[i].quantite = Number(this.liste[i].quantite).toFixed(0);
    }
    console.log('sum de Quantite  ******* ', this.coderef);
    await this.mouveinventService
      .getInvCode(this.coderef, this.invent)
      .toPromise()
      .then((data) => {
        console.log('sum qte  ', data);
        this.listee = data['_embedded'].stkinvQuantites;
        console.log('sum qte  ', this.listee);
      });
    this.Quantite_Inv = Number(this.listee[0].qt).toFixed(0);
    //

    // this.Quantite_Stock =   this.selected_art.quantite;

    if (this.liste.length === 0) {
      this.btnYes = true;
    } else {
      this.btnNon = true;
    }
  }
  ngOnInit() {
    this.listeArticles = new Array();
    this.Quantite_Inv = '';
    document.getElementById('rechCode').focus();
  }
  annulerSelection(): void {
    if (this.gridStock.getSelectedRowIndexes()[0] >= 0) {
      this.gridStock.selectRows([]);
      this.btnaff = false;
      this.btnYes = false;
      this.btnNon = false;
    }
  }
  public dataBound(args): void {
    if (this.listeReference.length > 0) {
      this.gridStock.selectRows([0]);
    }
  }
  afficherDetails() {
    const selected: any = this.gridStock.getSelectedRecords()[0];
    console.log(selected);
    this.coderef = selected.code;
    console.log('****ref *******', this.coderef);

    this.desgin_art = selected.design;
    this.Quantite_Stock = selected.quantite;
    this.btnaff = false;
    this.afficher();
    this.btnNon = false;
    this.btnYes = false;
  }
}
