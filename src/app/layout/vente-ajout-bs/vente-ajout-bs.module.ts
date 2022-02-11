import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import { StatModule } from '../../shared/modules/stat/stat.module';
import { FilterService } from '@syncfusion/ej2-angular-grids';
import { ToastModule } from 'primeng/toast';
import { VenteAjoutBSRoutingModule } from './vente-ajout-bs-routing.module';
import { VenteAjoutBSComponent } from './vente-ajout-bs.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule } from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';

import {TooltipModule} from 'primeng/tooltip';
@NgModule({
  declarations: [VenteAjoutBSComponent],
  imports: [
    OverlayPanelModule,
      InputTextModule,
      ToastModule,
      CommonModule,
      MatPaginatorModule,
      MessageModule,
      MessagesModule,
      MatGridListModule,
      TooltipModule,
      StatModule,
      MatCardModule,
      MatCardModule,
      MatTableModule,
      MatButtonModule,
      MatIconModule,
      MatAutocompleteModule,
      FormModule,
      ReactiveFormsModule,
      MatSlideToggleModule,
      MatFormFieldModule,
      MatInputModule,
      MatCardModule,
      MatCheckboxModule,
      MatRadioModule,
      MatDatepickerModule,
      MatNativeDateModule,
      MatFormFieldModule,
      MatSelectModule,
      MatSliderModule,
      NgSelectModule,
      ButtonModule,

      FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteAjoutBSRoutingModule
  ],
  providers: [FilterService]
})
export class VenteAjoutBSModule { }
