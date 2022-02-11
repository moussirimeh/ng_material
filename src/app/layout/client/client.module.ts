import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { KeyFilterModule } from 'primeng/keyfilter';
@NgModule({
  imports: [

    CommonModule,
    KeyFilterModule ,
    NgSelectModule,
    SelectButtonModule,
    FormsModule,
    ClientRoutingModule,
    CalendarModule,
    GridModule,
    TableModule,
    TabViewModule,
    MatFormFieldModule,
    MatInputModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    PanelModule,
    OverlayPanelModule
  ],
  declarations: [ClientComponent],
})
export class ClientModule {}
