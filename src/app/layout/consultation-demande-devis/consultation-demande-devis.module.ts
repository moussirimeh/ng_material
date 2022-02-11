import { CommonModule } from '@angular/common';
import { DropdownModule} from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';

import { FormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

 import { GridModule, SelectionService } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { NgSelectModule } from '@ng-select/ng-select';

import { CalendarModule } from 'primeng/calendar';

import { NgModule } from '@angular/core';
import { ConsultationDemandeDevisComponent } from './consultation-demande-devis.component';
import { ConsultationDemandeDevisRoutingModule } from './consultation-demande-devis-routing.module';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
@NgModule({
  declarations: [ConsultationDemandeDevisComponent],
  providers: [SelectionService],
  imports: [
    GridModule,
   ButtonModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    InputTextModule,

    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    ConsultationDemandeDevisRoutingModule,
    FormsModule,
    MatCardModule,
    DialogModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class ConsultationDemandeDevisModule {}
