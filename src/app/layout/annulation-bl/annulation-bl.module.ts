import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { AnnulationBLRoutingModule } from './annulation-bl-routing.module';
import { AnnulationBLComponent } from '../annulation-bl/annulation-bl.component';
import {BlockUIModule} from 'primeng/blockui';

@NgModule({
  declarations: [AnnulationBLComponent],
  imports: [
    CommonModule,
    InputTextModule,
    GridModule,
    OverlayPanelModule,
    PanelModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,
    CardModule,
    ConfirmDialogModule,
    SharedModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    AnnulationBLRoutingModule
  ]
})
export class AnnulationBLModule { }
