import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {InputTextModule} from 'primeng/inputtext';
import { FormsModule as FormModule, ReactiveFormsModule } from '@angular/forms';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { FicheClientRoutingModule } from './fiche-client-routing.module';
import { FicheClientComponent } from './fiche-client.component';
import {CardModule} from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import {ButtonModule} from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { EtatCommandeClientModule } from '../etat-commande-client/etat-commande-client.module';
 import { ReleveClientModule } from '../releveClient/releveClient.module';
import { ReglementClientModule } from '../reglementClient/reglementClient.module';
import { AnalyseCaMargesModule } from '../analyse-ca-marges/analyse-ca-marges.module';
import { EtatOffreEnvoyeModule } from '../etat-offre-envoye/etat-offre-envoye.module';
@NgModule({
  declarations: [FicheClientComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    FormModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    DialogModule,
    CardModule,
    NgSelectModule,
    FicheClientRoutingModule,
    ReleveClientModule,
    ReglementClientModule,
    AnalyseCaMargesModule,
    EtatOffreEnvoyeModule,
    EtatCommandeClientModule
  ]
})
export class FicheClientModule { }
