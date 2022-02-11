import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailClientRoutingModule } from './detail-client-routing.module';
import { DetailClientComponent } from './detail-client.component';
import { MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule, DialogModule, InputTextModule, KeyFilterModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [DetailClientComponent],
  imports: [
    CommonModule,
    DetailClientRoutingModule ,
    MatCardModule,
    FormsModule,
    NgSelectModule,
    ButtonModule,
    InputTextModule,
    KeyFilterModule,
    RadioButtonModule,
    GridModule,
    DialogModule ,
    OverlayPanelModule
  ],
  providers: [ExcelExportService],
})
export class DetailClientModule { }
