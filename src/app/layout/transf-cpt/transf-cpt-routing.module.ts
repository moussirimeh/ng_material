import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransfCptComponent } from './transf-cpt.component';

const routes: Routes = [
  {
    path: '' ,
    component: TransfCptComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfCptRoutingModule { }
