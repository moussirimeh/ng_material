import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RapportavoirscomptantRoutingModule } from './rapportavoirscomptant-routing.module';
import { RapportavoirscomptantComponent } from './rapportavoirscomptant.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [RapportavoirscomptantComponent],
  imports: [
    CommonModule,
    ButtonModule,
    CalendarModule,
    FormsModule ,
    RapportavoirscomptantRoutingModule
  ]
})
export class RapportavoirscomptantModule { }
