import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EtatTvaRoutingModule } from './etat-tva-routing.module';
import { EtatTvaComponent } from './etat-tva.component';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    EtatTvaRoutingModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    CardModule,
    OverlayPanelModule,
  ],
  declarations: [EtatTvaComponent],
})
export class EtatTvaModule {}
