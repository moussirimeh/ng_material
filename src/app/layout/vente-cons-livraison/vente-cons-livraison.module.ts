import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { VenteConsLivraisonRoutingModule } from './vente-cons-livraison-routing.module';
import { VenteConsLivraisonComponent } from './vente-cons-livraison.component';

@NgModule({
  declarations: [VenteConsLivraisonComponent],
  imports: [
    CommonModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    CalendarModule,
    CommonModule,
    MatPaginatorModule,
    MatGridListModule,
    ToastModule ,
    PanelModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,
    OverlayPanelModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteConsLivraisonRoutingModule
  ]
})
export class VenteConsLivraisonModule { }
