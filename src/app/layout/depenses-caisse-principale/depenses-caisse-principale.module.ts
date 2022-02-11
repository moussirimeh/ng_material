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
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { NgSelectModule } from '@ng-select/ng-select';
import { CalendarModule } from 'primeng/calendar';
import { NgModule } from '@angular/core';
import { DepensesCaissePrincipaleComponent } from './depenses-caisse-principale.component';
import { DepensesCaissePrincipaleRoutingModule } from './depenses-caisse-principale-routing.module';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputMaskModule} from 'primeng/inputmask';

@NgModule({
  declarations: [DepensesCaissePrincipaleComponent],
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
    DepensesCaissePrincipaleRoutingModule,
    FormModule,
    MatCardModule,
    KeyFilterModule,
    InputMaskModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class DepensesCaissePrincipaleModule {}
