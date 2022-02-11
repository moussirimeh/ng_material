import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConsultaionActionRecouvrementRoutingModule } from './consultaion-action-recouvrement-routing.module';
import { ConsultaionActionRecouvrementComponent } from './consultaion-action-recouvrement.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
@NgModule({
  declarations: [ConsultaionActionRecouvrementComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    GridModule,
    InputTextareaModule,
    OverlayPanelModule,
    FormsModule,
    CalendarModule,
    ConsultaionActionRecouvrementRoutingModule,
    ButtonModule,
  ]
})
export class ConsultaionActionRecouvrementModule { }
