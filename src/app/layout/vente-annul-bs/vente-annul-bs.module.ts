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
import {ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import {  GridAllModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { VenteAnnulBsRoutingModule } from './vente-annul-bs-routing.module';
import { VenteAnnulBsComponent } from './vente-annul-bs.component';

@NgModule({
  declarations: [VenteAnnulBsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    CalendarModule,
    OverlayPanelModule,
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
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteAnnulBsRoutingModule
  ]
})
export class VenteAnnulBsModule { }
