import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionArticlesComponent } from './gestion-articles.component';

const routes: Routes = [{
  path: '',
  component: GestionArticlesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionArticlesRoutingModule { }
