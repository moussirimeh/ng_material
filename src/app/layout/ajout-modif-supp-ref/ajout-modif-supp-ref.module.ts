import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {BlockUIModule} from 'primeng/blockui';
import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {PanelModule} from 'primeng/panel';

import { GridModule, SearchService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import {CalendarModule} from 'primeng/calendar';
import {  GridAllModule} from '@syncfusion/ej2-angular-grids';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { KeyFilterModule } from 'primeng/keyfilter';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { AjoutModifSuppRefRoutingModule } from './ajout-modif-supp-ref-routing.module';
import { AjoutModifSuppRefComponent } from './ajout-modif-supp-ref.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
@NgModule({
  declarations: [AjoutModifSuppRefComponent],
  imports: [
    CommonModule,
    InputTextModule,
    OverlayPanelModule,
    GridAllModule,
    ConfirmDialogModule,
    BlockUIModule,
    FlexLayoutModule,
    KeyFilterModule,
    InputTextareaModule,
    StatModule ,
    PanelModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    CalendarModule,
    AjoutModifSuppRefRoutingModule
  ],
  providers: [SearchService, ToolbarService]
})
export class AjoutModifSuppRefModule { }
