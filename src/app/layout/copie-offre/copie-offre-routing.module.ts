import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CopieOffreComponent } from './copie-offre.component';

const routes: Routes = [
  {
    path: '',
    component: CopieOffreComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CopieOffreRoutingModule { }
