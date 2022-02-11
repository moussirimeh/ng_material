import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreanceClientComponent } from './creance-client.component';

const routes: Routes = [
  {
      path: '',
      component: CreanceClientComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreanceClientRoutingModule { }
