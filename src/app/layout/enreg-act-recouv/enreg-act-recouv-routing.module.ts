import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnregActRecouvComponent } from './enreg-act-recouv.component';

const routes: Routes = [
  {
    path: '',
    component: EnregActRecouvComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnregActRecouvRoutingModule { }
