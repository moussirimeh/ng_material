import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NouvelleOffreRgMgComponent } from './nouvelle-offre-rg-mg.component';

const routes: Routes = [
  {
    path: '',
    component: NouvelleOffreRgMgComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NouvelleOffreRgMgRoutingModule { }
