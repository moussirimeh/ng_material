import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { StatModule } from '../../shared/modules/stat/stat.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { VenteDupBsRoutingModule } from './vente-dup-bs-routing.module';
import { VenteDupBsComponent } from './vente-dup-bs.component';

@NgModule({
  declarations: [VenteDupBsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    OverlayPanelModule,
    ToastModule,
    CommonModule,
    StatModule,
    FormModule,
    ReactiveFormsModule,
    NgSelectModule,
    ButtonModule,
    FlexLayoutModule.withConfig({addFlexToParent: false}),
    VenteDupBsRoutingModule
  ]
})
export class VenteDupBsModule { }
