import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationRegFourComponent } from './consultation-reg-four.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationRegFourComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRegFourRoutingModule { }
