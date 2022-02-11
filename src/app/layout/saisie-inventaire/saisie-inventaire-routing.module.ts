import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SaisieInventaireComponent } from './saisie-inventaire.component';

const routes: Routes = [
  {
    path: '',
    component : SaisieInventaireComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SaisieInventaireRoutingModule { }
