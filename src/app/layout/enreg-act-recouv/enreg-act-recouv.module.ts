import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';
import { EnregActRecouvRoutingModule } from './enreg-act-recouv-routing.module';
import { EnregActRecouvComponent } from './enreg-act-recouv.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
@NgModule({
  declarations: [EnregActRecouvComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    CalendarModule,
    FormsModule,
    ButtonModule,
    NgSelectModule,
    EnregActRecouvRoutingModule
  ]
})
export class EnregActRecouvModule { }
