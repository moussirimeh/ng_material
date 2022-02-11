import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EvolutionChiffresAffairesComponent } from './evolution-chiffres-affaires.component';

const routes: Routes = [
  {
    path: '',
    component: EvolutionChiffresAffairesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvolutionChiffresAffairesRoutingModule { }
