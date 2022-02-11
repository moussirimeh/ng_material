import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatOffreEnvoyeRoutingModule } from './etat-offre-envoye-routing.module';
import { EtatOffreEnvoyeComponent } from './etat-offre-envoye.component';
import { MatCardModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule, CalendarModule, DialogModule, OverlayPanelModule } from 'primeng/primeng';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

@NgModule({
  declarations: [EtatOffreEnvoyeComponent],
  providers: [ExcelExportService],
  imports: [
    CommonModule,
    EtatOffreEnvoyeRoutingModule,
    MatCardModule,
    FormsModule,
    CalendarModule,
    NgSelectModule,
    ButtonModule,
    OverlayPanelModule,
    InputTextModule,
    KeyFilterModule,
    RadioButtonModule,
    GridModule,
    DialogModule
  ],
  exports: [EtatOffreEnvoyeComponent]
})
export class EtatOffreEnvoyeModule { }
