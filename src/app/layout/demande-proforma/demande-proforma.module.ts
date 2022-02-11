import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { DemandeProformaRoutingModule } from './demande-proforma-routing.module';
import { DemandeProformaComponent } from './demande-proforma.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
import {TableModule} from 'primeng/table';
import {KeyFilterModule} from 'primeng/keyfilter';
import { NouvelleCommandeModule } from '../nouvelle-commande/nouvelle-commande.module';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [DemandeProformaComponent],
  imports: [
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    DemandeProformaRoutingModule,
    FormModule,
    MatCardModule,
    OverlayPanelModule,
    DialogModule,
    TableModule,
    KeyFilterModule,
    NouvelleCommandeModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ],
  exports: [DemandeProformaComponent]
})
export class DemandeProformaModule {}
