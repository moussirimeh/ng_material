import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as FormModule} from '@angular/forms';

import {OverlayPanelModule} from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import {ReactiveFormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import {  SortService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import {CardModule} from 'primeng/card';
import { CreanceClientRoutingModule } from './creance-client-routing.module';
import { CreanceClientComponent } from './creance-client.component';
import { AggregateService } from '@syncfusion/ej2-angular-grids';
import { ConsultationMissionRecouvrementModule } from '../consultation-mission-recouvrement/consultation-mission-recouvrement.module';
import {DialogModule} from 'primeng/dialog';
@NgModule({
  declarations: [CreanceClientComponent],
  imports: [
    CommonModule,
    CalendarModule,
    CardModule,
    FormModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    GridModule,
    NgSelectModule ,
    RadioButtonModule,
    PanelModule,
    DialogModule,
    ButtonModule,
    CreanceClientRoutingModule,
    ConsultationMissionRecouvrementModule
  ],
  providers: [SortService, ExcelExportService, AggregateService]
})
export class CreanceClientModule { }
