import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MesMessagesEnvComponent } from './mes-messages-env.component';

const routes: Routes = [
  {
    path: '',
    component: MesMessagesEnvComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesMessagesEnvRoutingModule { }
