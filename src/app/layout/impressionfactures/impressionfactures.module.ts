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
import {CheckboxModule} from 'primeng/checkbox';
import { ImpressionFacturesRoutingModule } from './impressionfactures-routing.module';
import { ImpressionFacturesComponent } from './impressionfactures.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {ProgressBarModule} from 'primeng/progressbar';
import {OverlayPanelModule} from 'primeng/overlaypanel';
@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ImpressionFacturesRoutingModule,
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
    CheckboxModule,
    ProgressBarModule,
    OverlayPanelModule
  ],
   declarations: [ImpressionFacturesComponent],
   exports: [ImpressionFacturesComponent]
})
export class ImpressionFacturesModule {}
