import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatRegCltsComponent } from './etat-reg-clts.component';

const routes: Routes = [
  {
      path: '',
      component: EtatRegCltsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatRegCltsRoutingModule { }
