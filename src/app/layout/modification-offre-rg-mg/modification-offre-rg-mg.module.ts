import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import {
  FormsModule as FormModule
} from '@angular/forms';
import {GridAllModule, SortService, EditService,  ToolbarService, } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {TableModule} from 'primeng/table';
import {CardModule} from 'primeng/card';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';

import { ModificationOffreRgMgRoutingModule } from './modification-offre-rg-mg-routing.module';
import { ModificationOffreRgMgComponent } from './modification-offre-rg-mg.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import {DialogModule} from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePipe } from '@angular/common';
import { ReleveClientModule } from '../releveClient/releveClient.module';
import { CmdsFrsNonSoldeesModule } from '../cmds-frs-non-soldees/cmds-frs-non-soldees.module';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [ModificationOffreRgMgComponent],
  providers: [EditService, ToolbarService, SortService, DatePipe],
  imports: [
    ConfirmDialogModule,
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
    InputTextareaModule,
    RadioButtonModule,
    ModificationOffreRgMgRoutingModule,
    ReleveClientModule,
    CmdsFrsNonSoldeesModule,
    DialogModule,
    CheckboxModule,
    TabViewModule,
    BlockUIModule
  ]
})
export class ModificationOffreRgMgModule { }
