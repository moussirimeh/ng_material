import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetClientsNoyeauComponent } from './det-clients-noyeau.component';

const routes: Routes = [
  {
    path: '',
    component : DetClientsNoyeauComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetClientsNoyeauRoutingModule { }
