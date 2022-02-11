import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {
  FormsModule as FormModule
} from '@angular/forms';
import {
  GridAllModule
} from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { AvoirComponent } from './avoir.component';
import { AvoirRoutingModule } from './avoir-routing.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {TableModule} from 'primeng/table';
import {RadioButtonModule} from 'primeng/radiobutton';
import {CheckboxModule} from 'primeng/checkbox';
import {DialogModule} from 'primeng/dialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BlockUIModule} from 'primeng/blockui';
import { DuplicataModule } from '../duplicata/duplicata.module';
@NgModule({
  declarations: [AvoirComponent],
  imports: [
    CalendarModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    CommonModule,
    NgSelectModule,
    AvoirRoutingModule,
    FormModule,
    KeyFilterModule,
    OverlayPanelModule,
    TableModule,
    RadioButtonModule,
    CheckboxModule,
    DialogModule,
    BlockUIModule,
    ConfirmDialogModule,
    DuplicataModule
  ],
})
export class AvoirModule {}
