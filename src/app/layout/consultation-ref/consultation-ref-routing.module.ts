import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationRefComponent } from './consultation-ref.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationRefComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationRefRoutingModule { }
