import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ObjectifsFrsCmdsRoutingModule } from './objectifs-frs-cmds-routing.module';
import { ObjectifsFrsCmdsComponent } from './objectifs-frs-cmds.component';

@NgModule({
  declarations: [ObjectifsFrsCmdsComponent],
  imports: [
    CommonModule,
    ObjectifsFrsCmdsRoutingModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    OverlayPanelModule
  ]
})
export class ObjectifsFrsCmdsModule { }
