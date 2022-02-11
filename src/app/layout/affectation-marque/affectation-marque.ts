import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AffectationMarqueComponent } from './affectation-marque.component';

const routes: Routes = [
  {
    path: '',
    component: AffectationMarqueComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRefRoutingModule { }
