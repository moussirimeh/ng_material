import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatVisiteClientComponent } from './etat-visite-client.component';

const routes: Routes = [
  {
    path :'' ,
    component : EtatVisiteClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatVisiteClientRoutingModule { }
