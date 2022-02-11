import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ListeDesProformatsRoutingModule } from './liste-des-proformats-routing.module';
import { ListeDesProformatsComponent } from './liste-des-proformats.component';
import {CalendarModule} from 'primeng/calendar';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
@NgModule({
  declarations: [ListeDesProformatsComponent],
  imports: [
    CommonModule,
    ListeDesProformatsRoutingModule,
    InputTextModule,
    OverlayPanelModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    CalendarModule,
    GridModule,
  ]
})
export class ListeDesProformatsModule { }
