import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FicheStockDetailComponent} from './fiche-stock-detail.component';
const routes: Routes = [
  {
    path: '',
    component : FicheStockDetailComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FicheStockDetailRoutingModule { }
