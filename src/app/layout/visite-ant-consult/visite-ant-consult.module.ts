import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VisiteAntConsultRoutingModule } from './visite-ant-consult-routing.module';
import { VisiteAntConsultComponent } from './visite-ant-consult.component';
import { CardModule } from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {CalendarModule} from 'primeng/calendar';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ImpressionFacturesModule } from '../impressionfactures/impressionfactures.module';

@NgModule({
  imports: [
    CommonModule,
    VisiteAntConsultRoutingModule,
    CardModule,
    NgSelectModule,
    InputTextareaModule,
    PanelModule,
    DropdownModule,
    SelectButtonModule,
    GridModule,
    FormsModule,
    OverlayPanelModule,
    CalendarModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    ImpressionFacturesModule
  ],
  declarations: [VisiteAntConsultComponent],
  exports: [VisiteAntConsultComponent]
})
export class VisiteAntConsultModule {}
