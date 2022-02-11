import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';

import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { ConsAnnApurtsCmptComponent } from './cons-ann-apurts-cmpt.component';
import { ConsAnnApurtsCmptRoutingModule } from './cons-ann-apurts-cmpt-routing.module';
import { TableModule } from 'primeng/table';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [ConsAnnApurtsCmptComponent],
  imports: [
    CalendarModule,
    DropdownModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    ConsAnnApurtsCmptRoutingModule,
    FormModule,
    MatCardModule,
    TableModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class ConsAnnApurtsCmptModule {}
