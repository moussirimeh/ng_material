import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteAjoutBSComponent } from './vente-ajout-bs.component';

const routes: Routes = [
  {
    path: '',
    component: VenteAjoutBSComponent
}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteAjoutBSRoutingModule { }
