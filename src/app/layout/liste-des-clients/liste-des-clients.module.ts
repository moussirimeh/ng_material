import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import {ButtonModule} from 'primeng/button';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import { ListeDesClientsRoutingModule } from './liste-des-clients-routing.module';
import { ListeDesClientsComponent } from './liste-des-clients.component';
@NgModule({
  declarations: [ListeDesClientsComponent],
  imports: [
    CommonModule,
    FormsModule,
    OverlayPanelModule,
    NgSelectModule,
    GridModule,
    ButtonModule,
    ListeDesClientsRoutingModule
  ]
})
export class ListeDesClientsModule { }
