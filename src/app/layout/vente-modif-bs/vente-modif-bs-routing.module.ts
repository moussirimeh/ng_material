import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteModifBSComponent } from './vente-modif-bs.component';
const routes: Routes = [
  {
    path: '',
    component: VenteModifBSComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteModifBSRoutingModule { }
