import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from 'primeng/button';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { VerificationCommandeRoutingModule } from './verification-commande-routing.module';
import { VerificationCommandeComponent } from './verification-commande.component';

@NgModule({
  declarations: [VerificationCommandeComponent],
  imports: [
    CommonModule,
    FormModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    InputTextModule,
    GridModule,
    ButtonModule,
    VerificationCommandeRoutingModule
  ],
  providers: [ ExcelExportService ],
})
export class VerificationCommandeModule { }
