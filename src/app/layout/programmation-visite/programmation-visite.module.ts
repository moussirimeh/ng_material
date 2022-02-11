import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProgrammationVisiteRoutingModule } from './programmation-visite-routing.module';
import { ProgrammationVisiteComponent } from './programmation-visite.component';
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
import { VisiteAntConsultModule } from '../visite-ant-consult/visite-ant-consult.module';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  imports: [
    CommonModule,
    ProgrammationVisiteRoutingModule,
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
    ImpressionFacturesModule,
    VisiteAntConsultModule,
    BlockUIModule
  ],
  declarations: [ProgrammationVisiteComponent],
  exports: [ProgrammationVisiteComponent]
})
export class ProgrammationVisiteModule {}
