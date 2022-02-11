import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { RapportDesAchatsRoutingModule } from './rapport-des-achats-routing.module';
import { RapportDesAchatsComponent } from './rapport-des-achats.component';

@NgModule({
  declarations: [RapportDesAchatsComponent],
  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    CalendarModule,
    NgSelectModule,
    OverlayPanelModule,
    RapportDesAchatsRoutingModule
  ]
})
export class RapportDesAchatsModule { }
