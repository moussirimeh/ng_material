import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultationTresorerieRoutingModule } from './consultation-tresorerie-routing.module';
import { ConsultationTresorerieComponent } from './consultation-tresorerie.component';
import { ButtonModule, CalendarModule, KeyFilterModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material';

import { GridModule, SortService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {PanelModule} from 'primeng/panel';
 import { AppurementReglementModule } from '../appurement-reglement/appurement-reglement.module';

@NgModule({
  declarations: [ConsultationTresorerieComponent],
  imports: [
    ConsultationTresorerieRoutingModule,
    CommonModule,  CalendarModule,
    ButtonModule,
    GridAllModule,
    RadioButtonModule,
    NgSelectModule,
    InputTextModule,
    FormModule,
    CardModule,
    PanelModule,
    MatCardModule,
    KeyFilterModule,
    DialogModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    AppurementReglementModule
  ],
  providers: [SortService, ExcelExportService],
  exports: [ConsultationTresorerieComponent]
})
export class ConsultationTresorerieModule { }
