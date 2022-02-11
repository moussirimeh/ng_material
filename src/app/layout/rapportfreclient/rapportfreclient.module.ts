import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RapportfreclientRoutingModule } from './rapportfreclient-routing.module';
import { RapportfreclientComponent } from './rapportfreclient.component';
import { MatCardModule } from '@angular/material';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import { GridModule } from '@syncfusion/ej2-angular-grids';
@NgModule({
  declarations: [RapportfreclientComponent],
  imports: [
    MatCardModule,
    ButtonModule,
    CalendarModule,
    CommonModule,
    FormsModule ,
    TabViewModule,
    NgSelectModule,
    GridModule ,
    RapportfreclientRoutingModule
  ]
})
export class RapportfreclientModule { }
