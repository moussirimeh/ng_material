import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReconstitutionFactureTermeRoutingModule } from './reconstitution-facture-terme-routing.module';
import { ReconstitutionFactureTermeComponent } from './reconstitution-facture-terme.component';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BlockUIModule } from 'primeng/blockui';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {InputTextModule} from 'primeng/inputtext';
import {KeyFilterModule} from 'primeng/keyfilter';

@NgModule({
  imports: [
    CommonModule,
    ReconstitutionFactureTermeRoutingModule,
    CardModule,
    FormsModule,
    NgSelectModule,
    GridModule,
    CalendarModule,
    DropdownModule,
    PanelModule,
    BlockUIModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    InputTextModule,
    KeyFilterModule
  ],
  declarations: [ReconstitutionFactureTermeComponent]
})
export class ReconstitutionFactureTermeModule {}
