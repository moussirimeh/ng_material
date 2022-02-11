import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { EtatStockMortRoutingModule } from './etat-stock-mort-routing.module';
import { EtatStockMortComponent } from './etat-stock-mort.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel'; @NgModule({
  declarations: [EtatStockMortComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    NgSelectModule,
    GridModule,
    FormsModule,
    ButtonModule,
    EtatStockMortRoutingModule
  ]
})
export class EtatStockMortModule { }
