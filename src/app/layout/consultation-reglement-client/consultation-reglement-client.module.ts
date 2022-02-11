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
import { ConsultationReglementClientComponent } from './consultation-reglement-client.component';
import { ConsultationReglementClientRoutingModule } from './consultation-reglement-client-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgModule } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [ConsultationReglementClientComponent],
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
    ConsultationReglementClientRoutingModule,
    FormModule,
    MatCardModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class ConsultationReglementClientModule {}
