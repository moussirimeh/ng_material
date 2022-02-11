import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaionActionRecouvrementComponent } from './consultaion-action-recouvrement.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaionActionRecouvrementComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaionActionRecouvrementRoutingModule { }
