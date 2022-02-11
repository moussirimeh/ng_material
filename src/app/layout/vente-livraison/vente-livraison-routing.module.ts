import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteLivraisonComponent } from './vente-livraison.component';

const routes: Routes = [
  {
    path: '',
    component: VenteLivraisonComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteLivraisonRoutingModule { }
