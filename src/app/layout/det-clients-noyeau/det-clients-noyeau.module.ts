import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetClientsNoyeauComponent } from './det-clients-noyeau.component';
import { DetClientsNoyeauRoutingModule } from './det-clients-noyeau-routing.module';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/primeng';
@NgModule({
  declarations: [DetClientsNoyeauComponent],
  imports: [
    CommonModule,
    ButtonModule,
    OverlayPanelModule,
    DetClientsNoyeauRoutingModule
  ]
})
export class DetClientsNoyeauModule { }
