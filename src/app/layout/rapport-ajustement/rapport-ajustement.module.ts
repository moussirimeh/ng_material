import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {  GridAllModule, SearchService, ToolbarService} from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CalendarModule} from 'primeng/calendar';
import { RapportAjustementRoutingModule } from './rapport-ajustement-routing.module';

import { RapportAjustementComponent } from './rapport-ajustement.component';


@NgModule({
  declarations: [RapportAjustementComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    FlexLayoutModule,
    InputTextModule,
    FormModule,
    ReactiveFormsModule,
    StatModule,
    NgSelectModule ,
    CalendarModule,
    GridModule,
    GridAllModule,
    RapportAjustementRoutingModule
  ]
})
export class RapportAjustementModule { }
