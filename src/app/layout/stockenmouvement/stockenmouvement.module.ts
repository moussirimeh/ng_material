import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockenmouvementRoutingModule } from './stockenmouvement-routing.module';
import { StockenmouvementComponent } from './stockenmouvement.component';
import { MatCardModule } from '@angular/material';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ExcelExportService,GridModule } from '@syncfusion/ej2-angular-grids';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/primeng';

@NgModule({
  declarations: [StockenmouvementComponent],
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
    StockenmouvementRoutingModule
  ],
  providers: [ ExcelExportService]
})
export class StockenmouvementModule { }
