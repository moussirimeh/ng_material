import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { AppurementReglementModule } from '../appurement-reglement/appurement-reglement.module';
import { DialogModule } from 'primeng/dialog';
import { ReglementClientContComponent } from './reglement-client-cont.component';
import { ReglementClientContRoutingModule } from './reglement-client-cont-routing.module';


@NgModule({
  declarations: [ReglementClientContComponent],
  imports: [
DialogModule,
    CalendarModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    DropdownModule,
    NgSelectModule,
    ReglementClientContRoutingModule,
    FormModule,
    MatCardModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),

    AppurementReglementModule
  ],

})
export class ReglementClientContModule {}
