import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiseAJourBdComponent } from './mise-a-jour-bd.component';

const routes: Routes = [
  {
      path: '',
      component: MiseAJourBdComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiseAJourBdRoutingModule { }
