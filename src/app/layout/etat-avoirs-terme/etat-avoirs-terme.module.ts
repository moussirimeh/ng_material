import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

import { EtatAvoirsTermeRoutingModule } from './etat-avoirs-terme-routing.module';
import { EtatAvoirsTermeComponent } from './etat-avoirs-terme.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
@NgModule({
  declarations: [EtatAvoirsTermeComponent],
  imports: [
    CommonModule,
    CalendarModule,
    OverlayPanelModule,
    FormsModule,
    ButtonModule,
    EtatAvoirsTermeRoutingModule
  ]
})
export class EtatAvoirsTermeModule { }
