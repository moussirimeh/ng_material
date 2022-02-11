import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChangementTitreComponent } from './changement-titre.component';

const routes: Routes = [
  {
    path : '' ,
    component : ChangementTitreComponent  ,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangementTitreRoutingModule { }
