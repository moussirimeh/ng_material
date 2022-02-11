import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnregActRecouvMultComponent } from './enreg-act-recouv-mult.component';

const routes: Routes = [
  {
    path: '',
    component: EnregActRecouvMultComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnregActRecouvMultRoutingModule { }
