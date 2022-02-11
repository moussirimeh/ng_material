import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangementTitreRoutingModule } from './changement-titre-routing.module';
import { ChangementTitreComponent } from './changement-titre.component';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule, CalendarModule , DialogModule, OverlayPanelModule} from 'primeng/primeng';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MatCardModule } from '@angular/material';
import { SortService} from '@syncfusion/ej2-angular-grids';
import { TableModule } from 'primeng/table';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [ChangementTitreComponent],
  imports: [
    CommonModule,
    ChangementTitreRoutingModule,
    FormsModule,
    NgSelectModule,
    ButtonModule,
    CalendarModule ,
    GridModule ,
    RadioButtonModule ,
    InputTextModule ,
    KeyFilterModule,
    MatCardModule,
    OverlayPanelModule,
    DialogModule ,
    TableModule , FlexLayoutModule.withConfig({addFlexToParent: false})


  ],
  providers: [SortService]
})
export class ChangementTitreModule { }
