import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FusionreferenceRoutingModule } from "./fusionreference-routing.module";
import { FusionreferenceComponent } from "./fusionreference.component";
import { FormsModule } from "@angular/forms";
import { MatCardModule, MatSelectModule } from "@angular/material";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { BlockUIModule } from "primeng/blockui";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { InputTextModule } from "primeng/inputtext";
@NgModule({
  declarations: [FusionreferenceComponent],
  imports: [
    CommonModule,
    FusionreferenceRoutingModule,
    MatCardModule,
    FormsModule,
    MatSelectModule,
    OverlayPanelModule,
    BlockUIModule,
    ConfirmDialogModule,
    InputTextModule,
  ],
})
export class FusionreferenceModule {}
