import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import { MiseajourinventaireRoutingModule } from './miseajourinventaire-routing.module';
import { MiseajourinventaireComponent } from './miseajourinventaire.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {TabViewModule} from 'primeng/tabview';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CardModule } from 'primeng/card';
import { ButtonModule, InputTextModule, OverlayPanelModule } from 'primeng/primeng';
@NgModule({
  declarations: [MiseajourinventaireComponent],
  imports: [
    CommonModule,
    FormsModule ,
    TabViewModule,
    NgSelectModule,
    GridModule ,
    DialogModule,
    InputTextModule,
    OverlayPanelModule,
    CardModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ButtonModule,
    MiseajourinventaireRoutingModule
  ]
})
export class MiseajourinventaireModule { }
