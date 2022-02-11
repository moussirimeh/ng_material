import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteAnnulBsComponent } from './vente-annul-bs.component';

const routes: Routes = [
  {
    path: '',
    component: VenteAnnulBsComponent
}
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteAnnulBsRoutingModule { }
