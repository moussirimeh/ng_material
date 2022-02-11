import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';

import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { StatModule } from '../../shared/modules/stat/stat.module';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { VenteBsfermesRoutingModule } from './vente-bsfermes-routing.module';
import { VenteBsfermesComponent } from './vente-bsfermes.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
@NgModule({
  declarations: [VenteBsfermesComponent],
  imports: [
    CommonModule,
    GridAllModule,
    GridModule,
    MatPaginatorModule,
    StatModule,
    MatCardModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteBsfermesRoutingModule
  ]
})
export class VenteBsfermesModule { }
