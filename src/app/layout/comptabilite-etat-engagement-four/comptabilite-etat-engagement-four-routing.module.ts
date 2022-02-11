import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComptabiliteEtatEngagementFourComponent } from './comptabilite-etat-engagement-four.component';

const routes: Routes = [
  {
      path: '',
      component: ComptabiliteEtatEngagementFourComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteEtatEngagementFourRoutingModule { }
