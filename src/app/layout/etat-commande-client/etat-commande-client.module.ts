import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';

import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { NgSelectModule } from '@ng-select/ng-select';

import { CalendarModule } from 'primeng/calendar';

import { NgModule } from '@angular/core';
import { EtatCommandeClientComponent } from './etat-commande-client.component';
import { EtatCommandeClientRoutingModule } from './etat-commande-client-routing.module';
import { OverlayPanelModule, DialogModule } from 'primeng/primeng';

@NgModule({
  declarations: [EtatCommandeClientComponent],
  imports: [
    ConfirmDialogModule,
    CalendarModule,

    DropdownModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    GridModule,
    CalendarModule,
    OverlayPanelModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    EtatCommandeClientRoutingModule,
    FormModule,
    DialogModule,
    MatCardModule,


  ],
  providers: [ExcelExportService],
  exports: [EtatCommandeClientComponent]
})
export class EtatCommandeClientModule {}
