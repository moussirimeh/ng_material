import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransfCptRoutingModule } from './transf-cpt-routing.module';
import { TransfCptComponent } from './transf-cpt.component';
import { CalendarModule, DialogModule, OverlayPanelModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TransfCptComponent],
  imports: [
    CommonModule,
    TransfCptRoutingModule,
    CalendarModule,
    FormsModule ,
    OverlayPanelModule,
    DialogModule
  ]
})
export class TransfCptModule { }
