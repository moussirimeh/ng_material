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
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { FeuilleCaisseSecondaireComponent } from './feuille-caisse-secondaire.component';
import { FeuilleCaisseSecondaireRoutingModule } from './feuille-caisse-secondaire-routing.module';

@NgModule({
  declarations: [FeuilleCaisseSecondaireComponent],
  imports: [
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    FeuilleCaisseSecondaireRoutingModule,
    FormModule,
    MatCardModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class FeuilleCaisseSecondaireModule {}
