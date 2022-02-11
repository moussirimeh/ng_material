import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlEnCoursComponent } from './bl-en-cours.component';

const routes: Routes = [
  {
      path: '',
      component: BlEnCoursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlEnCoursRoutingModule { }
