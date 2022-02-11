import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule, SearchService, ToolbarService} from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';

import {
  MatIconModule,
  MatButtonModule
} from '@angular/material';
import { VenteLivraisonRoutingModule } from './vente-livraison-routing.module';
import { VenteLivraisonComponent } from './vente-livraison.component';


@NgModule({
  declarations: [VenteLivraisonComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MessageModule,
    MessagesModule,
    DialogModule,
    InputTextModule,
    GridModule,
    CardModule,
    GridAllModule,
    CalendarModule,
    KeyFilterModule,
    CommonModule,
    OverlayPanelModule,
    StatModule,
    ToastModule ,
    PanelModule,
    KeyFilterModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteLivraisonRoutingModule
  ],
  providers: [
    SearchService,
    ToolbarService
    ]
})
export class VenteLivraisonModule { }
