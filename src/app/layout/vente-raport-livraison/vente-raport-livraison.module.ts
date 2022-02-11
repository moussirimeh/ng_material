import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule } from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import { PanelModule } from 'primeng/panel';
import {RadioButtonModule} from 'primeng/radiobutton';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {  GridAllModule} from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';


import { VenteRaportLivraisonRoutingModule } from './vente-raport-livraison-routing.module';
import { VenteRaportLivraisonComponent } from './vente-raport-livraison.component';

@NgModule({
  declarations: [VenteRaportLivraisonComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    InputTextModule,
    CommonModule,
    StatModule,
    PanelModule,
    GridModule,
    ToastModule,
    GridAllModule,
    RadioButtonModule,
    FormModule,
    ReactiveFormsModule,
    CalendarModule,
    NgSelectModule,
    ButtonModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteRaportLivraisonRoutingModule
  ]
})
export class VenteRaportLivraisonModule { }
