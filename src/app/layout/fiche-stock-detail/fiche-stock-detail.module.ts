import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FicheStockDetailRoutingModule } from './fiche-stock-detail-routing.module';
import { FicheStockDetailComponent } from './fiche-stock-detail.component';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { FormsModule as FormModule, FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TabViewModule} from 'primeng/tabview';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import {MatIconModule} from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';
import { EtatOffreEnvoyeModule } from '../etat-offre-envoye/etat-offre-envoye.module';
import { EtatCommandeClientModule } from '../etat-commande-client/etat-commande-client.module';
import { CmdsFrsNonSoldeesModule } from '../cmds-frs-non-soldees/cmds-frs-non-soldees.module';
@NgModule({
  declarations: [FicheStockDetailComponent],
  imports: [
    CommonModule,
    FicheStockDetailRoutingModule,
    GridModule,
    DialogModule,
    FormsModule,
    ButtonModule,
    TabViewModule,
    InputTextareaModule,
    InputTextModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    EtatOffreEnvoyeModule ,
    EtatCommandeClientModule ,
    CmdsFrsNonSoldeesModule

  ]
})
export class FicheStockDetailModule { }
