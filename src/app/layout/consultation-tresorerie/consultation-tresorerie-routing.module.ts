import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultationTresorerieComponent } from './consultation-tresorerie.component';

const routes: Routes = [
  {
      path: '',
      component: ConsultationTresorerieComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultationTresorerieRoutingModule { }
