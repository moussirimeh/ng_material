import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule, SortService, EditService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { AnnulationCommandeComponent } from './annulation-commande.component';
import { AnnulationCommandeRoutingModule } from './annulation-commande-routing.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { KeyFilterModule } from 'primeng/keyfilter';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [AnnulationCommandeComponent],
  providers: [EditService, ToolbarService, SortService],
  imports: [
    ButtonModule,
    InputTextModule,
    GridAllModule,
    KeyFilterModule,
    RadioButtonModule,
    CommonModule,
    AnnulationCommandeRoutingModule,
    FormModule,
    MatCardModule,
    OverlayPanelModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class AnnulationCommandeModule {}
