import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffreArticleComponent } from './offre-article.component';

const routes: Routes = [
  {
    path: '',
    component: OffreArticleComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreArticleRoutingModule { }
