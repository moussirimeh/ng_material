

import { AchatRoutingModule } from './achat-routing.module';
import { AchatComponent } from './achat.component';
import {BlockUIModule} from 'primeng/blockui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import {
  FormsModule as FormModule
} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import {GridAllModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
import { ReeditionRapportAchatModule } from '../reedition-rapport-achat/reedition-rapport-achat.module';

import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';

import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [AchatComponent],
  providers: [],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    CalendarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    GridAllModule,
    CommonModule,
    PanelModule,
    NgSelectModule,
    BlockUIModule,
    FormModule,
    KeyFilterModule,
    OverlayPanelModule,
    AchatRoutingModule,
    ReeditionRapportAchatModule
  ]
})
export class AchatModule { }
