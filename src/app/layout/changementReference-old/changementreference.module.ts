import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangementreferenceRoutingModule } from './changementreference-routing.module';
import { ChangementreferenceComponent } from './changementreference.component';
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
import { InputTextModule } from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
@NgModule({
  declarations: [ChangementreferenceComponent],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    NgSelectModule,
    ChangementreferenceRoutingModule,
    CommonModule,
    ToastModule,
    InputTextModule,
        MatPaginatorModule,
        MatGridListModule,
        MatCardModule,
        MessagesModule,
        MessageModule,
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
export class ChangementreferenceModule { }
