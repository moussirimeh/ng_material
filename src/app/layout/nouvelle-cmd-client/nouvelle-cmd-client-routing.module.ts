import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NouvelleCmdClientComponent } from './nouvelle-cmd-client.component';


const routes: Routes = [
  {
      path: '',
      component: NouvelleCmdClientComponent
  }
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class NouvelleCmdClientRoutingModule { }
