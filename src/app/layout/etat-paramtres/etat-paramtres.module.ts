import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule, CalendarModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material';
// import { AggregateService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

import { EtatParamtresRoutingModule } from './etat-paramtres-routing.module';
import { EtatParamtresComponent } from './etat-paramtres.component';

@NgModule({
  declarations: [EtatParamtresComponent],
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
    EtatParamtresRoutingModule
  ]
})
export class EtatParamtresModule { }
