import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ButtonModule  } from 'primeng/button';
import { EtatinventaireRoutingModule } from './etatinventaire-routing.module';
import { EtatinventaireComponent } from './etatinventaire.component';
import { ExcelExportService, GridModule } from '@syncfusion/ej2-angular-grids';
import { InputTextModule, RadioButtonModule , OverlayPanelModule} from 'primeng/primeng';
import { MatCardModule } from '@angular/material';
import { CardModule } from 'primeng/card';
import {BlockUIModule} from 'primeng/blockui';
@NgModule({
  declarations: [EtatinventaireComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    ButtonModule,
    FormsModule,
    GridModule,
    CardModule,
    OverlayPanelModule,
    EtatinventaireRoutingModule ,
    RadioButtonModule,
    MatCardModule,
    InputTextModule,
    OverlayPanelModule,
    BlockUIModule
  ] ,
  providers: [ExcelExportService],
})
export class EtatinventaireModule { }
