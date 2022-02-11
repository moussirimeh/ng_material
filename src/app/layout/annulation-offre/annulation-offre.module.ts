import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { GridAllModule} from '@syncfusion/ej2-angular-grids';
import { NgModule } from '@angular/core';
import { AnnulationOffreComponent } from './annulation-offre.component';
import { AnnulationOffreRoutingModule } from './annulation-offre-routing.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {BlockUIModule} from 'primeng/blockui';

@NgModule({
  declarations: [AnnulationOffreComponent],
  imports: [
    ButtonModule,
    GridAllModule,
    CommonModule,
    AnnulationOffreRoutingModule,
    FormModule,
    OverlayPanelModule,
    PanelModule,
    InputTextModule,
    ConfirmDialogModule,
    BlockUIModule
  ]
})
export class AnnulationOffreModule {}
