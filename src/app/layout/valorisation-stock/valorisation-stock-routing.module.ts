import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValorisationStockComponent } from './valorisation-stock.component';

const routes: Routes = [
  {
    path : '' ,
    component : ValorisationStockComponent ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValorisationStockRoutingModule { }
