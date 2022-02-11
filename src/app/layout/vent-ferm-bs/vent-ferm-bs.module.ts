import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { VentFermBsRoutingModule } from './vent-ferm-bs-routing.module';
import { VentFermBsComponent } from './vent-ferm-bs.component';

@NgModule({
  declarations: [VentFermBsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    ToastModule,
    CalendarModule,
    CommonModule,
    MessagesModule,
    MessageModule,
    StatModule,
    PanelModule,
    OverlayPanelModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VentFermBsRoutingModule
  ]
})
export class VentFermBsModule { }
