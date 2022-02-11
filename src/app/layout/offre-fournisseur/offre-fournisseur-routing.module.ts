import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffreFournisseurComponent } from './offre-fournisseur.component';

const routes: Routes = [
  {
    path: '',
    component: OffreFournisseurComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreFournisseurRoutingModule { }
