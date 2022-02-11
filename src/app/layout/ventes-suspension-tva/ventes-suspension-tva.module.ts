import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CalendarModule} from 'primeng/calendar';
import { VentesSuspensionTvaRoutingModule } from './ventes-suspension-tva-routing.module';
import { VentesSuspensionTvaComponent } from './ventes-suspension-tva.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { FormsModule  } from '@angular/forms';
import {DialogModule} from 'primeng/dialog';

@NgModule({
  declarations: [VentesSuspensionTvaComponent],
  imports: [
    CommonModule,
    VentesSuspensionTvaRoutingModule,
    CalendarModule,
    FormsModule ,
    DialogModule,
    OverlayPanelModule
  ]
})
export class VentesSuspensionTvaModule { }
