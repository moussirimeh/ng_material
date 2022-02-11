import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ConsultationMissionRecouvrementRoutingModule } from './consultation-mission-recouvrement-routing.module';
import { ConsultationMissionRecouvrementComponent } from './consultation-mission-recouvrement.component';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import {RadioButtonModule} from 'primeng/radiobutton';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  imports: [
    CommonModule,
    ConsultationMissionRecouvrementRoutingModule,
    ButtonModule,
    PanelModule,
    FormsModule,
    GridModule,
    ToastModule,
    CalendarModule,
    NgSelectModule,
    RadioButtonModule,
    OverlayPanelModule,
    InputTextModule,
    BlockUIModule
  ],
    declarations: [ConsultationMissionRecouvrementComponent],
    exports: [ConsultationMissionRecouvrementComponent]
})
export class ConsultationMissionRecouvrementModule {}
