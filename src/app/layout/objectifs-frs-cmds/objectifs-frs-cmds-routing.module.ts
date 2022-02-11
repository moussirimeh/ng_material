import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObjectifsFrsCmdsComponent } from './objectifs-frs-cmds.component';

const routes: Routes = [
  {
    path : '' ,
    component : ObjectifsFrsCmdsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObjectifsFrsCmdsRoutingModule { }
