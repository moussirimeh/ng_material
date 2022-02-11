import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { EtatFactureRoutingModule } from "./etat-facture-routing.module";
import { EtatFactureComponent } from "./etat-facture.component";
import { FormsModule } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { ButtonModule } from "primeng/button";
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  imports: [
    CommonModule,
    EtatFactureRoutingModule,
    FormsModule,
    CalendarModule,
    ButtonModule,
    OverlayPanelModule
  ],
  declarations: [EtatFactureComponent],
})
export class EtatFactureModule {}
