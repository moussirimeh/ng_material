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

import { ReglementClientComponent } from './reglementClient.component';
import { ReglementClientRoutingModule } from './reglementClient-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { AppurementReglementModule } from '../appurement-reglement/appurement-reglement.module';
import { DialogModule } from 'primeng/dialog';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputMaskModule} from 'primeng/inputmask';

@NgModule({
  declarations: [ReglementClientComponent],
  imports: [
DialogModule,
    CalendarModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    DropdownModule,
    NgSelectModule,
    ReglementClientRoutingModule,
    FormModule,
    MatCardModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    AppurementReglementModule,
    OverlayPanelModule,
    InputMaskModule,
    KeyFilterModule
  ],
  exports: [ReglementClientComponent]
})
export class ReglementClientModule {}
