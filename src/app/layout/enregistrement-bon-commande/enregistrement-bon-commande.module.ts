import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnregistrementBonCommandeRoutingModule } from './enregistrement-bon-commande-routing.module';
import { EnregistrementBonCommandeComponent } from './enregistrement-bon-commande.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {BlockUIModule} from 'primeng/blockui';


@NgModule({
  declarations: [EnregistrementBonCommandeComponent],
  imports: [
    CommonModule,
    BlockUIModule,
    OverlayPanelModule,
    NgSelectModule,
    InputTextModule,
    FormsModule,
    ButtonModule,
    EnregistrementBonCommandeRoutingModule
  ]
})
export class EnregistrementBonCommandeModule { }
