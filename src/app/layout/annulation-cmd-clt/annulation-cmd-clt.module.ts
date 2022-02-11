import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {BlockUIModule} from 'primeng/blockui';
import { AnnulationCmdCltRoutingModule } from './annulation-cmd-clt-routing.module';
import { AnnulationCmdCltComponent } from './annulation-cmd-clt.component';
import {PanelModule} from 'primeng/panel';
import { ButtonModule, CalendarModule, CardModule,
   ConfirmDialogModule, InputTextModule, KeyFilterModule, OverlayPanelModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { EditService, GridAllModule, SortService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormsModule as FormModule
} from '@angular/forms';
@NgModule({
  providers: [EditService, ToolbarService, SortService],
  declarations: [AnnulationCmdCltComponent],
  imports: [
    ConfirmDialogModule,
    CalendarModule,
    TableModule,
    BlockUIModule,
    ButtonModule,
    PanelModule,
    InputTextModule,
    CardModule,
    GridAllModule,
    CommonModule,
    NgSelectModule,
    FormModule,
    KeyFilterModule,
    OverlayPanelModule,
    AnnulationCmdCltRoutingModule
  ]
})
export class AnnulationCmdCltModule { }
