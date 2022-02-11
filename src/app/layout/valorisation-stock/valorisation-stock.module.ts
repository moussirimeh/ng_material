import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValorisationStockRoutingModule } from './valorisation-stock-routing.module';
import { ValorisationStockComponent } from './valorisation-stock.component';
import { ButtonModule, CalendarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [ValorisationStockComponent],
  providers: [ExcelExportService],
  imports: [
    CommonModule,
    ValorisationStockRoutingModule,
    NgSelectModule,
    ButtonModule ,
    CalendarModule ,
    FormsModule ,
    MatCardModule ,
    RadioButtonModule ,
    GridModule
  ]
})
export class ValorisationStockModule { }
