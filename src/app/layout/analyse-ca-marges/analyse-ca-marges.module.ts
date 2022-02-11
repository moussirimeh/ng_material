import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AnalyseCaMargesRoutingModule } from './analyse-ca-marges-routing.module';
import { AnalyseCaMargesComponent } from './analyse-ca-marges.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { GridModule, SortService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { DuplicataModule } from '../duplicata/duplicata.module';
import { DialogModule } from 'primeng/dialog';
import { AggregateService } from '@syncfusion/ej2-angular-grids';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  imports: [
    CommonModule,
    AnalyseCaMargesRoutingModule,
    ButtonModule,
    PanelModule,
    RadioButtonModule,
    FormsModule,
    GridModule,
    ToastModule,
    CalendarModule,
    NgSelectModule,
    DialogModule,
    OverlayPanelModule,
    DuplicataModule
  ],
  declarations: [AnalyseCaMargesComponent],
  providers: [SortService, ExcelExportService, AggregateService],
  exports: [AnalyseCaMargesComponent]
})
export class AnalyseCaMargesModule {}
