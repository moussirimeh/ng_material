import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import {
  FormsModule as FormModule
} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {GridAllModule, SortService, EditService,  ToolbarService, } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import {BlockUIModule} from 'primeng/blockui';

import {TableModule} from 'primeng/table';
import { NouvelleCmdClientRoutingModule } from './nouvelle-cmd-client-routing.module';
import { NouvelleCmdClientComponent } from './nouvelle-cmd-client.component';
import {CardModule} from 'primeng/card';
@NgModule({
  declarations: [NouvelleCmdClientComponent],


  providers: [EditService, ToolbarService, SortService],
  imports: [
    BlockUIModule,
    ConfirmDialogModule,
    TabViewModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    GridAllModule,
    CommonModule,
    NgSelectModule,
    FormModule,
    KeyFilterModule,
    OverlayPanelModule,
    NouvelleCmdClientRoutingModule
  ]
})
export class NouvelleCmdClientModule { }
