import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceptionRegltFournisseurComponent } from './reception-reglt-fournisseur.component';

const routes: Routes = [
  {
      path: '',
      component: ReceptionRegltFournisseurComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptionRegltFournisseurRoutingModule { }
