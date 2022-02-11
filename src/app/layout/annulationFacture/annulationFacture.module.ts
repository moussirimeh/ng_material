import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AnnulationFactureRoutingModule } from './annulationFacture-routing.module';
import { AnnulationFactureComponent } from './annulationFacture.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BlockUIModule} from 'primeng/blockui';

@NgModule({
  imports: [
    CommonModule,
    AnnulationFactureRoutingModule,
    CardModule,
    PanelModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    GridModule,
    OverlayPanelModule,
    KeyFilterModule,
    ConfirmDialogModule,
    BlockUIModule
  ],
  declarations: [AnnulationFactureComponent]
})
export class AnnulationFactureModule {}
