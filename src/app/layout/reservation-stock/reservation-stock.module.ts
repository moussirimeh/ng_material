import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ButtonModule} from 'primeng/button';
import { ReservationStockRoutingModule } from './reservation-stock-routing.module';
import { ReservationStockComponent } from './reservation-stock.component';
import {TabViewModule} from 'primeng/tabview';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
@NgModule({
  declarations: [ReservationStockComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    InputTextModule,
    TabViewModule,
    GridModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    ReservationStockRoutingModule
  ]
})
export class ReservationStockModule { }
