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
import { AnalyseChiffAffRoutingModule } from './analyse-chiff-aff-routing.module';
import { AnalyseChiffAffComponent } from './analyse-chiff-aff.component';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [AnalyseChiffAffComponent],
  imports: [
    CommonModule,
    CalendarModule,
    FormModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    GridModule,
    NgSelectModule ,
    RadioButtonModule,
    PanelModule,
    ButtonModule,
    AnalyseChiffAffRoutingModule
  ]
})
export class AnalyseChiffAffModule { }
