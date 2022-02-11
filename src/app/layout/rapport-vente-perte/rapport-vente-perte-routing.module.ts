import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportVentePerteComponent } from './rapport-vente-perte.component';

const routes: Routes = [
  {
    path: '',
    component: RapportVentePerteComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportVentePerteRoutingModule { }
