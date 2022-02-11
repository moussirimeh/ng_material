import { Component, OnInit, ViewChild, Input, Output, HostListener } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ExcelExportProperties,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { OverlayPanel } from 'primeng/primeng';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Stock } from '../services/stock';
import { Fournisseur } from '../services/Fournisseur';
import { Famille } from '../services/famille';
import { Sfamille } from '../services/sfamille';
import { StockService } from '../services/stock.service';
import { ClientService } from '../services/client.service';
import { EdevisService } from '../services/edevis.service';
import { DdevisService } from '../services/ddevis.service';
import { FournisseurService } from '../services/fournisseur.service';
import { FamilleService } from '../services/famille.service';
import { SfamilleService } from '../services/sfamille.service';
import { ExcelService } from '../services/excel.service';

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
  selector: 'app-offre-article',
  templateUrl: './offre-article.component.html',
  styleUrls: ['./offre-article.component.scss'],
  providers: [ExcelService]
})
export class OffreArticleComponent implements OnInit {
  @ViewChild('grid1')
  public grid1: GridComponent;
  @ViewChild('grid2')
  public grid2: GridComponent;
  @ViewChild('grid3')
  public grid3: GridComponent;
  @ViewChild('grid4')
  public grid4: GridComponent;
  from = new Date();
  to = new Date();
  date1: any;
  date2 = '';
  datedeb: any;
  datefin = '';
  validedate = true;
  articles = [];
  clients = [];
  offres = [];
  detailsOffre = [];
  selectedArticle: boolean;
  selectedClient: boolean;
  selectedArtc: number;
  selectedClt: number;
  selectedOffre: boolean;
  selectedOfr;
  article;
  selectedFournisseur = null;
  selectedFamille = null;
  selectedSfamille = null;
  searchArticle = null;
  familles: Famille[];
  sfamilles: Sfamille[];
  fournisseurs: Fournisseur[];
  searchArticles;
  saisieShow: boolean;
  ngselectDisabled = true;
  rechCodeArt = null;
  tn: any;
  articlesToExport;
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
  @HostListener('document:click')
  clickout() {
    if (!this.wasInside) {
      this.ov.hide();
    }
    this.wasInside = false;
  }

  constructor(
    private clientService: ClientService,
    private edevisService: EdevisService,
    private ddevisService: DdevisService,
    private fourService: FournisseurService,
    private familleService: FamilleService,
    private sfamilleService: SfamilleService,
    private stockService: StockService,
    private excelService: ExcelService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
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
        'Samedi'
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
        'Decembre'
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
        'Dec'
      ],
      today: 'Ajourd\'hui',
      clear: 'Annuler',
      dateFormat: 'dd/mm/yyyy'
    };
    this.saisieShow = false;
    this.selectedArtc = null;
    this.selectedClt = null;
    this.selectedOfr = null;
    this.selectedArticle = false;
    this.selectedClient = false;
    this.selectedOffre = false;
    this.reloadDataFour();
    this.reloadDataFamille();
    this.reloadDataSfamille();
  }
  async reloadDataFour() {
    await this.fourService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.fournisseurs = data['_embedded'].fournisseurs;
      });
  }
  async reloadDataFamille() {
    await this.familleService
      .getFamillesByOrderByNom()
      .toPromise()
      .then((data) => {
        this.familles = data['_embedded'].familles;
      });
  }
  async reloadDataSfamille() {
    await this.sfamilleService
      .getSousFamillesByOrderByNom()
      .toPromise()
      .then((data) => {
        this.sfamilles = data['_embedded'].sfamilles;
      });
  }

  public onSearchFournisseur(word: string, item: Fournisseur): boolean {
    return item.deno.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchFamille(word: string, item: Famille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  public onSearchSfamille(word: string, item: Sfamille): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }

  excelExport1(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid1.excelExport(excelExportProperties);
    const exportExcel = this.articles.map(obj => {
      return {
        'Code ARTICLE': obj.code,
        'Denomination': obj.deno,
        'QTE': Number(obj.quantite),
        'QTE SATISF': Number(obj.qtSatisf),
        'MNT TTC': Number(obj.net).toFixed(3),
        'MNT STF TTC': Number(obj.satisf).toFixed(3),
        '%': Number(obj.pourc).toFixed(2),
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      fileName
    );
  }
  excelExport2(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid2.excelExport(excelExportProperties);
    const exportExcel = this.clients.map(obj => {
      return {
        'Code Client': obj.code,
        'Libelle Client': obj.deno,
        'MNT TTC': Number(obj.net),
        'MNT STF TTC': Number(obj.satisf),
        '%': Number(obj.pourc),
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      fileName
    );
  }
  excelExport3(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid3.excelExport(excelExportProperties);
    const exportExcel = this.offres.map(obj => {
      return {
        'N° Offre': obj.combine,
        'Date Offre': obj.datDev,
        'MNT TTC': Number(obj.net),
        'MNT STF TTC': Number(obj.satisf),
        '%': Number(obj.pourc),
        'Vendeur': obj.deno,
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      fileName
    );
  }
  excelExport4(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid4.excelExport(excelExportProperties);
    const exportExcel = this.detailsOffre.map(obj => {
      return {
        'REFERENCE': obj.code,
        'DESIGNATION': obj.design,
        'QTE': Number(obj.quantite),
        'REMISE': Number(obj.tRemise),
        'PRIX U. HT': Number(obj.prix),
        'TVA': Number(obj.tauxTva),
        'QTE STF': Number(obj.qtSatisf),
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      fileName
    );
  }
  async consulterArticle(e) {
    this.grid1.selectRows([this.selectedArtc]);
    this.article = e.rowData;
    await this.clientService
      .listClientsArticle(e.rowData.code)
      .toPromise()
      .then((data) => {
        this.selectedArticle = true;
        this.selectedClient = false;
        this.selectedOffre = false;
        this.clients = data['_embedded'].offreClients;
        this.clients.map(el => {
          el.net = Number(el.net).toFixed(3);
          el.satisf = Number(el.satisf).toFixed(3);
          el.pourc = Number(el.pourc).toFixed(2);
        });
        this.clients = this.clients.filter(el => el.net > 0);
      });
    this.grid1.selectRows([this.selectedArtc]);
  }
  async consulterClient(e) {
    this.grid2.selectRows([this.selectedClt]);
    await this.edevisService
      .listDetailOfrCltArticle(e.rowData.code, this.article.code)
      .toPromise()
      .then((data) => {
        this.selectedClient = true;
        this.selectedOffre = false;
        this.offres = data['_embedded'].detailOffreClients;
        this.offres.map(el => {
          const dateString: string = el.datDev;
          el.datDev = String(dateString).substring(0, 10);
          el.net = Number(el.net).toFixed(3);
          el.satisf = Number(el.satisf).toFixed(3);
          el.net ? Number(el.net) !== 0 ? el.pourc = Number(el.satisf) / Number(el.net) * 100 : el.pourc = 0 : el.pourc = 0 ;
          el.pourc = Number(el.pourc).toFixed(2);
        });
      });
    this.grid2.selectRows([this.selectedClt]);
  }
  async consulterOffre(e) {
    const combine: string = e.rowData.combine;
    this.grid3.selectRows([this.selectedOfr]);
    await this.ddevisService
      .getDdevisByCombineCodeArtc(combine, this.article.code)
      .toPromise()
      .then((data) => {
        this.selectedOffre = true;
        this.detailsOffre = data['_embedded'].ddevis;
        this.detailsOffre.map(el => {
          el.quantite = Number(el.quantite);
          el.tRemise = Number(el.tRemise);
          el.prix = Number(el.prix).toFixed(3);
          el.tauxTva = Number(el.tauxTva);
          el.qtSatisf = Number(el.qtSatisf);
        });
      });
    this.grid3.selectRows([this.selectedOfr]);
  }

  rowSelectedArticle(args) {
    if (this.grid1.getSelectedRowIndexes()[0] >= 0) {
      this.selectedArtc = args.rowIndex;
    }
  }

  rowSelectedClient(args) {
    if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
      this.selectedClt = args.rowIndex;
    }
  }

  rowSelectedOffre(args) {
    if (this.grid3.getSelectedRowIndexes()[0] >= 0) {
      this.selectedOfr = args.rowIndex;
    }
  }
  annulerSelectionArticle() {
    this.selectedArticle = false;
    this.selectedClient = false;
    this.selectedOffre = false;
    this.selectedClt = null;
    this.selectedOfr = null;
    this.clients = [];
    this.offres = [];
    this.detailsOffre = [];
  }
  annulerSelectionClient() {
    this.selectedClient = false;
    this.selectedOffre = false;
    this.selectedOfr = null;
    this.offres = [];
    this.detailsOffre = [];
  }
  annulerSelectionOffre() {
    this.selectedOffre = false;
    this.detailsOffre = [];
  }

  public onSearchArtParCode(word: string): Stock[] {
    if (word === null || word === undefined || word.length === 0) {
      this.searchArticles = null;
    } else {this.stockService.getStockList(word).toPromise()
       .then(data => {
         this.searchArticles  = data['_embedded'].stocks;
       });
       return (this.searchArticles); }
   }

   initialiser(e) {
    this.ngselectDisabled = false;
    this.saisieShow = false;
    this.articles = [];
    this.selectedFamille = null;
    this.selectedSfamille = null;
    this.selectedFournisseur = null;
    this.rechCodeArt = null;
    this.searchArticles = null;

    this.selectedArticle = false;
    this.selectedClient = false;
    this.selectedOffre = false;
    this.selectedArtc = null;
    this.selectedClt = null;
    this.selectedOfr = null;
    this.clients = [];
    this.offres = [];
    this.detailsOffre = [];
  }

  introduire(e) {
    this.ngselectDisabled = false;
    this.saisieShow = false;
    this.searchArticles = null;
    this.articles = [];
    this.selectedArticle = false;
    this.selectedClient = false;
    this.selectedOffre = false;
    this.selectedArtc = null;
    this.selectedClt = null;
    this.selectedOfr = null;
    this.clients = [];
    this.offres = [];
    this.detailsOffre = [];
  }

  async valider(e) {
    this.wasInside = true;
    this.ov.hide();
    this.ngselectDisabled = true;
    if (this.selectedSfamille === null) {
      this.selectedSfamille = '';
    }
    if (this.selectedFamille === null) {
      this.selectedFamille = '';
    }
    if (this.selectedFournisseur === null) {
      this.selectedFournisseur = '';
    }
    if (this.rechCodeArt === null || this.rechCodeArt === undefined
      || this.rechCodeArt.code === null || this.rechCodeArt.code === undefined) {
      this.rechCodeArt = '';
    } else {
      this.rechCodeArt = this.rechCodeArt.code;
    }
    this.validedate = true;
    if (this.to > new Date()) {
      this.validedate = false;
      this.msgs = 'Date invalide!!';
      this.ov.show(e, document.getElementById('date'));
    }
    if (this.validedate === true) {
      this.datedeb = this.from.toLocaleDateString('en-GB');
      this.datefin = this.to.toLocaleDateString('en-GB');
      this.date1 = this.from.toLocaleDateString('en-GB') + ' 00:00:00';
      this.date2 = this.to.toLocaleDateString('en-GB') + ' 23:59:00';
      await this.ddevisService
        .listOffresArticleFiltreDate(this.selectedFournisseur, this.selectedFamille, this.selectedSfamille, this.rechCodeArt, this.date1, this.date2)
        .toPromise()
        .then((data) => {
          if (data['_embedded'].offres.length > 500) {
            this.msgs = 'veuillez raffiner les critères de recherche !';
            this.styleOvPanel = this.styleOvPanelError;
            this.ov.show(e, document.getElementById('btValider'));
          } else {
            if (data['_embedded'].offres.length > 0) {
              this.articles = data['_embedded'].offres;
              // this.clients.unshift(this.selectedClient);
              this.articles.map(el => {
                el.quantite = Number(el.quantite);
                el.qtSatisf = Number(el.qtSatisf);
                el.net = Number(el.net).toFixed(3);
                el.satisf = Number(el.satisf).toFixed(3);
                el.pourc = Number(el.pourc).toFixed(2);
              });
              this.saisieShow = true;
            } else {
              this.msgs = 'Aucune article trouvée !';
              this.styleOvPanel = this.styleOvPanelError;
              this.ov.show(e, document.getElementById('btValider'));
            }
          }
        })
        .catch((data) => {
          console.log('error get clients');
        });
    }
  }

  async excel(e) {
await this.ddevisService
      .listOffresArticle()
      .toPromise()
      .then((data) => {
        this.articlesToExport = data['_embedded'].offres;
        // this.clients.unshift(this.selectedClient);
        this.articlesToExport.map(el => {
          el.quantite = Number(el.quantite);
          el.qtSatisf = Number(el.qtSatisf);
          el.net = Number(el.net).toFixed(3);
          el.satisf = Number(el.satisf).toFixed(3);
          el.pourc = Number(el.pourc).toFixed(2);
        });
      })
      .catch((data) => {
        console.log('error get clients');
      });

                const exportExcel = this.articlesToExport.map(obj => {
                  return {
                    'Code': obj.code,
                    'Désignation': obj.deno,
                    'Qte': obj.quantite,
                    'Qte Satisf': obj.qtSatisf,
                    'Net': obj.net,
                    'Satisf': obj.satisf,
                    'Pourc': obj.pourc
                  };
                });
                this.excelService.exportAsExcelFile(
                  exportExcel,
                  ' offres/article : ' + new Date().toLocaleDateString('en-GB')
                );
       }

}
