


import {InputTextModule} from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule } from 'primeng/button';
import { VenteModifBSRoutingModule } from './vente-modif-bs-routing.module';
import { VenteModifBSComponent } from './vente-modif-bs.component';
import { PanelModule } from 'primeng/panel';
import {CalendarModule} from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
// import {  GridAllModule } from '@syncfusion/ej2-angular-grids';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';

import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { StatModule } from '../../shared/modules/stat/stat.module';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { GridModule } from '@syncfusion/ej2-angular-grids';
@NgModule({
  declarations: [ VenteModifBSComponent],
  imports: [
    CommonModule,
      InputTextModule,
      GridModule,
      GridAllModule,
      ToastModule,
      CalendarModule,
      CommonModule,
      OverlayPanelModule,
      MatPaginatorModule,
      StatModule,
      PanelModule,
      MatCardModule,
      MatCardModule,
      MatTableModule,
      MatButtonModule,
      MatGridListModule,
      MatIconModule,
      MatAutocompleteModule,
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
      NgSelectModule,
      ButtonModule,

      FlexLayoutModule.withConfig({addFlexToParent: false}),
      VenteModifBSRoutingModule
  ]
})
export class VenteModifBSModule { }
