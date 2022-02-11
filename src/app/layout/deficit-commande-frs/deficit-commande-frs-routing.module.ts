import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeficitCommandeFrsComponent } from './deficit-commande-frs.component';

const routes: Routes = [
  {
      path: '',
      component: DeficitCommandeFrsComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeficitCommandeFrsRoutingModule { }
