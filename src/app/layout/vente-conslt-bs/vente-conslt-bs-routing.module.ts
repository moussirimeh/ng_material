import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VenteConsltBsComponent } from '../vente-conslt-bs/vente-conslt-bs.component';
const routes: Routes = [
  {
    path: '',
    component: VenteConsltBsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteConsltBsRoutingModule { }
