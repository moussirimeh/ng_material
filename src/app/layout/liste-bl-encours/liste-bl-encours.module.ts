import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ListeBlEncoursRoutingModule } from './liste-bl-encours-routing.module';
import { ListeBlEncoursComponent } from './liste-bl-encours.component';
import { CardModule } from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DuplicataModule } from '../duplicata/duplicata.module';

@NgModule({
  imports: [
    CommonModule,
    ListeBlEncoursRoutingModule,
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
    DuplicataModule
  ],
  declarations: [ListeBlEncoursComponent]
})
export class ListeBlEncoursModule {}
