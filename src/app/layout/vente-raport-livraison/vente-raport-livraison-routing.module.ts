import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteRaportLivraisonComponent } from './vente-raport-livraison.component';

const routes: Routes = [
  {
    path: '',
    component: VenteRaportLivraisonComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteRaportLivraisonRoutingModule { }
