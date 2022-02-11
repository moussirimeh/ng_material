import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MesMessagesVisitesRoutingModule } from './mes-messages-visites-routing.module';
import { MesMessagesVisitesComponent } from './mes-messages-visites.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { DialogModule } from 'primeng/dialog';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { ProgrammationVisiteModule } from '../programmation-visite/programmation-visite.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
  imports: [
    CommonModule,
    MesMessagesVisitesRoutingModule,
    FormsModule,
    RadioButtonModule,
    ButtonModule,
    GridModule,
    CalendarModule,
    PanelModule,
    ToastModule,
    NgSelectModule,
    DialogModule,
    InputTextareaModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    InputTextModule,
    ProgrammationVisiteModule
  ],
  declarations: [MesMessagesVisitesComponent],
  providers: [ExcelExportService]
})
export class MesMessagesVisitesModule {}
