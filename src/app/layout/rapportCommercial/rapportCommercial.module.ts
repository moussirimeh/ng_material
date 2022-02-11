import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RapportCommercialRoutingModule } from './rapportCommercial-routing.module';
import { RapportCommercialComponent } from './rapportCommercial.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    RapportCommercialRoutingModule,
    CardModule,
    NgSelectModule,
    InputTextareaModule,
    PanelModule,
    DropdownModule,
    SelectButtonModule,
    GridModule,
    FormsModule,
    OverlayPanelModule
  ],
  declarations: [RapportCommercialComponent]
})
export class RapportCommercialModule {}
