import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatOffreEnvoyeComponent } from './etat-offre-envoye.component';

const routes: Routes = [
  {
    path : '' ,
    component : EtatOffreEnvoyeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatOffreEnvoyeRoutingModule { }
