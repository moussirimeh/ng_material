import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DuplicataRoutingModule } from './duplicata-routing.module';
import { DuplicataComponent } from './duplicata.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
@NgModule({
  imports: [
    CommonModule,
    DuplicataRoutingModule,
    GridModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    OverlayPanelModule,
    InputTextModule
  ],
  declarations: [DuplicataComponent],
  exports: [DuplicataComponent],
})
export class DuplicataModule {}
