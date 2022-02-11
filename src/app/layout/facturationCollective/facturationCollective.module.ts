import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FacturationCollectiveRoutingModule } from './facturationCollective-routing.module';
import { FacturationCollectiveComponent } from './facturationCollective.component';
import { CardModule } from 'primeng/card';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  imports: [
    CommonModule,
    FacturationCollectiveRoutingModule,
    CardModule,
    GridModule,
    PanelModule,
    BlockUIModule,
    ProgressSpinnerModule
  ],
  declarations: [FacturationCollectiveComponent]
})
export class FacturationCollectiveModule {}
