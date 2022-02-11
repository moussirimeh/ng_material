import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule, SearchService, ToolbarService} from '@syncfusion/ej2-angular-grids';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';

import { OffreClientRoutingModule } from './offre-client-routing.module';
import { OffreClientComponent } from './offre-client.component';

@NgModule({
  declarations: [OffreClientComponent],
  imports: [
    CommonModule,
    GridModule,
    DialogModule,
    ButtonModule,
    NgSelectModule,
    GridAllModule,
    OffreClientRoutingModule
  ],
  providers: [ ExcelExportService, SearchService, ToolbarService ],
})
export class OffreClientModule { }
