import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RapportComptantRoutingModule } from './rapport-comptant-routing.module';
import { RapportComptantComponent } from './rapport-comptant.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    RapportComptantRoutingModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    CardModule,
    OverlayPanelModule,
  ],
  declarations: [RapportComptantComponent],
})
export class RapportComptantModule {}
