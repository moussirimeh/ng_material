import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoriqueTypoClientsComponent } from './historique-typo-clients.component';
import { HistoriqueTypoClientsRoutingModule } from './historique-typo-clients-routing.module';
import {ButtonModule} from 'primeng/button';
import { GridModule, ExcelExportService } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
@NgModule({
  declarations: [HistoriqueTypoClientsComponent],
  imports: [
    CommonModule,
    ButtonModule,
    GridModule,
    FormModule,
    HistoriqueTypoClientsRoutingModule,
    NgSelectModule
  ],
  providers: [ ExcelExportService]
})
export class HistoriqueTypoClientsModule { }
