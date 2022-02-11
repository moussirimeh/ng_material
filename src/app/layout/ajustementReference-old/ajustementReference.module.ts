import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';

import { AjustementReferenceRoutingModule } from './ajustementReference-routing.module';
import { AjustementReferenceComponent } from './ajustementReference.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    FormsModule,
    AjustementReferenceRoutingModule,
    CalendarModule,
    GridModule,
    MatCardModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    TableModule,
    TabViewModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    CardModule,
    InputTextModule,
    MatSliderModule,
    MatSlideToggleModule,
    DropdownModule,
    PanelModule
  ],
  declarations: [AjustementReferenceComponent]
})
export class AjustementReferenceModule {}
