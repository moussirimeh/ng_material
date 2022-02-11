import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ValidationDesVisitesRoutingModule } from './validation-des-visites-routing.module';
import { ValidationDesVisitesComponent } from './validation-des-visites.component';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
@NgModule({
  declarations: [ValidationDesVisitesComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    ValidationDesVisitesRoutingModule
  ]
})
export class ValidationDesVisitesModule { }
