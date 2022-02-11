import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionTresorerieRoutingModule } from './gestion-tresorerie-routing.module';
import { GestionTresorerieComponent } from './gestion-tresorerie.component';
import { ButtonModule, CalendarModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { GridAllModule, AggregateService } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material';

import { SortService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import {CardModule} from 'primeng/card';
import {PanelModule} from 'primeng/panel';
 import { AppurementReglementModule } from '../appurement-reglement/appurement-reglement.module';
 import { ConfirmDialogModule } from 'primeng/confirmdialog';
 import {BlockUIModule} from 'primeng/blockui';
 import {KeyFilterModule} from 'primeng/keyfilter';
@NgModule({
  declarations: [GestionTresorerieComponent],
  imports: [
    CommonModule,  CalendarModule,
    ButtonModule,
    GridAllModule,
    RadioButtonModule,
    NgSelectModule,
    InputTextModule,
    BlockUIModule,
    FormModule,
    KeyFilterModule,
    CardModule,
    PanelModule,
    MatCardModule,
    DialogModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    GestionTresorerieRoutingModule,
    ConfirmDialogModule,
    AppurementReglementModule
  ],
  providers: [SortService, ExcelExportService, AggregateService],
  exports: [GestionTresorerieComponent]
})
export class GestionTresorerieModule { }
