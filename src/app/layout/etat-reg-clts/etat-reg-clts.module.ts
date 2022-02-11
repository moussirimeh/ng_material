import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatRegCltsRoutingModule } from './etat-reg-clts-routing.module';
import { EtatRegCltsComponent } from './etat-reg-clts.component';

import { ButtonModule, CalendarModule, OverlayPanelModule, RadioButtonModule } from 'primeng/primeng';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatCardModule } from '@angular/material';
// import { AggregateService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [EtatRegCltsComponent],
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
    EtatRegCltsRoutingModule
  ]
})
export class EtatRegCltsModule { }
