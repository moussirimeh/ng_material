import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ButtonModule} from 'primeng/button';

import { EtatAvoirComptantCaisseRoutingModule } from './etat-avoir-comptant-caisse-routing.module';
import { EtatAvoirComptantCaisseComponent } from './etat-avoir-comptant-caisse.component';

@NgModule({
  declarations: [EtatAvoirComptantCaisseComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    EtatAvoirComptantCaisseRoutingModule
  ]
})
export class EtatAvoirComptantCaisseModule { }
