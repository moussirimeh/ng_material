import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {TabViewModule} from 'primeng/tabview';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

import {CheckboxModule} from 'primeng/checkbox';
import {OverlayPanelModule} from 'primeng/overlaypanel';

import { TransitRoutingModule } from './transit-routing.module';
import { TransitComponent } from './transit.component';
import {BlockUIModule} from 'primeng/blockui';
import {FieldsetModule} from 'primeng/fieldset';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { AddRowDirective } from './add-row.directive';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
@NgModule({
  declarations: [TransitComponent, AddRowDirective],
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    BlockUIModule,
    OverlayPanelModule,
    GridModule,
    TabViewModule,
    FieldsetModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    NgSelectModule,

    CheckboxModule,
    TransitRoutingModule
  ]
})
export class TransitModule { }
