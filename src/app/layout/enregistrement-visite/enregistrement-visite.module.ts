import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EnregistrementVisiteRoutingModule } from './enregistrement-visite-routing.module';
import { EnregistrementVisiteComponent } from './enregistrement-visite.component';
import { CardModule } from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import {RadioButtonModule} from 'primeng/radiobutton';
import { DialogModule } from 'primeng/dialog';
import { ProgrammationVisiteModule } from '../programmation-visite/programmation-visite.module';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {InputTextModule} from 'primeng/inputtext';
import {KeyFilterModule} from 'primeng/keyfilter';
// import {ConfirmationService} from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    EnregistrementVisiteRoutingModule,
    CardModule,
    NgSelectModule,
    InputTextareaModule,
    PanelModule,
    DropdownModule,
    SelectButtonModule,
    GridModule,
    FormsModule,
    OverlayPanelModule,
    CalendarModule,
    ButtonModule,
    RadioButtonModule,
    DialogModule,
    ConfirmDialogModule,
    InputTextModule,
    KeyFilterModule,
    // ConfirmationService,
    ProgrammationVisiteModule
  ],
  declarations: [EnregistrementVisiteComponent]
})
export class EnregistrementVisiteModule {}
