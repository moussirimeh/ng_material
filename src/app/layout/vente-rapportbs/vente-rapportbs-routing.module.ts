import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteRapportbsComponent } from './vente-rapportbs.component';

const routes: Routes = [
  {
    path: '',
    component: VenteRapportbsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteRapportbsRoutingModule { }
