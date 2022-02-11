import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteAnalyseCaComponent } from './vente-analyse-ca.component';

const routes: Routes = [
  {
    path: '',
    component:  VenteAnalyseCaComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteAnalyseCaRoutingModule { }
