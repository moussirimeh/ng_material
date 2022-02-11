import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TransfertAuContentieuxRoutingModule } from './transfert-au-contentieux-routing.module';
import { TransfertAuContentieuxComponent } from './transfert-au-contentieux.component';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputTextModule } from 'primeng/inputtext';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BlockUIModule} from 'primeng/blockui';

@NgModule({
  imports: [
    CommonModule,
    TransfertAuContentieuxRoutingModule,
    PanelModule,
    ButtonModule,
    CardModule,
    FormsModule,
    NgSelectModule,
    InputTextModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    BlockUIModule
  ],
  declarations: [TransfertAuContentieuxComponent],
})
export class TransfertAuContentieuxModule {}
