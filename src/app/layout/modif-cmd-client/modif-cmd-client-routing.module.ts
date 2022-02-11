import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModifCmdClientComponent } from './modif-cmd-client.component';

const routes: Routes = [
  {
      path: '',
      component: ModifCmdClientComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModifCmdClientRoutingModule { }
