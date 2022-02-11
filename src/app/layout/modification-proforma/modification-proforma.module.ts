import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
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
import { ModificationProformaComponent } from './modification-proforma.component';
import { ModificationProformaRoutingModule } from './modification-proforma-routing.module';
import { KeyFilterModule } from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {TableModule} from 'primeng/table';
import {DialogModule} from 'primeng/dialog';
import { NouvelleCommandeModule } from '../nouvelle-commande/nouvelle-commande.module';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [ModificationProformaComponent],
  providers: [EditService, ToolbarService, SortService],
  imports: [
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    ModificationProformaRoutingModule,
    FormModule,
    MatCardModule,
    KeyFilterModule,
    OverlayPanelModule,
    TableModule,
    DialogModule,
    BlockUIModule,
    NouvelleCommandeModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class ModificationProformaModule {}
