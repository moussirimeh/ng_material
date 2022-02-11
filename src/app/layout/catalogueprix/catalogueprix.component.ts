import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Stock } from '../services/stock';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/Fournisseur';
import { FamilleService } from '../services/famille.service';
import { SfamilleService } from '../services/sfamille.service';
import { MarqueService } from '../services/marque.service';
import { Famille } from '../services/famille';
import { Sfamille } from '../services/sfamille';
import { Marque } from '../services/marque';
import { Catalogue } from '../services/catalogue';
import { CatalogueService } from '../services/catalogue.service';
import * as jspdf from 'jspdf';
import {
  ToolbarService,
  PageService,
  ExcelExportService,
  PdfExportService,
  GroupService,
  ExcelExportProperties,
  GridComponent,
  SearchSettingsModel,
  SelectionSettingsModel,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { Dialog, OverlayPanel } from 'primeng/primeng';
import { ExcelService } from '../services/excel.service';
import { DemandeProformaComponent } from '../demande-proforma/demande-proforma.component';
import { NgSelectConfig } from '@ng-select/ng-select';
import { setCulture, L10n } from '@syncfusion/ej2-base';
import { globals } from 'src/environments/environment';
setCulture('de-DE');
L10n.load({
  'de-DE': {
    grid: {
      EmptyRecord: [],
    },
  },
});
@Component({
  selector: 'app-catalogueprix',
  templateUrl: './catalogueprix.component.html',
  styleUrls: ['./catalogueprix.component.scss'],
  providers: [
    ToolbarService,
    PageService,
    ExcelExportService,
    PdfExportService,
    GroupService,
    ExcelService,
  ],
})
export class CatalogueprixComponent implements OnInit {
  @ViewChild(DemandeProformaComponent) demandeProformat;
  public searchOptions: SearchSettingsModel;
  public selectionOptions: SelectionSettingsModel;
  @ViewChild('grid')
  public grid: GridComponent;
  stock = 'disponible';
  trier = 'fourAndDesign';
  article = 'tout';
  rechDesign = '';
  rechCode = '';
  public wrapSettings: TextWrapSettingsModel;
  public toolbar: string[];
  ngselectDisabled = true;
  stocks: Stock[];
  catalogues: Catalogue[] = [];
  cataloguees: Catalogue[] = [];
  familles: Famille[];
  sfamilles: Sfamille[];
  marques: Marque[];

  fournisseurs: Fournisseur[];
  selectedFournisseur = null;

  selectedFamille = null;
  selectedSfamille = null;
  selectedMarque = null;
  saisieCardShow = false;
  validerShow = false;
  fourChecked = false;
  displayProformat = false;
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
    private catalogueService: CatalogueService,
    private fourService: FournisseurService,
    private familleService: FamilleService,
    private sfamilleService: SfamilleService,
    private marqueService: MarqueService,
    private excelService: ExcelService,
    private config: NgSelectConfig
  ) {
    this.config.notFoundText = 'Aucun élément trouvé';
    this.config.clearAllText = 'Supprimer tous';
  }

  ngOnInit() {
    this.wrapSettings = { wrapMode: 'Content' };
    this.selectionOptions = {
      type: 'Multiple',
      enableSimpleMultiRowSelection: true,
    };
    this.toolbar = ['Search'];
    this.reloadDataFour();
    this.reloadDataFamille();
    this.reloadDataSfamille();
    this.reloadDataMarque();
  }

  async reloadDataMarque() {
    await this.marqueService
      .getMarquesByOrderByNom()
      .toPromise()
      .then((data) => {
        this.marques = data['_embedded'].marques;
        console.log('okk');
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
  async reloadDataFour() {
    await this.fourService
      .getFournisseurListByOrderByDeno()
      .toPromise()
      .then((data) => {
        this.fournisseurs = data['_embedded'].fournisseurs;
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
  public onSearchMarque(word: string, item: Marque): boolean {
    return item.nom.toLocaleLowerCase().startsWith(word.toLocaleLowerCase());
  }
  /*
  async applyFilterArtParDeno(filterValue: string) {
    await this.fourService
      .getFourListe(filterValue)
      .toPromise()
      .then((data) => {
        this.fournisseurs = data['_embedded'].fournisseurs;
      });
  }
  async applyFilterArtParFamille(filterValue: string) {
    await this.familleService
      .getFamilleByNom(filterValue)
      .toPromise()
      .then((data) => {
        this.familles = data['_embedded'].familles;
      });
  }
  async applyFilterArtParMarque(filterValue: string) {
    await this.marqueService
      .getMarqueByNom(filterValue)
      .toPromise()
      .then((data) => {
        this.marques = data['_embedded'].marques;
      });
  }
  async applyFilterArtParSfamille(filterValue: string) {
    await this.sfamilleService
      .getSfamilleByNom(filterValue)
      .toPromise()
      .then((data) => {
        this.sfamilles = data['_embedded'].sfamilles;
      });
  }
*/
  applyFilterDesign() {
    this.searchOptions = {
      fields: ['design'],
      operator: 'startswith',
      key: this.rechDesign,
      ignoreCase: true,
    };
  }
  applyFilterCode() {
    this.searchOptions = {
      fields: ['code'],
      operator: 'startswith',
      key: this.rechCode,
      ignoreCase: true,
    };
  }
  introdure(): void {
    this.ngselectDisabled = false;
    this.stock = 'disponible';

    this.trier = 'fourAndDesign';

    this.article = 'tout';

    this.saisieCardShow = false;
    this.catalogues = [];

    this.selectedFamille = null;

    this.selectedSfamille = null;
    this.selectedMarque = null;
    this.selectedFournisseur = null;
    this.rechCode = '';
    this.rechDesign = '';
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
    if (this.selectedMarque === null) {
      this.selectedMarque = '';
    }

    if (
      this.selectedFournisseur !== '' ||
      this.selectedFamille !== '' ||
      this.selectedSfamille !== '' ||
      this.selectedMarque !== ''
    ) {
      await this.afficher();
      if (this.catalogues.length > 0) {
        this.saisieCardShow = true;
      } else {
        this.msgs = 'Aucune article trouvée !';
        this.styleOvPanel = this.styleOvPanelError;
        this.ov.show(e, document.getElementById('btValider'));
      }
    } else {
      this.msgs = 'Il faut selectionner au moins un critère !';
      this.styleOvPanel = this.styleOvPanelError;
      this.ov.show(e, document.getElementById('btValider'));
    }


    // this.selectedFamille = null;
    // this.selectedSfamille = null;
    // this.selectedMarque = null;
    // this.selectedFournisseur = null;
  }

  async afficher() {
    if (this.selectedSfamille === null) {
      this.selectedSfamille = '';
    }
    if (this.selectedFamille === null) {
      this.selectedFamille = '';
    }
    if (this.selectedFournisseur === null) {
      this.selectedFournisseur = '';
    }
    if (this.selectedMarque === null) {
      this.selectedMarque = '';
    }
    if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'tout' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByCode(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'null' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNull(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'disponible' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByCodeStockDispo(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'alerte' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByCodeStockAlerte(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'negatif' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNegatif(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'tout' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByCodeNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'tout' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByCodeEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'null' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNullEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'null' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNullNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'disponible' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockDispoEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'disponible' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockDispoNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'alerte' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockAlerteEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'alerte' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockAlerteNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'negatif' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNegatifEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'code' || this.trier === 'fourAndCode') &&
      this.stock === 'negatif' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNegatifNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'tout' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByDesign(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'null' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByDesignStockNull(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'disponible' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByDesignStockDispo(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'alerte' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByDesignStockAlerte(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'negatif' &&
      this.article === 'tout'
    ) {
      await this.catalogueService
        .catalogueByDesignStockNegatif(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'tout' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByDesignNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'tout' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByDesignEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'null' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByCodeStockNullEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'null' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockNullNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'disponible' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockDispoEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'disponible' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockDispoNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'alerte' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockAlerteEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'alerte' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockAlerteNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'negatif' &&
      this.article === 'encommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockNegatifEnCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    } else if (
      (this.trier === 'design' || this.trier === 'fourAndDesign') &&
      this.stock === 'negatif' &&
      this.article === 'noncommande'
    ) {
      await this.catalogueService
        .catalogueByDesignStockNegatifNonCommande(
          this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque
        )
        .toPromise()
        .then((data) => {
          this.catalogues = data['_embedded'].catalogues;
        });
    }
    let cataloguesTmp = [];
    if (this.trier === 'fourAndCode') {
      cataloguesTmp = this.catalogues.sort(function (catg1, catg2) {
        if (catg1.fournisseur > catg2.fournisseur) {
          return 1;
        }
        if (catg1.fournisseur < catg2.fournisseur) {
          return -1;
        }

        if (catg1.code > catg2.code) {
          return 1;
        }
        if (catg1.code < catg2.code) {
          return -1;
        }
      });
      this.catalogues = cataloguesTmp;
    }
    if (this.trier === 'fourAndDesign') {
      cataloguesTmp = this.catalogues.sort(function (catg1, catg2) {
        if (catg1.fournisseur > catg2.fournisseur) {
          return 1;
        }
        if (catg1.fournisseur < catg2.fournisseur) {
          return -1;
        }
        if (catg1.design > catg2.design) {
          return 1;
        }
        if (catg1.design < catg2.design) {
          return -1;
        }
      });
      this.catalogues = cataloguesTmp;
    }
  }

  btnClicked(args): void {
    const excelExportProperties: ExcelExportProperties = {
      fileName: 'cataloguePrix.xlsx',
    };
    this.grid.excelExport(excelExportProperties);
  }
  async genererExcel(e) {
    if (!this.saisieCardShow) {
      await this.afficher();
    }
        if (this.catalogues.length !== 0) {
        const exportExcel = this.catalogues.map((obj) => {
          return {
            'Référence': obj.code,
            'Désignation': obj.design,
            'Quantité': obj.quantite,
            'Com': obj.com,
            'Prix HT': obj.prix,
            'TTC': obj.ttc,
            'TVA': obj.tva,
          };
        });
        this.excelService.exportAsExcelFile(
          exportExcel,
          'Catalogue de prix'
        ); }
  }
  async visualiser(e) {
    if (!this.saisieCardShow) {
      await this.afficher();
    }
    if (this.catalogues.length > 0) {
      console.log(this.catalogues);
      const displayDate = new Date().toLocaleDateString('en-GB');
      const displayTime = new Date().toLocaleTimeString();
      const doc1 = new jspdf();
      // page a4 (210 x 297 mm)
      let numPage = 1;
      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.text('SOCIETE  :   ' + globals.societe, 10, 10);
      doc1.text(
        'Tunis le : ' +
          displayDate +
          ' à ' +
          displayTime,
        200,
        10,
        'right'
      );

      doc1.setFontSize(18);
      doc1.setFontStyle('arial');
      doc1.text('Catalogue Des Prix', 80, 25);

      doc1.setFontSize(10);
      doc1.setFontStyle('arial');
      doc1.setFontStyle('bold');
      doc1.text('Fournisseur  : ', 5, 35);
      doc1.text('Famille          : ', 5, 40);
      doc1.text('Sous Famille : ', 5, 45);
      doc1.text('Marque         : ', 5, 50);
      doc1.setFontStyle('normal');
      if (this.selectedFournisseur !== null && this.selectedFournisseur !== '') {
      const four = this.fournisseurs.find(e => e.code === this.selectedFournisseur);
      doc1.text(
        four.deno,
        30,
        35
      );
    } else {
      doc1.text(
        'Global',
        30,
        35
      );
    }

    if (this.selectedFamille !== null && this.selectedFamille !== '') {
      const famille = this.familles.find(e => e.code === this.selectedFamille);
      doc1.text(
        famille.nom,
        30,
        40
      );
    } else {
      doc1.text(
        'Global',
        30,
        40
      );
    }

    if (this.selectedSfamille !== null && this.selectedSfamille !== '') {
      const sfamille = this.sfamilles.find(e => e.code === this.selectedSfamille);
      doc1.text(
        sfamille.nom,
        30,
        45
      );
    } else {
      doc1.text(
        'Global',
        30,
        45
      );
      }
      if (this.selectedMarque !== null && this.selectedMarque !== '') {
        const marque = this.marques.find(e => e.code === this.selectedMarque);
        doc1.text(
          marque.nom,
          30,
          50
        );
      } else {
        doc1.text(
          'Global',
          30,
          50
        );
        }
      doc1.setFontSize(9);
      doc1.line(5, 55, 205, 55);
      // ligne Horizontal doc1.line(x1,y1,x2,y2)
      doc1.setFontStyle('bold');
      doc1.text('Référence', 6, 59);
      doc1.text('Désignation', 50, 59);
      doc1.text('Quantité', 110, 59);
      doc1.text('Commandée', 130, 59);
      doc1.text('Prix HT', 153, 59);
      doc1.text('Prix TTC', 173, 59);
      doc1.text('TVA %', 193, 59);
      doc1.line(5, 61, 205, 61);
      doc1.setFontStyle('normal');
      // fin entete
      // corps
      let y = 65;
      doc1.setFontSize(9);
      for (const catalog of this.catalogues) {
        doc1.text(catalog.code, 6, y);
        doc1.text(catalog.design, 50, y);
        doc1.text(catalog.quantite, 120, y, 'right');
        doc1.text(catalog.com, 140, y, 'right');
        doc1.text(String(catalog.prix), 165, y, 'right');
        doc1.text(String(catalog.ttc), 187, y, 'right');
        doc1.text(catalog.tva, 200, y, 'right');
        doc1.line(5, y + 2, 205, y + 2, 'FD');
        y = y + 6;
        if (y > 277) {
          if (numPage > 1) {
            doc1.line(5, 15, 5, 279, 'FD');
            doc1.line(205, 15, 205, 279, 'FD');
          } else {
            doc1.line(5, 55, 5, 277, 'FD');
            doc1.line(205, 55, 205, 277, 'FD');
          }
          // doc1.setFontSize(9);
          doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
          numPage++;
          doc1.addPage();
          y = 15;
          doc1.line(5, y, 205, y);
          y = y + 4;
          doc1.setFontStyle('bold');
          doc1.text('Référence', 6, y);
          doc1.text('Désignation', 50, y);
          doc1.text('Quantité', 110, y);
          doc1.text('Commandée', 130, y);
          doc1.text('Prix HT', 153, y);
          doc1.text('Prix TTC', 173, y);
          doc1.text('TVA %', 193, y);
          doc1.setFontStyle('normal');
          y = y + 2;
          doc1.line(5, y, 205, y);
          y = y + 4;
          // doc1.setFontSize(9);
        }
      }
      if (numPage > 1) {
        doc1.line(5, 15, 5, y - 4, 'FD');
        doc1.line(205, 15, 205, y - 4, 'FD');
      } else {
        doc1.line(5, 55, 5, y - 4, 'FD');
        doc1.line(205, 55, 205, y - 4, 'FD');
      }
      // doc1.setFontStyle('normal');
      // doc1.setFontSize(9);
      doc1.text('Page ' + numPage.toFixed(0), 100, 287 + 2);
      window.open(doc1.output('bloburl'), '_blank');

    }
  }
  transfererProformat(e) {
    if (this.selectedFournisseur !== null && this.selectedFournisseur !== '') {
    const four = this.fournisseurs.find(e => e.code === this.selectedFournisseur);
    this.demandeProformat.selectedFour = four;
    this.demandeProformat.saisirShow = true;
  }
    const dmdProformat = [];
    let i = 1;
    for (const catalog of this.catalogues) {
      dmdProformat.push({
        rang: i.toFixed(0),
        code: catalog.code,
        designation: catalog.design,
        unite: 'P',
        quantite: '1',
      });
      i++;
    }
    this.demandeProformat.proforma = dmdProformat;
    this.demandeProformat.rang = dmdProformat.length;
    this.demandeProformat.validerShow = true;
    this.demandeProformat.fromOutside = true;
    this.displayProformat = true;
  }
  onProformatClose() {
    this.demandeProformat.NouvelleSaisie();
  }
  showDialogMaximized(dialog: Dialog) {
    dialog.maximize();
  }
}
