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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NgSelectModule } from '@ng-select/ng-select';

import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { FeuilleCaissePrincipaleComponent } from './feuille-caisse-principale.component';
import { FeuilleCaissePrincipaleRoutingModule } from './feuille-caisse-principale-routing.module';

@NgModule({
  declarations: [FeuilleCaissePrincipaleComponent],
  imports: [
    ConfirmDialogModule,
    CalendarModule,
    DropdownModule,
    OverlayPanelModule,
    ButtonModule,
    InputTextModule,
    GridAllModule,
    RadioButtonModule,
    CommonModule,
    NgSelectModule,
    FeuilleCaissePrincipaleRoutingModule,
    FormModule,
    MatCardModule,


    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class FeuilleCaissePrincipaleModule {}
