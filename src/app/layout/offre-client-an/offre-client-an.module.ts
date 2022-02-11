import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from 'primeng/button';

import { OffreClientAnRoutingModule } from './offre-client-an-routing.module';
import { OffreClientAnComponent } from './offre-client-an.component';

@NgModule({
  declarations: [OffreClientAnComponent],
  imports: [
    CommonModule,
    GridModule,
    ButtonModule,
    OffreClientAnRoutingModule
  ],
  providers: [ ExcelExportService ],
})
export class OffreClientAnModule { }
