
import { Deblocagecltsn2RoutingModule } from './deblocagecltsn2-routing.module';
import { Deblocagecltsn2Component } from './deblocagecltsn2.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import { GridModule, ToolbarService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ImpressionFacturesModule } from '../impressionfactures/impressionfactures.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [Deblocagecltsn2Component],
  imports: [
    CommonModule,
    Deblocagecltsn2RoutingModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    GridModule,
    CheckboxModule,
    DialogModule,
    SelectButtonModule,
    ImpressionFacturesModule,
    CalendarModule,
    TableModule,
    TabViewModule,
    InputTextModule,
    DropdownModule,
    PanelModule,
    FieldsetModule,
    ProgressBarModule,
    OverlayPanelModule

  ]
})
export class Deblocagecltsn2Module { }
