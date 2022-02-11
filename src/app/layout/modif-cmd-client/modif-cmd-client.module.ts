import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModifCmdClientRoutingModule } from './modif-cmd-client-routing.module';
import { ModifCmdClientComponent } from './modif-cmd-client.component';
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
  declarations: [ModifCmdClientComponent],
  imports: [
    ConfirmDialogModule,
    CalendarModule,
    TableModule,
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
    ModifCmdClientRoutingModule
  ]
})
export class ModifCmdClientModule { }
