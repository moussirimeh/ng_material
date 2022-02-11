import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import { BlavoirBlNonRecuRoutingModule } from './blavoir-bl-non-recu-routing.module';
import { BlavoirBlNonRecuComponent } from './blavoir-bl-non-recu.component';

@NgModule({
  declarations: [BlavoirBlNonRecuComponent],
  imports: [
    CommonModule,
    BlavoirBlNonRecuRoutingModule,
    InputTextModule,
    OverlayPanelModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    GridModule,
  ],
  providers: [ ExcelExportService]
})
export class BlavoirBlNonRecuModule { }
