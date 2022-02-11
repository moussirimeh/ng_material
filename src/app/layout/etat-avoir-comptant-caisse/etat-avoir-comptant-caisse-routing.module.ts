import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatAvoirComptantCaisseComponent } from './etat-avoir-comptant-caisse.component';

const routes: Routes = [
  {
    path: '',
    component: EtatAvoirComptantCaisseComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatAvoirComptantCaisseRoutingModule { }
