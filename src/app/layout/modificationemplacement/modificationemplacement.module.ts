import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModificationemplacementRoutingModule } from './modificationemplacement-routing.module';
import { ModificationemplacementComponent } from './modificationemplacement.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import {KeyFilterModule} from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/primeng';
import {TableModule} from 'primeng/table';
import { GridModule } from '@syncfusion/ej2-angular-grids';
@NgModule({
  declarations: [ModificationemplacementComponent],
  imports: [
    CommonModule,
    FormsModule ,
    TableModule,
    TabViewModule,
    NgSelectModule,
    InputTextModule,
    KeyFilterModule,
    OverlayPanelModule,
    GridModule ,
    ModificationemplacementRoutingModule
  ]
})
export class ModificationemplacementModule { }
