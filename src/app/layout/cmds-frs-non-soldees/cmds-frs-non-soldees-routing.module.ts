import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmdsFrsNonSoldeesComponent } from './cmds-frs-non-soldees.component';

const routes: Routes = [
  {
    path: '',
    component: CmdsFrsNonSoldeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmdsFrsNonSoldeesRoutingModule { }
