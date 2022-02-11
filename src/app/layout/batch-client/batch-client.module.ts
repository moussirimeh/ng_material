import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { AggregateService, GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule} from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { BatchClientRoutingModule } from './batch-client-routing.module';
import { BatchClientComponent } from './batch-client.component';

@NgModule({
  declarations: [BatchClientComponent],
  imports: [
    CommonModule,
    InputTextModule,
    OverlayPanelModule,
    GridAllModule,
    FlexLayoutModule,
    StatModule ,
    FormsModule,
    NgSelectModule,
    GridModule,
    CalendarModule,
    BatchClientRoutingModule
  ],
  providers: [ AggregateService]
})
export class BatchClientModule { }
