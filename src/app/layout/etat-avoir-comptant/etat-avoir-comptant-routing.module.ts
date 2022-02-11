import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatAvoirComptantComponent } from './etat-avoir-comptant.component';

const routes: Routes = [
  {
    path: '',
    component: EtatAvoirComptantComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatAvoirComptantRoutingModule { }
