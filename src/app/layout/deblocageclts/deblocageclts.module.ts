
import { DeblocagecltsRoutingModule } from './deblocageclts-routing.module';
import { DeblocagecltsComponent } from './deblocageclts.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
@NgModule({
  declarations: [DeblocagecltsComponent],
  providers: [ExcelExportService, ToolbarService],
  bootstrap: [DeblocagecltsComponent],
  exports: [DeblocagecltsComponent],
  imports: [
    CommonModule,
    DeblocagecltsRoutingModule,
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
export class DeblocagecltsModule { }
