import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtatVisiteClientRoutingModule } from './etat-visite-client-routing.module';
import { EtatVisiteClientComponent } from './etat-visite-client.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule, CalendarModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';


@NgModule({
  declarations: [EtatVisiteClientComponent],
  providers: [ExcelExportService],
  imports: [
    CommonModule,
    EtatVisiteClientRoutingModule,
    NgSelectModule,
    ButtonModule ,
    CalendarModule ,
    FormsModule ,
    GridModule
  ]
})
export class EtatVisiteClientModule { }
