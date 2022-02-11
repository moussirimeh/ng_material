import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DemandeDevisRoutingModule } from './demande-devis-routing.module';
import { DemandeDevisComponent } from './demande-devis.component';
import { CardModule } from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { GridModule, EditService, ToolbarService, SortService } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import {TableModule} from 'primeng/table';
@NgModule({
  imports: [
    CommonModule,
    DemandeDevisRoutingModule,
    CardModule,
    NgSelectModule,
    PanelModule,
    DropdownModule,
    SelectButtonModule,
    GridModule,
    FormsModule,
    ToastModule,
    CalendarModule,
    ButtonModule,
    DialogModule,
    TableModule
  ],
  declarations: [DemandeDevisComponent],
  providers: [EditService, ToolbarService, SortService]
})
export class DemandeDevisModule {}
