import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule} from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {FieldsetModule} from 'primeng/fieldset';
import {KeyFilterModule} from 'primeng/keyfilter';
import {RadioButtonModule} from 'primeng/radiobutton';


import { ConsultationRegFourRoutingModule } from './consultation-reg-four-routing.module';
import { ConsultationRegFourComponent } from './consultation-reg-four.component';

@NgModule({
  declarations: [ConsultationRegFourComponent],
  imports: [
    CommonModule,
    FieldsetModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    CalendarModule,
    CommonModule,
    RadioButtonModule,
    OverlayPanelModule,
    StatModule,
    FormsModule,
    KeyFilterModule,
    NgSelectModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    ConsultationRegFourRoutingModule
  ]
})
export class ConsultationRegFourModule { }
