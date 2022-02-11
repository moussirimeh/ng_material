import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {MatCardModule,
} from '@angular/material';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ButtonModule} from 'primeng/button';

import { FlexLayoutModule } from '@angular/flex-layout';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';

import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { CheckBoxModule } from '@syncfusion/ej2-angular-buttons';
import {TableModule} from 'primeng/table';
import { ApurementRegtsCmptComponent } from './apurement-regts-cmpt.component';
import { ApurementRegtsCmptRoutingModule } from './apurement-regts-cmpt-routing.module';

@NgModule({
  declarations: [ApurementRegtsCmptComponent],
  imports: [
    // CheckBoxModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    GridModule,
    RadioButtonModule,
    CommonModule,
    ConfirmDialogModule,
    NgSelectModule,
    ApurementRegtsCmptRoutingModule,
    FormModule,
    MatCardModule,
    TableModule,
    FlexLayoutModule.withConfig({addFlexToParent: false})
  ],

})
export class  ApurementRegtsCmptModule { }
