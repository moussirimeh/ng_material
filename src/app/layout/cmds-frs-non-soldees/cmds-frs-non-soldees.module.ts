import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmdsFrsNonSoldeesRoutingModule } from './cmds-frs-non-soldees-routing.module';
import { CmdsFrsNonSoldeesComponent } from './cmds-frs-non-soldees.component';
import { ButtonModule, CalendarModule, FieldsetModule, InputTextModule, RadioButtonModule } from 'primeng/primeng';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [CmdsFrsNonSoldeesComponent],
  providers: [ExcelExportService],
  imports: [
    CommonModule,
    CmdsFrsNonSoldeesRoutingModule,
    ButtonModule,
    NgSelectModule,
    CalendarModule,
    FormsModule,
    MatCardModule,
    RadioButtonModule,
    FieldsetModule,
    GridModule,
    InputTextModule,
  ] ,
  exports : [CmdsFrsNonSoldeesComponent]
})
export class CmdsFrsNonSoldeesModule { }
