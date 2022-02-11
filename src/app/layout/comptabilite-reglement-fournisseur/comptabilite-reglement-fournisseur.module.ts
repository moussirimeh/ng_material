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
import { AddRowDirective } from './add-row.directive';

import { ComptabiliteReglementFournisseurRoutingModule } from './comptabilite-reglement-fournisseur-routing.module';
import { ComptabiliteReglementFournisseurComponent } from './comptabilite-reglement-fournisseur.component';

@NgModule({
  declarations: [ComptabiliteReglementFournisseurComponent,
                 AddRowDirective],
  imports: [
    CommonModule,
    TableModule ,
    FieldsetModule ,
    ConfirmDialogModule,
    MessageModule,
    MessagesModule,
    InputTextModule,
    GridModule,
    GridAllModule,
    CalendarModule,
    CommonModule,
    CheckboxModule,
    OverlayPanelModule,
    StatModule,
    ToastModule ,
    FormsModule,
    KeyFilterModule,
    NgSelectModule,

    FlexLayoutModule.withConfig({addFlexToParent: false}),
    ComptabiliteReglementFournisseurRoutingModule
  ]
})
export class ComptabiliteReglementFournisseurModule { }
