import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObjectifsFrsRealiseComponent } from './objectifs-frs-realise.component';

const routes: Routes = [
  {
    path: '',
    component: ObjectifsFrsRealiseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectifsFrsRealiseRoutingModule { }
