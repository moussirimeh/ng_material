import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Deblocagecltsn2Component } from './deblocagecltsn2.component';

const routes: Routes = [
  {
    path: '',
    component : Deblocagecltsn2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Deblocagecltsn2RoutingModule { }
