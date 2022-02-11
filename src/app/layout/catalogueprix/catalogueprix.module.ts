import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule, MatIconModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule
} from '@angular/material';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CatalogueprixComponent } from './catalogueprix.component';
import { CatalogueprixRoutingModule } from './catalogueprix-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule } from 'primeng/inputtext';
import {CheckboxModule} from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {DialogModule} from 'primeng/dialog';
import { DemandeProformaModule } from '../demande-proforma/demande-proforma.module';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [CatalogueprixComponent],
  imports: [
    InputTextModule,
    GridModule,
    RadioButtonModule,

    ConfirmDialogModule,
    NgSelectModule,
    CatalogueprixRoutingModule,
    CommonModule,
    MatPaginatorModule,
    MatGridListModule,

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
    CheckboxModule,
    OverlayPanelModule,
    DialogModule,
    DemandeProformaModule,
    BlockUIModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false })
  ]
})
export class CatalogueprixModule {}
