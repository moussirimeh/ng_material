import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteBsfermesComponent } from './vente-bsfermes.component';

const routes: Routes = [
  {
    path: '',
    component: VenteBsfermesComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteBsfermesRoutingModule { }
