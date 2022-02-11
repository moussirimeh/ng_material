import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatParamtresComponent } from './etat-paramtres.component';

const routes: Routes = [
  {
      path: '',
      component: EtatParamtresComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatParamtresRoutingModule { }
