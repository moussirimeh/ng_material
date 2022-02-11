import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimpressionBordRoutingModule } from './reimpression-bord-routing.module';
import { ReimpressionBordComponent } from './reimpression-bord.component';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { KeyFilterModule } from 'primeng/keyfilter';
@NgModule({
  declarations: [ReimpressionBordComponent],
  imports: [
    CommonModule,
    KeyFilterModule,
    InputTextModule,
    FormModule,
    OverlayPanelModule,
    RadioButtonModule,
    ButtonModule,
    ReactiveFormsModule,
    ReimpressionBordRoutingModule
  ]
})
export class ReimpressionBordModule { }
