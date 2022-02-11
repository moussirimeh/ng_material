import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule} from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule, MatCardModule, MatDatepickerModule,
    MatFormFieldModule, MatNativeDateModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { StatModule } from '../../shared/modules/stat/stat.module';

import { GridAllModule,  GridModule  } from '@syncfusion/ej2-angular-grids';

import { VenteBSOuvertsRoutingModule } from './vente-bsouverts-routing.module';
import { VenteBSOuvertsComponent } from './vente-bsouverts.component';

@NgModule({
  declarations: [VenteBSOuvertsComponent],
  imports: [
    CommonModule,
    GridAllModule,
    GridModule,
   MatPaginatorModule,
   MatGridListModule,
   StatModule,
   MatCardModule,
   MatCardModule,
   MatTableModule,
   MatButtonModule,
   MatIconModule,
   MatAutocompleteModule,
   FormModule,
   ReactiveFormsModule,
   MatSlideToggleModule,
   MatFormFieldModule,
   MatCardModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatFormFieldModule,
   MatSelectModule,
   MatSliderModule,
   FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteBSOuvertsRoutingModule
  ]
})
export class VenteBSOuvertsModule { }
