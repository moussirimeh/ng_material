import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { DepensesCaisseSecondaireComponent } from './depenses-caisse-secondaire.component';
import { DepensesCaisseSecondaireRoutingModule } from './depenses-caisse-secondaire-routing.module';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputMaskModule} from 'primeng/inputmask';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [DepensesCaisseSecondaireComponent],
  imports: [
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    DepensesCaisseSecondaireRoutingModule,
    FormModule,
    MatCardModule,
    OverlayPanelModule,
    KeyFilterModule,
    InputMaskModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class DepensesCaisseSecondaireModule {}
