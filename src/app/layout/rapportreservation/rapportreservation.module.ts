import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { RapportreservationRoutingModule } from './rapportreservation-routing.module';
import { RapportreservationComponent } from './rapportreservation.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [RapportreservationComponent],
  imports: [
    CommonModule,
    CalendarModule,
    OverlayPanelModule,
    FormsModule,
    ButtonModule,
    RapportreservationRoutingModule
  ]
})
export class RapportreservationModule { }
