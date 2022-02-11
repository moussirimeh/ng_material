import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReeditionRapportAchatComponent } from './reedition-rapport-achat.component';

const routes: Routes = [
  {
    path: '',
    component: ReeditionRapportAchatComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReeditionRapportAchatRoutingModule { }
