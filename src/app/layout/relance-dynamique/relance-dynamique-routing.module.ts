import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RelanceDynamiqueComponent } from './relance-dynamique.component';

const routes: Routes = [
  {
    path: '' ,
    component : RelanceDynamiqueComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RelanceDynamiqueRoutingModule { }
