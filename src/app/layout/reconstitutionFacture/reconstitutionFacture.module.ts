import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReconstitutionFactureRoutingModule } from './reconstitutionFacture-routing.module';
import { ReconstitutionFactureComponent } from './reconstitutionFacture.component';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';


@NgModule({
  imports: [
    CommonModule,
    ReconstitutionFactureRoutingModule,
    CardModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    CalendarModule,
    DropdownModule,
    PanelModule,
    BlockUIModule,
    ProgressSpinnerModule,
    InputTextModule,
    OverlayPanelModule,
    KeyFilterModule
  ],
  declarations: [ReconstitutionFactureComponent]
})
export class ReconstitutionFactureModule {}
