import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutModifSuppRefComponent } from './ajout-modif-supp-ref.component';

const routes: Routes = [
  {
      path: '',
      component: AjoutModifSuppRefComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AjoutModifSuppRefRoutingModule { }
