

import { AvoirSurAchatRoutingModule } from './avoir-sur-achat-routing.module';
import { AvoirSurAchatComponent } from './avoir-sur-achat.component';

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


import {TableModule} from 'primeng/table';
import {PanelModule} from 'primeng/panel';

import {CardModule} from 'primeng/card';

@NgModule({
  declarations: [AvoirSurAchatComponent],
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
    AvoirSurAchatRoutingModule
  ]
})
export class AvoirSurAchatModule { }
