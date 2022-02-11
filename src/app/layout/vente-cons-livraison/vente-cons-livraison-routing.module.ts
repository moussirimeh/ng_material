import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteConsLivraisonComponent } from './vente-cons-livraison.component';

const routes: Routes = [
  {
    path: '',
    component: VenteConsLivraisonComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteConsLivraisonRoutingModule { }
