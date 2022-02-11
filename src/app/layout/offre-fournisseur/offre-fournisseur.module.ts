import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridAllModule, SearchService, ToolbarService} from '@syncfusion/ej2-angular-grids';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { NgSelectModule } from '@ng-select/ng-select';

import { OffreFournisseurRoutingModule } from './offre-fournisseur-routing.module';
import { OffreFournisseurComponent } from './offre-fournisseur.component';

@NgModule({
  declarations: [OffreFournisseurComponent],
  imports: [
    CommonModule,
    GridModule,
    DialogModule,
    ButtonModule,
    NgSelectModule,
    GridAllModule,
    OffreFournisseurRoutingModule
  ],
  providers: [ ExcelExportService, SearchService, ToolbarService ],
})
export class OffreFournisseurModule { }
