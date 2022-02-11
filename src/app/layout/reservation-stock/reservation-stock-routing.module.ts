import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationStockComponent } from './reservation-stock.component';

const routes: Routes = [
  {
    path: '',
    component: ReservationStockComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationStockRoutingModule { }
