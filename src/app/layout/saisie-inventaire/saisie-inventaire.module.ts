import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaisieInventaireRoutingModule } from './saisie-inventaire-routing.module';
import { SaisieInventaireComponent } from './saisie-inventaire.component';
import { ButtonModule, InputTextModule, KeyFilterModule, OverlayPanelModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {AutoCompleteModule} from 'primeng/autocomplete';

@NgModule({
  declarations: [SaisieInventaireComponent],
  imports: [
    CommonModule,
    SaisieInventaireRoutingModule,
    InputTextModule,
    FormsModule,
    NgSelectModule,
    ButtonModule,
    GridModule,
    OverlayPanelModule ,
    KeyFilterModule,
    AutoCompleteModule
  ]
})
export class SaisieInventaireModule { }
