import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoriqueRegCltsRoutingModule } from './historique-reg-clts-routing.module';
import { HistoriqueRegCltsComponent } from '../historique-reg-clts/historique-reg-clts.component';
import { ButtonModule, CalendarModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material';
import { AggregateService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
 import { AppurementReglementModule } from '../appurement-reglement/appurement-reglement.module';
@NgModule({
  declarations: [HistoriqueRegCltsComponent],
  imports: [
    CommonModule,
    CalendarModule,
    ButtonModule,
    GridAllModule,
    RadioButtonModule,
    NgSelectModule,
    FormModule,
    MatCardModule,
    DialogModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    HistoriqueRegCltsRoutingModule,
    AppurementReglementModule
  ],
  providers: [AggregateService],
  exports: [HistoriqueRegCltsComponent]
})
export class HistoriqueRegCltsModule { }
