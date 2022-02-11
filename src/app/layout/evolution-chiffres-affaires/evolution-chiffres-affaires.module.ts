import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { EvolutionChiffresAffairesRoutingModule } from './evolution-chiffres-affaires-routing.module';
import { EvolutionChiffresAffairesComponent } from './evolution-chiffres-affaires.component';

import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [EvolutionChiffresAffairesComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    ButtonModule,
    FormsModule,
    GridModule,
    TableModule,

    EvolutionChiffresAffairesRoutingModule

  ],
  providers: [ ExcelExportService]
})
export class EvolutionChiffresAffairesModule { }
