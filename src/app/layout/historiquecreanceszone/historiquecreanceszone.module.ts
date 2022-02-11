import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriquecreanceszoneRoutingModule } from './historiquecreanceszone-routing.module';
import { HistoriquecreanceszoneComponent } from './historiquecreanceszone.component';
import { MatCardModule } from '@angular/material';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/primeng';

@NgModule({
  declarations: [HistoriquecreanceszoneComponent],
  imports: [
    CommonModule,
    MatCardModule,
    ButtonModule,
    CalendarModule,
    CommonModule,
    FormsModule ,
    RadioButtonModule,
    NgSelectModule,
    GridModule ,
    OverlayPanelModule,
    HistoriquecreanceszoneRoutingModule
  ],
  providers: [ ExcelExportService]
})
export class HistoriquecreanceszoneModule { }
