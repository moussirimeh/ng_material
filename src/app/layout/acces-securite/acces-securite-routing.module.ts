import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccesSecuriteComponent } from './acces-securite.component';

const routes: Routes = [
  {
    path: '',
    component: AccesSecuriteComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccesSecuriteRoutingModule { }
