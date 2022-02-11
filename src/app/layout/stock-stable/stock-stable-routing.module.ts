import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockStableComponent } from './stock-stable.component';

const routes: Routes = [
  {
    path: '',
    component : StockStableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockStableRoutingModule { }
