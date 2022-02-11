import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RapportAjustementComponent } from './rapport-ajustement.component';

const routes: Routes = [
  {
      path: '',
      component: RapportAjustementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RapportAjustementRoutingModule { }
