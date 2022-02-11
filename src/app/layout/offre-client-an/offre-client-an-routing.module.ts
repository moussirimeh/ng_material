import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffreClientAnComponent } from './offre-client-an.component';

const routes: Routes = [
  {
    path: '',
    component: OffreClientAnComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreClientAnRoutingModule { }
