import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectifsFrsRealiseRoutingModule } from './objectifs-frs-realise-routing.module';
import { ObjectifsFrsRealiseComponent } from './objectifs-frs-realise.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ButtonModule, DialogModule, OverlayPanelModule } from 'primeng/primeng';

@NgModule({
  declarations: [ObjectifsFrsRealiseComponent],
  imports: [
    CommonModule,
    ObjectifsFrsRealiseRoutingModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    OverlayPanelModule
  ]
})
export class ObjectifsFrsRealiseModule { }
