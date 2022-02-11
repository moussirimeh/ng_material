import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { RapportDesVentesRoutingModule } from './rapport-des-ventes-routing.module';
import { RapportDesVentesComponent } from './rapport-des-ventes.component';

@NgModule({
  declarations: [RapportDesVentesComponent],
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    OverlayPanelModule,
    RapportDesVentesRoutingModule
  ]
})
export class RapportDesVentesModule { }
