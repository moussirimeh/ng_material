import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { AjustementReferenceRoutingModule } from './ajustementReference-routing.module';
import { AjustementReferenceComponent } from './ajustementReference.component';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AjustementReferenceRoutingModule,
    CalendarModule,
    GridModule,
    TabViewModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    PanelModule,
    OverlayPanelModule,
    KeyFilterModule,
    ConfirmDialogModule
  ],
  declarations: [AjustementReferenceComponent]
})
export class AjustementReferenceModule {}
