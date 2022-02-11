import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FicheVendeurComponent } from './fiche-vendeur.component';

const routes: Routes = [
  {
    path: '',
    component: FicheVendeurComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FicheVendeurRoutingModule { }
