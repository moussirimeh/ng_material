import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelanceDynamiqueRoutingModule } from './relance-dynamique-routing.module';
import { RelanceDynamiqueComponent } from './relance-dynamique.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ButtonModule, OverlayPanelModule } from 'primeng/primeng';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';

@NgModule({
  declarations: [RelanceDynamiqueComponent],
  imports: [
    CommonModule,
    RelanceDynamiqueRoutingModule,
    NgSelectModule,
    FormsModule,
    ButtonModule,
    GridModule ,
    OverlayPanelModule
  ],
  providers: [ ExcelExportService ],
})
export class RelanceDynamiqueModule { }
