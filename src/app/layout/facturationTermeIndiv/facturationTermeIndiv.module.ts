import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FacturationTermeIndivRoutingModule } from './facturationTermeIndiv-routing.module';
import { FacturationTermeIndivComponent } from './facturationTermeIndiv.component';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    FacturationTermeIndivRoutingModule,
    CardModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    CalendarModule,
    DropdownModule,
    PanelModule,
    BlockUIModule,
    ProgressSpinnerModule,
    OverlayPanelModule
  ],
  declarations: [FacturationTermeIndivComponent]
})
export class FacturationTermeIndivModule {}
