import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AffectationActionRecouvrementRoutingModule } from './affectation-action-recouvrement-routing.module';
import { AffectationActionRecouvrementComponent } from './affectation-action-recouvrement.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import {CardModule} from 'primeng/card';
import {DialogModule} from 'primeng/dialog';
import { ConsultationMissionRecouvrementModule } from '../consultation-mission-recouvrement/consultation-mission-recouvrement.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputTextareaModule} from 'primeng/inputtextarea';
@NgModule({
  imports: [
    CommonModule,
    AffectationActionRecouvrementRoutingModule,
    ButtonModule,
    PanelModule,
    FormsModule,
    GridModule,
    ToastModule,
    CalendarModule,
    NgSelectModule,
    CardModule,
    DialogModule,
    OverlayPanelModule,
    InputTextModule,
    KeyFilterModule,
    InputTextareaModule,
    ConsultationMissionRecouvrementModule
  ],
  declarations: [AffectationActionRecouvrementComponent]
})
export class AffectationActionRecouvrementModule {}
