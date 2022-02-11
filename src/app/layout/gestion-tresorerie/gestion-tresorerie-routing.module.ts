import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionTresorerieComponent } from './gestion-tresorerie.component';

const routes: Routes = [{
  path: '',
  component: GestionTresorerieComponent
}];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionTresorerieRoutingModule { }
