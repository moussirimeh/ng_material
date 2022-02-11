import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import { ReceptionBlAvFactRoutingModule } from './reception-bl-av-fact-routing.module';
import { ReceptionBlAvFactComponent } from './reception-bl-av-fact.component';

@NgModule({
  declarations: [ReceptionBlAvFactComponent],
  imports: [
    CommonModule,
    ReceptionBlAvFactRoutingModule,
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
export class ReceptionBlAvFactModule { }
