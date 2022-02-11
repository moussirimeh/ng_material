import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReimpressionBordComponent } from './reimpression-bord.component';

const routes: Routes = [
  {
      path: '',
      component: ReimpressionBordComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimpressionBordRoutingModule { }
