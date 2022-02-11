import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoriqueTypoClientsComponent } from './historique-typo-clients.component';

const routes: Routes = [{
  path: '',
  component: HistoriqueTypoClientsComponent
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoriqueTypoClientsRoutingModule { }
