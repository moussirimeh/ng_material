import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { AutorisationOffreRoutingModule } from './autorisation-offre-routing.module';
import { AutorisationOffreComponent } from './autorisation-offre.component';

@NgModule({
  declarations: [AutorisationOffreComponent],
  imports: [
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    InputTextModule,
    GridModule,
    ButtonModule,
    AutorisationOffreRoutingModule
  ]
})
export class AutorisationOffreModule { }
