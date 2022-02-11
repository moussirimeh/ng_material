import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';

import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { VenteConsltBsRoutingModule } from './vente-conslt-bs-routing.module';
import { VenteConsltBsComponent } from './vente-conslt-bs.component';


@NgModule({
  declarations: [VenteConsltBsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    CalendarModule,
    CommonModule,
    MatPaginatorModule,
    MatGridListModule,
    StatModule,
    ToastModule ,
    PanelModule,
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
    OverlayPanelModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteConsltBsRoutingModule
  ]
})
export class VenteConsltBsModule { }
