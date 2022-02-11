import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ButtonModule} from 'primeng/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { AppurementReglementComponent } from './appurement-reglement.component';
import { AppurementReglementRoutingModule } from './appurement-reglement-routing.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';

@NgModule({
  declarations: [AppurementReglementComponent],
  imports: [
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    GridModule,
    RadioButtonModule,
    CommonModule,
    ConfirmDialogModule,
    NgSelectModule,
    AppurementReglementRoutingModule,
     FormsModule,
    MatCardModule,
    TableModule , FlexLayoutModule.withConfig({addFlexToParent: false})
  ],
  exports: [AppurementReglementComponent]
})
export class AppurementReglementModule { }
