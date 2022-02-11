import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { ChiffAffRepresFourRoutingModule } from "./chiffAffRepresFour-routing.module";
import { ChiffAffRepresFourComponent } from "./chiffAffRepresFour.component";
import { CardModule } from "primeng/card";
import { GridModule, ExcelExportService } from "@syncfusion/ej2-angular-grids";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { SelectButtonModule } from "primeng/selectbutton";
import { DropdownModule } from "primeng/dropdown";
import { PanelModule } from "primeng/panel";
import { ButtonModule } from "primeng/button";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { BlockUIModule } from "primeng/blockui";
@NgModule({
  imports: [
    CommonModule,
    ChiffAffRepresFourRoutingModule,
    CardModule,
    NgSelectModule,
    PanelModule,
    DropdownModule,
    SelectButtonModule,
    GridModule,
    FormsModule,
    ButtonModule,
    OverlayPanelModule,
    BlockUIModule,
  ],
  declarations: [ChiffAffRepresFourComponent],
  providers: [ExcelExportService],
  bootstrap: [ChiffAffRepresFourComponent],
})
export class ChiffAffRepresFourModule {}
