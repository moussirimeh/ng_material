import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffreClientComponent } from './offre-client.component';
const routes: Routes = [
  {
    path: '',
    component: OffreClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreClientRoutingModule { }
