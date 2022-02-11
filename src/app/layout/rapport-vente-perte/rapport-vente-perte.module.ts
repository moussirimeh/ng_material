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

import {CardModule} from 'primeng/card';
import {RadioButtonModule} from 'primeng/radiobutton';

import { RapportVentePerteRoutingModule } from './rapport-vente-perte-routing.module';
import { RapportVentePerteComponent } from './rapport-vente-perte.component';

@NgModule({
  declarations: [RapportVentePerteComponent],
  imports: [
    CommonModule,
    RadioButtonModule,
    OverlayPanelModule,
    FlexLayoutModule,
    InputTextModule,
    CardModule,
    FormModule,
    ReactiveFormsModule,
    StatModule,
    NgSelectModule ,
    CalendarModule,
    GridModule,
    GridAllModule,
    RapportVentePerteRoutingModule
  ]
})
export class RapportVentePerteModule { }
