import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StockenmouvementComponent } from './stockenmouvement.component';

const routes: Routes = [
  {
    path: '',
    component : StockenmouvementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockenmouvementRoutingModule { }
