import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockStableRoutingModule } from './stock-stable-routing.module';
import { StockStableComponent } from './stock-stable.component';
import { MatCardModule } from '@angular/material';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GridModule, SortService } from '@syncfusion/ej2-angular-grids';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/primeng';
@NgModule({
  declarations: [StockStableComponent],
  imports: [
    CommonModule,
    MatCardModule,
    ButtonModule,
    CalendarModule,
    CommonModule,
    FormsModule ,
    RadioButtonModule,
    NgSelectModule,
    GridModule ,
    OverlayPanelModule,
    StockStableRoutingModule
  ],
  providers: [SortService]
})
export class StockStableModule { }
