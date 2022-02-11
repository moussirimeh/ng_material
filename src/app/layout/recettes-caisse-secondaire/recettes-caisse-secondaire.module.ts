import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { NgSelectModule } from '@ng-select/ng-select';

import { CalendarModule } from 'primeng/calendar';
import { RecettesCaisseSecondaireComponent } from './recettes-caisse-secondaire.component';
import { NgModule } from '@angular/core';
import { RecettesCaisseSecondaireRoutingModule } from './recettes-caisse-secondaire-routing.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {BlockUIModule} from 'primeng/blockui';
import {InputMaskModule} from 'primeng/inputmask';
@NgModule({
  declarations: [RecettesCaisseSecondaireComponent],
  imports: [
    // ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    // ToastModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    RecettesCaisseSecondaireRoutingModule,
    FormModule,
    MatCardModule,
    OverlayPanelModule,
    KeyFilterModule,
    BlockUIModule,
    InputMaskModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class RecettesCaisseSecondaireModule {}
