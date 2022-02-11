import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteBSOuvertsComponent } from './vente-bsouverts.component';
const routes: Routes = [
  {
    path: '',
    component: VenteBSOuvertsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteBSOuvertsRoutingModule { }
