import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnnulationCmdCltComponent } from './annulation-cmd-clt.component';

const routes: Routes = [
  {
      path: '',
      component: AnnulationCmdCltComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnulationCmdCltRoutingModule { }
