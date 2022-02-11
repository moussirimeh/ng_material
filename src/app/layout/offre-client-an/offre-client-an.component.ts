import { Component, OnInit, ViewChild } from '@angular/core';
import { L10n, setCulture } from '@syncfusion/ej2-base';
import {
  GridComponent,
  ExcelExportProperties,
  TextWrapSettingsModel,
} from '@syncfusion/ej2-angular-grids';
import { TablOffService } from '../services/tablOff.service';
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
  selector: 'app-offre-client-an',
  templateUrl: './offre-client-an.component.html',
  styleUrls: ['./offre-client-an.component.scss'],
  providers: [ExcelService]
})
export class OffreClientAnComponent implements OnInit {
  @ViewChild('grid')
  public grid: GridComponent;
  clients = [];

  constructor(
    private tablOffService: TablOffService,
    private excelService: ExcelService,
  ) {}

  async ngOnInit() {
    await this.tablOffService
      .updateTablOff()
      .toPromise()
      .catch(() => {
        console.log('error');
      });
    await this.tablOffService
      .findAllByOrder()
      .toPromise()
      .then((data) => {
        this.clients = data['_embedded'].tablOff;
        // this.clients.unshift(this.selectedClient);
        this.clients.map(el => {
          el.ca2 = Number(el.ca2).toFixed(3);
          el.off2 = Number(el.off2).toFixed(3);
          el.st2 = Number(el.st2).toFixed(2);
          el.ca1 = Number(el.ca1).toFixed(3);
          el.off1 = Number(el.off1).toFixed(3);
          el.st1 = Number(el.st1).toFixed(2);
          el.ca = Number(el.ca).toFixed(3);
          el.offr = Number(el.offr).toFixed(3);
          el.st = Number(el.st).toFixed(2);
        });
      })
      .catch((data) => {
        console.log('error get clients');
      });
  }
  excelExport() {
    // const excelExportProperties: ExcelExportProperties = {
    //   fileName: 'Offres_Client_An.xlsx',
    // };
    // this.grid.excelExport(excelExportProperties);
    const exportExcel = this.clients.map(obj => {
      return {
        'CODE CLT': obj.codeClt,
        'DENO CLT': obj.denoClt,
        'CA AN_2': Number(obj.ca2),
        'OFR AN_2': Number(obj.off2),
        'STF AN_2': Number(obj.st2),
        'CA AN_1': Number(obj.ca1),
        'OFR AN_1': Number(obj.off1),
        'STF AN_1': Number(obj.st1),
        'CA AN_C': Number(obj.ca),
        'OFR AN_C': Number(obj.offr),
        'STF AN_C': Number(obj.st),
        'TYPE': obj.typeClt,
      };
    });
    this.excelService.exportAsExcelFile(
      exportExcel,
      'Offres_Client_An'
    );
  }
}
