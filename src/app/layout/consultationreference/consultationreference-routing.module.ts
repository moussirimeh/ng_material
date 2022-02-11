import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationreferenceComponent } from './consultationreference.component';


const routes: Routes = [
  {
    path: '',
    component : ConsultationreferenceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationreferenceRoutingModule { }
