/*import { setCulture, L10n } from '@syncfusion/ej2-base';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Stock } from '../services/stock';
import { FournisseurService } from '../services/fournisseur.service';
import { Fournisseur } from '../services/Fournisseur';
import { FamilleService } from '../famille/famille.service';
import { SfamilleService } from '../sfamille/sfamille.service';
import { MarqueService } from '../marque/marque.service';
import { Famille } from '../famille/famille';
import { Sfamille } from '../sfamille/sfamille';
import { Marque } from '../marque/marque';
import { Catalogue } from '../services/catalogue';
import { CatalogueService } from '../services/catalogue.service';
import { ToolbarService,
   PageService, ExcelExportService, PdfExportService, GroupService,
    ExcelExportProperties, GridComponent, SearchSettingsModel, SelectionSettingsModel } from '@syncfusion/ej2-angular-grids';

    setCulture('de-DE');

    L10n.load({
        'de-DE': {
            grid: {
                EmptyRecord: [],

            }}});
@Component({
  selector: 'app-catalogueprix',
  templateUrl: './catalogueprix.component.html',
  styleUrls: ['./catalogueprix.component.scss'],
  providers: [ToolbarService, PageService, ExcelExportService, PdfExportService, GroupService]
})
export class CatalogueprixComponent implements OnInit {
  public searchOptions: SearchSettingsModel;
  public selectionOptions: SelectionSettingsModel;
  @ViewChild('grid')
    public grid: GridComponent;
  stock = 'tout';

  trier = 'code';

  article = 'tout';

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

  constructor(

    private catalogueService: CatalogueService,
    private fourService: FournisseurService,
    private familleService: FamilleService,
    private sfamilleService: SfamilleService,
    private marqueService: MarqueService,
    ) {}

  ngOnInit() {
    this.selectionOptions = { type: 'Multiple', enableSimpleMultiRowSelection: true };
    this.toolbar = ['Search'];
    this.reloadDataFour();
    this.reloadDataFamille();
    this.reloadDataSfamille();
    this.reloadDataMarque();
  }

  reloadDataMarque() {
    this.marqueService.getMarquesList().subscribe(data => {
      this.marques = data['_embedded'].marques;
      console.log('okk');
    });
  }
  reloadDataFamille() {
    this.familleService.getFamillesList().
        subscribe((data) => {
            this.familles = data['_embedded'].familles; console.log('okk');


        });
}
reloadDataSfamille() {
  this.sfamilleService.getSfamillesList().
      subscribe((data) => {
          this.sfamilles = data['_embedded'].sfamilles; console.log('okk');


      });
}
  reloadDataFour() {
    this.fourService.getFourListe('').subscribe(data => {
      this.fournisseurs = data['_embedded'].fournisseurs;
    });
  }
  applyFilterArtParDeno(filterValue: string) {
    this.fourService.getFourListe(filterValue).subscribe(data => {
      this.fournisseurs = data['_embedded'].fournisseurs;
    });
  }
  applyFilterArtParFamille(filterValue: string) {
    this.familleService.getFamilleByNom(filterValue).subscribe(data => {
      this.familles = data['_embedded'].familles;
    });
  }
  applyFilterArtParMarque(filterValue: string) {
    this.marqueService.getMarqueByNom(filterValue).subscribe(data => {
      this.marques = data['_embedded'].marques;
    });
  }
  applyFilterArtParSfamille(filterValue: string) {
    this.sfamilleService.getSfamilleByNom(filterValue).subscribe(data => {
      this.sfamilles = data['_embedded'].sfamilles;
    });
  }

  applyFilterDesign(filterValue: string) {
    this.searchOptions = { fields: ['design'], operator: 'startswith', key: filterValue, ignoreCase: true };

}
  introdure(): void {
    this.ngselectDisabled = false;
    this.stock = 'tout';

  this.trier = 'code';

  this.article = 'tout';

    this.saisieCardShow = false;
    this.catalogues = [];

    this.selectedFamille = null;

    this.selectedSfamille = null;
    this.selectedMarque = null;
    this.selectedFournisseur = null;
  }


    valider(): void {
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
  if (this.trier === 'code' && this.stock === 'tout' && this.article === 'tout' ) {

    console.log(this.selectedFournisseur);
    console.log(this.selectedSfamille);
        this.catalogueService.catalogueByCode
        (this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque)
        .subscribe(data => {
          this.catalogues = data['_embedded'].catalogues;
    });




    } else if (this.trier === 'code' && this.stock === 'null' && this.article === 'tout') {
      this.catalogueService.catalogueByCodeStockNull
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
  });




  } else if (this.trier === 'code' && this.stock === 'disponible' && this.article === 'tout') {
    this.catalogueService.catalogueByCodeStockDispo
    (this.selectedFournisseur,
      this.selectedFamille,
      this.selectedSfamille,
      this.selectedMarque)
    .subscribe(data => {
      this.catalogues = data['_embedded'].catalogues;
});




} else if (this.trier === 'code' && this.stock === 'alerte' && this.article === 'tout') {
  this.catalogueService.catalogueByCodeStockAlerte
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});




} else if (this.trier === 'code' && this.stock === 'negatif' && this.article === 'tout') {
  this.catalogueService.catalogueByCodeStockNegatif
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});




} else if (this.trier === 'code' && this.stock === 'tout' && this.article === 'noncommande') {
  this.catalogueService.catalogueByCodeNonCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});




} else if (this.trier === 'code' && this.stock === 'tout' && this.article === 'encommande') {
  this.catalogueService.catalogueByCodeEnCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});


} else if (this.trier === 'code' && this.stock === 'null' && this.article === 'encommande') {
  this.catalogueService.catalogueByCodeStockNullEnCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'null' && this.article === 'noncommande') {
  this.catalogueService.catalogueByCodeStockNullNonCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'disponible' && this.article === 'encommande') {
  this.catalogueService.catalogueByCodeStockDispoEnCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'disponible' && this.article === 'noncommande') {
  this.catalogueService.catalogueByCodeStockDispoNonCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'alerte' && this.article === 'encommande') {
  this.catalogueService.catalogueByCodeStockAlerteEnCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'alerte' && this.article === 'noncommande') {
  this.catalogueService.catalogueByCodeStockAlerteNonCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'negatif' && this.article === 'encommande') {
  this.catalogueService.catalogueByCodeStockNegatifEnCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'code' && this.stock === 'negatif' && this.article === 'noncommande') {
  this.catalogueService.catalogueByCodeStockNegatifNonCommande
  (this.selectedFournisseur,
    this.selectedFamille,
    this.selectedSfamille,
    this.selectedMarque)
  .subscribe(data => {
    this.catalogues = data['_embedded'].catalogues;
});

} else if (this.trier === 'design' && this.stock === 'tout' && this.article === 'tout') {

        this.catalogueService.catalogueByDesign
        (this.selectedFournisseur,
           this.selectedFamille,
            this.selectedSfamille,
            this.selectedMarque)
        .subscribe(data => {
          this.catalogues = data['_embedded'].catalogues;

        });


      } else if (this.trier === 'design' && this.stock === 'null' && this.article === 'tout') {

        this.catalogueService.catalogueByDesignStockNull
        (this.selectedFournisseur,
           this.selectedFamille,
            this.selectedSfamille,
            this.selectedMarque)
        .subscribe(data => {
          this.catalogues = data['_embedded'].catalogues;

        });
      } else if (this.trier === 'design' && this.stock === 'disponible' && this.article === 'tout') {
        this.catalogueService.catalogueByDesignStockDispo
        (this.selectedFournisseur,
          this.selectedFamille,
          this.selectedSfamille,
          this.selectedMarque)
        .subscribe(data => {
          this.catalogues = data['_embedded'].catalogues;
    });




    } else if (this.trier === 'design' && this.stock === 'alerte' && this.article === 'tout') {
      this.catalogueService.catalogueByDesignStockAlerte
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });




    } else if (this.trier === 'design' && this.stock === 'negatif' && this.article === 'tout') {
      this.catalogueService.catalogueByDesignStockNegatif
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });




    } else if (this.trier === 'design' && this.stock === 'tout' && this.article === 'noncommande') {
      this.catalogueService.catalogueByDesignNonCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });




    } else if (this.trier === 'design' && this.stock === 'tout' && this.article === 'encommande') {
      this.catalogueService.catalogueByDesignEnCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });


    } else if (this.trier === 'design' && this.stock === 'null' && this.article === 'encommande') {
      this.catalogueService.catalogueByCodeStockNullEnCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'null' && this.article === 'noncommande') {
      this.catalogueService.catalogueByDesignStockNullNonCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'disponible' && this.article === 'encommande') {
      this.catalogueService.catalogueByDesignStockDispoEnCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'disponible' && this.article === 'noncommande') {
      this.catalogueService.catalogueByDesignStockDispoNonCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'alerte' && this.article === 'encommande') {
      this.catalogueService.catalogueByDesignStockAlerteEnCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'alerte' && this.article === 'noncommande') {
      this.catalogueService.catalogueByDesignStockAlerteNonCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'negatif' && this.article === 'encommande') {
      this.catalogueService.catalogueByDesignStockNegatifEnCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    } else if (this.trier === 'design' && this.stock === 'negatif' && this.article === 'noncommande') {
      this.catalogueService.catalogueByDesignStockNegatifNonCommande
      (this.selectedFournisseur,
        this.selectedFamille,
        this.selectedSfamille,
        this.selectedMarque)
      .subscribe(data => {
        this.catalogues = data['_embedded'].catalogues;
    });

    }

      this.saisieCardShow = true;
      this.selectedFamille = null;
      this.selectedSfamille = null;
      this.selectedMarque = null;
      this.selectedFournisseur = null;
      }


      btnClicked(args): void {
        const excelExportProperties: ExcelExportProperties = {
               fileName: 'cataloguePrix.xlsx'
           };
       this.grid.excelExport(excelExportProperties);
   }





}*/
