import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import {CardModule} from 'primeng/card';
import {TabViewModule} from 'primeng/tabview';
import { NgSelectModule } from '@ng-select/ng-select';
import {PasswordModule} from 'primeng/password';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {ButtonModule } from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CalendarModule} from 'primeng/calendar';
import { VenteAnalyseCaRoutingModule } from './vente-analyse-ca-routing.module';
import { VenteAnalyseCaComponent } from './vente-analyse-ca.component';

@NgModule({
  declarations: [VenteAnalyseCaComponent],
  imports: [
    CommonModule,
    TabViewModule,
    InputTextModule,
    GridModule,
    CalendarModule,
    OverlayPanelModule,
    GridAllModule,
    ButtonModule,
    CardModule,
    CommonModule,
    ToastModule ,
    PanelModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,
    PasswordModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteAnalyseCaRoutingModule
  ]
})
export class VenteAnalyseCaModule { }
