import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangementreferenceRoutingModule } from './changementreference-routing.module';
import { ChangementreferenceComponent } from './changementreference.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule } from '@angular/material';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {BlockUIModule} from 'primeng/blockui';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';
@NgModule({
  declarations: [ChangementreferenceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ChangementreferenceRoutingModule,
    CommonModule,
    MatCardModule,
    MatSelectModule,
    OverlayPanelModule,
    BlockUIModule,
    ConfirmDialogModule,
    InputTextModule
  ],
})
export class ChangementreferenceModule {}
