import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/primeng';
import { ConsultationEmplacementRoutingModule } from './consultation-emplacement-routing.module';
import { ConsultationEmplacementComponent } from './consultation-emplacement.component';
import { ButtonModule, InputTextModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [ConsultationEmplacementComponent],
  imports: [
    CommonModule,
    ConsultationEmplacementRoutingModule,
    InputTextModule,
    FormsModule,
    GridModule ,
    OverlayPanelModule,
    ButtonModule
  ]
})
export class ConsultationEmplacementModule { }
