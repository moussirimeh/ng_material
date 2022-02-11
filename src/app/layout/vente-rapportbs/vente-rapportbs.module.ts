import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule } from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { VenteRapportbsRoutingModule } from './vente-rapportbs-routing.module';
import { VenteRapportbsComponent } from './vente-rapportbs.component';

@NgModule({
  declarations: [VenteRapportbsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ToastModule,
    CalendarModule,
    OverlayPanelModule,
    CommonModule,
    StatModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteRapportbsRoutingModule
  ]
})
export class VenteRapportbsModule { }
