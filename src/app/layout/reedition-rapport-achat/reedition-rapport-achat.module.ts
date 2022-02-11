import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ReeditionRapportAchatRoutingModule } from './reedition-rapport-achat-routing.module';
import { ReeditionRapportAchatComponent } from './reedition-rapport-achat.component';

@NgModule({
  declarations: [ReeditionRapportAchatComponent],
  imports: [
    CommonModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    KeyFilterModule ,
    OverlayPanelModule,
    ReeditionRapportAchatRoutingModule
  ] ,
  bootstrap: [ReeditionRapportAchatComponent],
  exports: [ReeditionRapportAchatComponent]
})
export class ReeditionRapportAchatModule { }
