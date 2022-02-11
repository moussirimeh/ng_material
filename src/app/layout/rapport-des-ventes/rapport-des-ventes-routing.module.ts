import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportDesVentesComponent } from './rapport-des-ventes.component';

const routes: Routes = [
  {
    path: '',
    component: RapportDesVentesComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportDesVentesRoutingModule { }
