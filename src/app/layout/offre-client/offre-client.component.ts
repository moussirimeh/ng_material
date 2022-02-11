import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ExcelExportProperties,
  TextWrapSettingsModel,
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
  selector: 'app-offre-client',
  templateUrl: './offre-client.component.html',
  styleUrls: ['./offre-client.component.scss'],
  providers: [ExcelService]
})
export class OffreClientComponent implements OnInit {
  @ViewChild('grid1')
  public grid1: GridComponent;
  @ViewChild('grid2')
  public grid2: GridComponent;
  @ViewChild('grid3')
  public grid3: GridComponent;
  clients = [];
  offres = [];
  detailsOffre = [];
  selectedClient: boolean;
  selectedClt: number;
  selectedOffre: boolean;
  selectedOfr;
  client: {};

  constructor(
    private clientService: ClientService,
    private edevisService: EdevisService,
    private ddevisService: DdevisService,
    private excelService: ExcelService,
  ) {}

  async ngOnInit() {
    const selectedRow: any = this.grid1.getSelectedRecords()[0];
    this.selectedClt = null;
    this.selectedOfr = null;
    this.selectedClient = false;
    this.selectedOffre = false;
    await this.clientService
      .listOffreClient()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].offreClients;
        // this.clients.unshift(this.selectedClient);
        this.clients.map(el => {
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
  excelExport2(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid2.excelExport(excelExportProperties);
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
  excelExport3(fileName) {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: fileName + '.xlsx',
    // };
    // this.grid3.excelExport(excelExportProperties);
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
  async consulterClient(e) {
    console.log(this.selectedClt);

      this.grid1.selectRows([this.selectedClt]);
      await this.edevisService
        .listDetailOffreClient(e.rowData.code)
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
      // if (this.grid2) {
      //   selectedRow = this.grid2.getSelectedRecords()[0];
      // }
      this.grid1.selectRows([this.selectedClt]);
  }
  async consulterOffre(e) {
    const combine: string = e.rowData.combine;
    this.grid2.selectRows([this.selectedOfr]);
    await this.ddevisService
      .findByCombine(combine)
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
      this.grid2.selectRows([this.selectedOfr]);
}

rowSelectedClient(args) {
  if (this.grid1.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.grid1.getSelectedRecords()[0];
    this.selectedClt = args.rowIndex;
  }
}


rowSelectedOffre(args) {
  if (this.grid2.getSelectedRowIndexes()[0] >= 0) {
    const selected: any = this.grid2.getSelectedRecords()[0];
    this.selectedOfr = args.rowIndex;
  }
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
