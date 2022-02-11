import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutorisationOffreComponent } from './autorisation-offre.component';

const routes: Routes = [
  {
    path: '',
    component: AutorisationOffreComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorisationOffreRoutingModule { }
