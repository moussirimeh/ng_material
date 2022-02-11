import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';

import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule} from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {FieldsetModule} from 'primeng/fieldset';
import {KeyFilterModule} from 'primeng/keyfilter';
import {CheckboxModule} from 'primeng/checkbox';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {TableModule} from 'primeng/table';
import {BlockUIModule} from 'primeng/blockui';


import { ReceptionRegltFournisseurRoutingModule } from './reception-reglt-fournisseur-routing.module';
import { ReceptionRegltFournisseurComponent } from './reception-reglt-fournisseur.component';

@NgModule({
  declarations: [ReceptionRegltFournisseurComponent],
  imports: [
  CommonModule,
  TableModule ,
  FieldsetModule ,
  ConfirmDialogModule,
  MessageModule,
  MessagesModule,
  InputTextModule,
  BlockUIModule,
  GridModule,
  GridAllModule,
  CalendarModule,
  CheckboxModule,
  OverlayPanelModule,
  StatModule,
  ToastModule ,
  FormsModule,
  KeyFilterModule,
  NgSelectModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    ReceptionRegltFournisseurRoutingModule
  ]
})
export class ReceptionRegltFournisseurModule { }
