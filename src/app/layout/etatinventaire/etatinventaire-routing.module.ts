import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatinventaireComponent } from './etatinventaire.component';

const routes: Routes = [
  {
    path: '',
    component : EtatinventaireComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatinventaireRoutingModule { }
