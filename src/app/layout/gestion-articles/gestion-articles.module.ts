import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GestionArticlesRoutingModule } from "./gestion-articles-routing.module";
import { GestionArticlesComponent } from "./gestion-articles.component";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { GridModule} from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';

@NgModule({
  declarations: [GestionArticlesComponent],
  imports: [
    CommonModule,
    GestionArticlesRoutingModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    GridModule,
    DropdownModule,
    InputTextareaModule
  ]
})
export class GestionArticlesModule {}
