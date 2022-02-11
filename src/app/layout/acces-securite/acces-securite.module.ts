import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule  } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CalendarModule} from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { NgSelectModule } from '@ng-select/ng-select';



import { AccesSecuriteRoutingModule } from './acces-securite-routing.module';
import { AccesSecuriteComponent } from './acces-securite.component';
import { MatCardModule } from '@angular/material';

@NgModule({
  declarations: [AccesSecuriteComponent],
  imports: [
    CommonModule,
    InputTextModule,
    RadioButtonModule,
    NgSelectModule,
    MatCardModule,
    FormsModule,
    GridModule,
    ButtonModule,
    CalendarModule,
    OverlayPanelModule,
    AccesSecuriteRoutingModule
  ]
})
export class AccesSecuriteModule { }
