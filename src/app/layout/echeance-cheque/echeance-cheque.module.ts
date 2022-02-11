import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { EcheanceChequeRoutingModule } from './echeance-cheque-routing.module';
import { EcheanceChequeComponent } from './echeance-cheque.component';

@NgModule({
  declarations: [EcheanceChequeComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    EcheanceChequeRoutingModule
  ]
})
export class EcheanceChequeModule { }
