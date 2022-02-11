import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridAllModule, SortService, EditService, ToolbarService } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { AnnulationProformaComponent } from './annulation-proforma.component';
import { AnnulationProformaRoutingModule } from './annulation-proforma-routing.module';
import {KeyFilterModule} from 'primeng/keyfilter';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [AnnulationProformaComponent],
  providers: [EditService, ToolbarService, SortService],
  imports: [
    ButtonModule,
    InputTextModule,
    GridAllModule,
    KeyFilterModule,
    RadioButtonModule,
    CommonModule,
    AnnulationProformaRoutingModule,
    FormModule,
    MatCardModule,
    OverlayPanelModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class AnnulationProformaModule {}
