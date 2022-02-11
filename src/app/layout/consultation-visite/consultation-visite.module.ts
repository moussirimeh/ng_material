import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConsultationVisiteRoutingModule } from './consultation-visite-routing.module';
import { ConsultationVisiteComponent } from './consultation-visite.component';
import { CardModule } from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  GridModule,
  ExcelExportService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { VisiteAntConsultModule } from '../visite-ant-consult/visite-ant-consult.module';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import {ConfirmationService} from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
@NgModule({
  imports: [
    CommonModule,
    ConsultationVisiteRoutingModule,
    CardModule,
    NgSelectModule,
    InputTextareaModule,
    PanelModule,
    DropdownModule,
    SelectButtonModule,
    GridModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    RadioButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    KeyFilterModule,
    OverlayPanelModule,
    VisiteAntConsultModule,
  ],
  declarations: [ConsultationVisiteComponent],
  providers: [ExcelExportService, ToolbarService],
  bootstrap: [ConsultationVisiteComponent],
})
export class ConsultationVisiteModule {}
