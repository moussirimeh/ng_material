import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableauDeBordRoutingModule } from './tableau-de-bord-routing.module';
import { TableauDeBordComponent } from './tableau-de-bord.component';
import {KeyFilterModule} from 'primeng/keyfilter';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {BlockUIModule} from 'primeng/blockui';
import {TableModule} from 'primeng/table';
@NgModule({
  declarations: [TableauDeBordComponent],
  imports: [
    CommonModule,
    TableModule,
    BlockUIModule,
    KeyFilterModule,
    OverlayPanelModule,
    GridModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableauDeBordRoutingModule
  ]
})
export class TableauDeBordModule { }
