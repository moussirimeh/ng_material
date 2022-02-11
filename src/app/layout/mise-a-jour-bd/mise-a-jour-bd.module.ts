import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as FormModule} from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { MiseAJourBdRoutingModule } from './mise-a-jour-bd-routing.module';
import { MiseAJourBdComponent } from './mise-a-jour-bd.component';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [MiseAJourBdComponent],
  imports: [
    CommonModule,
    FormModule,
    ButtonModule,
    BlockUIModule,
    OverlayPanelModule,
    MiseAJourBdRoutingModule
  ]
})
export class MiseAJourBdModule { }
