import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListeDesClientsComponent } from './liste-des-clients.component';

const routes: Routes = [
  {
    path: '',
    component: ListeDesClientsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListeDesClientsRoutingModule { }
