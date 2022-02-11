import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LancementInventaireRoutingModule } from './lancement-inventaire-routing.module';
import { LancementInventaireComponent } from './lancement-inventaire.component';
import { FormsModule } from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BlockUIModule } from 'primeng/blockui';

@NgModule({
    imports: [CommonModule, LancementInventaireRoutingModule, FormsModule, ButtonModule, CalendarModule, OverlayPanelModule, BlockUIModule],
    declarations: [LancementInventaireComponent]
})
export class LancementInventaireModule {}
