import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FusionreferenceRoutingModule } from './fusionreference-routing.module';
import { FusionreferenceComponent } from './fusionreference.component';
import { MatButtonModule, MatIconModule, MatTableModule , MatPaginatorModule} from '@angular/material';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
    MatFormFieldModule, MatInputModule, MatNativeDateModule, MatRadioModule, MatSelectModule,
    MatSliderModule, MatSlideToggleModule
} from '@angular/material';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [FusionreferenceComponent],
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,
    NgSelectModule,
    FusionreferenceRoutingModule,
    CommonModule,
        MatPaginatorModule,
        MatGridListModule,
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
        MatSliderModule
  ]
})
export class FusionreferenceModule { }
