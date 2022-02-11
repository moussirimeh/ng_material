import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, ToolbarService, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import { FieldsetModule } from 'primeng/fieldset';
import { ReleveClientRoutingModule } from './releveClient-routing.module';
import { ReleveClientComponent } from './releveClient.component';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import {BlockUIModule} from 'primeng/blockui';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { ImpressionFacturesModule } from '../impressionfactures/impressionfactures.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';
@NgModule({
  imports: [
    ReleveClientRoutingModule,
    CommonModule,
    CheckboxModule,
    NgSelectModule,
    BlockUIModule,
    DialogModule,
    SelectButtonModule,
    FormsModule,
    ImpressionFacturesModule,
    CalendarModule,
    GridModule,
    TableModule,
    TabViewModule,
    InputTextModule,
    DropdownModule,
    PanelModule,
    FieldsetModule,
    ProgressBarModule,
    OverlayPanelModule
  ],
  declarations: [ReleveClientComponent],
  providers: [ExcelExportService, ToolbarService],
  bootstrap: [ReleveClientComponent],
  exports: [ReleveClientComponent]
})
export class ReleveClientModule {}


