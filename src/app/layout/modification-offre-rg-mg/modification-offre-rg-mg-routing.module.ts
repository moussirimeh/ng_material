import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModificationOffreRgMgComponent } from './modification-offre-rg-mg.component';

const routes: Routes = [
  {
    path: '',
    component: ModificationOffreRgMgComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModificationOffreRgMgRoutingModule { }
