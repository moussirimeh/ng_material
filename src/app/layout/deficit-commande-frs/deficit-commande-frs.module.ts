import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';

import { DeficitCommandeFrsRoutingModule } from './deficit-commande-frs-routing.module';
import { DeficitCommandeFrsComponent } from './deficit-commande-frs.component';

@NgModule({
  declarations: [DeficitCommandeFrsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    OverlayPanelModule,
    ButtonModule,

    DeficitCommandeFrsRoutingModule
  ]
})
export class DeficitCommandeFrsModule { }
