import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule } from '@angular/forms';
import {
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatSliderModule,
} from '@angular/material';

import { EquivalenceRoutingModule } from './equivalence-routing.module';
import { EquivalenceComponent } from './equivalence.component';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';
// import { MessagesModule } from 'primeng/messages';
// import { MessageModule } from 'primeng/message';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {MatIconModule} from '@angular/material/icon';
import {KeyFilterModule} from 'primeng/keyfilter';
import {BlockUIModule} from 'primeng/blockui';
import {ButtonModule} from 'primeng/button';
@NgModule({
  imports: [
    CommonModule,
    EquivalenceRoutingModule,
    MatButtonModule,
    FormModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    GridModule,
    InputTextModule,
    OverlayPanelModule,
    // MessageModule,
    // MessagesModule,
    ConfirmDialogModule,
    MatIconModule,
    KeyFilterModule,
    BlockUIModule,
    ButtonModule,
    FlexLayoutModule.withConfig({ addFlexToParent: false }),
  ],
  declarations: [EquivalenceComponent],
})
export class EquivalenceModule {}
