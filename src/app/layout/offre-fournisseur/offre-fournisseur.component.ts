import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent
} from '@syncfusion/ej2-angular-grids';
import { ClientService } from '../services/client.service';
import { EdevisService } from '../services/edevis.service';
import { DdevisService } from '../services/ddevis.service';
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
  selector: 'app-offre-fournisseur',
  templateUrl: './offre-fournisseur.component.html',
  styleUrls: ['./offre-fournisseur.component.scss'],
  providers: [ExcelService]
})

export class OffreFournisseurComponent implements OnInit {
  @ViewChild('grid1')
  public grid1: GridComponent;
  @ViewChild('grid2')
  public grid2: GridComponent;
  @ViewChild('grid3')
  public grid3: GridComponent;
  @ViewChild('grid4')
  public grid4: GridComponent;
  fournisseurs = [];
  clients = [];
  offres = [];
  detailsOffre = [];
  selectedFournisseur: boolean;
  selectedClient: boolean;
  selectedFour: number;
  selectedClt: number;
  selectedOffre: boolean;
  selectedOfr;
  client;
  fournisseur;

  constructor(
    private clientService: ClientService,
    private edevisService: EdevisService,
    private ddevisService: DdevisService,
    private excelService: ExcelService,
  ) {}

  async ngOnInit() {
    // const selectedRow: any = this.grid1.getSelectedRecords()[0];
    this.selectedFour = null;
    this.selectedClt = null;
    this.selectedOfr = null;
    this.selectedFournisseur = false;
    this.selectedClient = false;
    this.selectedOffre = false;
    await this.ddevisService
      .listOffresFournisseur()
      .toPromise()
      .then((data) => {
        this.fournisseurs = data['_embedded'].offreClients;
        console.log(data);

        // this.clients.unshift(this.selectedClient);
        this.fournisseurs.map(el => {
          el.net = Number(el.net).toFixed(3);
          el.satisf = Number(el.satisf).toFixed(3);
          el.pourc = Number(el.pourc).toFixed(2);
        });
      })
      .catch((data) => {
        console.log('error get clients');
      });
  }
  excelExport1(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid1.excelExport(excelExportProperties);
    const exportExcel = this.fournisseurs.map(obj => {
      return {
        'Code Fournisseur': obj.code,
        'Denomination': obj.deno,
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
  async consulterFournisseur(e) {
    this.grid1.selectRows([this.selectedFour]);
    this.fournisseur = e.rowData;
    await this.clientService
      .listClientsFournisseur(e.rowData.code)
      .toPromise()
      .then((data) => {
        this.selectedFournisseur = true;
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
    this.grid1.selectRows([this.selectedFour]);
}
  async consulterClient(e) {
      this.grid2.selectRows([this.selectedClt]);
      await this.edevisService
        .listDetailOfrCltFour(e.rowData.code, this.fournisseur.code)
        .toPromise()
        .then((data) => {
          this.selectedClient = true;
          this.selectedOffre = false;
          this.offres = data['_embedded'].detailOffreClients;
          this.offres.map(el => {
            const dateString: string = el.datDev ;
            el.datDev = String(dateString).substring(0, 10);
            el.net = Number(el.net).toFixed(3);
            el.satisf = Number(el.satisf).toFixed(3);
            el.pourc = Number(el.pourc).toFixed(2);
          });
        });
      this.grid2.selectRows([this.selectedClt]);
  }
  async consulterOffre(e) {
    const combine: string = e.rowData.combine;
    this.grid3.selectRows([this.selectedOfr]);
    await this.ddevisService
      .getDdevisByCombineFour(combine, this.fournisseur.code)
      .toPromise()
      .then((data) => {
        this.selectedOffre = true;
        this.detailsOffre = data['_embedded'].ddevis;
        this.detailsOffre.map(el => {
          el.quantite = Number(el.quantite) + Number(el.qtSatisf);
          el.tRemise = Number(el.tRemise);
          el.prix = Number(el.prix).toFixed(3);
          el.tauxTva = Number(el.tauxTva);
          el.qtSatisf = Number(el.qtSatisf);
        });
      });
      console.log(this.detailsOffre);

      this.grid3.selectRows([this.selectedOfr]);
}

rowSelectedFournisseur(args) {
  if (this.grid1.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.grid1.getSelectedRecords()[0];
    this.selectedFour = args.rowIndex;
  }
}

rowSelectedClient(args) {
  if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.grid2.getSelectedRecords()[0];
    this.selectedClt = args.rowIndex;
  }
}

rowSelectedOffre(args) {
  if (this.grid3.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.grid3.getSelectedRecords()[0];
    this.selectedOfr = args.rowIndex;
  }
}
annulerSelectionFournisseur() {
  this.selectedFournisseur = false;
  this.selectedClient = false;
  this.selectedOffre = false;
  this.selectedClt = null;
  this.selectedOfr = null;
  this.client = [];
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
}
