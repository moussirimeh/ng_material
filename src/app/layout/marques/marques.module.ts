import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MarquesRoutingModule } from "./marques-routing.module";
import { MarquesComponent } from "./marques.component";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { PanelModule } from "primeng/panel";
import { FilterService, GridAllModule } from "@syncfusion/ej2-angular-grids";
import { FormsModule } from "@angular/forms";
import { OverlayPanelModule } from "primeng/overlaypanel";
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
  imports: [
    CommonModule,
    MarquesRoutingModule,
    InputTextModule,
    ButtonModule,
    PanelModule,
    GridAllModule,
    FormsModule,
    OverlayPanelModule,
    ConfirmDialogModule
  ],
  declarations: [MarquesComponent],
  providers: [FilterService],
})
export class MarquesModule {}
