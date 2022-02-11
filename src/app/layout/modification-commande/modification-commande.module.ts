import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';

import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule, SortService, EditService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { ModificationCommandeComponent } from './modification-commande.component';
import { ModificationCommandeRoutingModule } from './modification-commande-routing.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { KeyFilterModule } from 'primeng/keyfilter';
import {TableModule} from 'primeng/table';
import {InputMaskModule} from 'primeng/inputmask';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [ModificationCommandeComponent],
  providers: [EditService, ToolbarService, SortService],
  imports: [
    DialogModule,
    CalendarModule,
    DropdownModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    ModificationCommandeRoutingModule,
    FormModule,
    MatCardModule,
    KeyFilterModule,
    TableModule,
    InputMaskModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class ModificationCommandeModule {}
