import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatAvoirComptantRoutingModule } from './etat-avoir-comptant-routing.module';
import { EtatAvoirComptantComponent } from './etat-avoir-comptant.component';

@NgModule({
  declarations: [EtatAvoirComptantComponent],
  imports: [
    CommonModule,
    EtatAvoirComptantRoutingModule
  ]
})
export class EtatAvoirComptantModule { }
