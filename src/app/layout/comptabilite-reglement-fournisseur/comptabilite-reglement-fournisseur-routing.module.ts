import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComptabiliteReglementFournisseurComponent } from './comptabilite-reglement-fournisseur.component';
const routes: Routes = [
  {
      path: '',
      component: ComptabiliteReglementFournisseurComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComptabiliteReglementFournisseurRoutingModule { }
