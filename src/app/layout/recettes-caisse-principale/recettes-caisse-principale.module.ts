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
import { RecettesCaissePrincipaleComponent } from './recettes-caisse-principale.component';
import { RecettesCaissePrincipaleRoutingModule } from './recettes-caisse-principale-routing.module';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputMaskModule} from 'primeng/inputmask';
@NgModule({
  declarations: [RecettesCaissePrincipaleComponent],
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
    RecettesCaissePrincipaleRoutingModule,
    FormModule,
    MatCardModule,
    OverlayPanelModule,
    KeyFilterModule,
    InputMaskModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class RecettesCaissePrincipaleModule {}
