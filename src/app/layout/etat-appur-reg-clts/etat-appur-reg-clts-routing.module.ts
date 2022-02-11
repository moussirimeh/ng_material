import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EtatAppurRegCltsComponent } from './etat-appur-reg-clts.component';

const routes: Routes = [
  {
      path: '',
      component: EtatAppurRegCltsComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtatAppurRegCltsRoutingModule { }
