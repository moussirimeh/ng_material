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
import { NgSelectModule } from '@ng-select/ng-select';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FournisseurComponent } from './fournisseur.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {BlockUIModule} from 'primeng/blockui';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    SelectButtonModule,
    KeyFilterModule,
    FormsModule,
    FournisseurRoutingModule,
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
    PanelModule,
    OverlayPanelModule,
    BlockUIModule
  ],
  declarations: [FournisseurComponent]
})
export class FournisseurModule {}
